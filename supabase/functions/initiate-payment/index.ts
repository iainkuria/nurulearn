import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  email: string
  contentId: string
  contentType: 'course' | 'video' | 'quiz' | 'note'
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { amount, email, contentId, contentType }: PaymentRequest = await req.json()

    console.log('Initiating payment:', { amount, email, contentId, contentType, userId: user.id })

    // Generate unique reference
    const reference = `${contentType}_${contentId}_${user.id}_${Date.now()}`

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        content_id: contentId,
        content_type: contentType,
        amount,
        currency: 'KES',
        reference,
        status: 'pending',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment record error:', paymentError)
      throw paymentError
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        currency: 'KES',
        reference,
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-webhook`,
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      console.error('Paystack error:', paystackData)
      throw new Error(paystackData.message || 'Payment initialization failed')
    }

    console.log('Payment initialized:', paystackData)

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: payment.id,
        authorizationUrl: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in initiate-payment:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
