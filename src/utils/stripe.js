import Stripe from "stripe";

const stripe = Stripe('sk_test_51QbNFjGWuPv4JbNj3GNLWRuO1JSJrE58wnvDjJXP6IH77ZDVaqLzU0yu6lZt9TeFB2igzFLebgeDd9JeyAadnjO800Vwv3ZNse')

// we use this when we have to make custom form for checkout
async function createPaymentIntent(req, res) {
    try {
        const { amount, currency } = req.body

        console.log("req.body", req.body)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        })

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in creating intent",
            error: error.message
        })
    }
}

// we use this api when we need stripe default checkout form
async function createCheckoutSession(req, res) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Test Payment',
                        },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ], mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        })

        if (!session) {
            return res.status(500).json({
                message: "Something went wrong in payment"
            })
        }

        return res.status(200).json({
            url: session.url
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export default { createPaymentIntent, createCheckoutSession }