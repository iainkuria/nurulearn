import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
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

    const signature = req.headers.get('x-paystack-signature')
    const body = await req.text()

    // Verify webhook signature using Web Crypto API
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(paystackKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(body)
    )
    
    const hash = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (hash !== signature) {
      console.error('Invalid signature')
      return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)

    console.log('Webhook event received:', event.event)

    if (event.event === 'charge.success') {
      const { reference, status, amount } = event.data

      console.log('Processing successful charge:', { reference, status, amount })

      // Update payment record
      const { data: payment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          verified_at: new Date().toISOString(),
          gateway_response: event.data,
        })
        .eq('reference', reference)
        .select()
        .single()

      if (updateError) {
        console.error('Payment update error:', updateError)
        throw updateError
      }

      // If content is a course, create enrollment
      if (payment.content_type === 'course') {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .upsert({
            user_id: payment.user_id,
            course_id: payment.content_id,
            payment_id: payment.id,
          }, {
            onConflict: 'user_id,course_id',
            ignoreDuplicates: true,
          })

        if (enrollError) {
          console.error('Enrollment error:', enrollError)
        } else {
          console.log('Enrollment created/updated for user:', payment.user_id)
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in paystack-webhook:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
