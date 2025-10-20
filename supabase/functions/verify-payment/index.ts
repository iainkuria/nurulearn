import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { reference } = await req.json()

    console.log('Verifying payment:', reference)

    // Verify with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${paystackKey}`,
        },
      }
    )

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      throw new Error(paystackData.message || 'Verification failed')
    }

    const { status, amount, customer } = paystackData.data

    console.log('Paystack verification result:', { status, amount, customer })

    // Update payment record
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: status === 'success' ? 'completed' : 'failed',
        verified_at: new Date().toISOString(),
        gateway_response: paystackData.data,
      })
      .eq('reference', reference)
      .select()
      .single()

    if (updateError) {
      console.error('Payment update error:', updateError)
      throw updateError
    }

    // If payment successful and content is a course, create enrollment
    if (status === 'success' && payment.content_type === 'course') {
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({
          user_id: payment.user_id,
          course_id: payment.content_id,
          payment_id: payment.id,
        })

      if (enrollError && enrollError.code !== '23505') { // Ignore duplicate enrollment
        console.error('Enrollment error:', enrollError)
      } else {
        console.log('Enrollment created for user:', payment.user_id)
      }
    }

    return new Response(
      JSON.stringify({
        success: status === 'success',
        payment,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in verify-payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
