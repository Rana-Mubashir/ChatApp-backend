import { Router } from "express";
import stripeController from '../utils/stripe.js'

const stripeRouter=Router()

stripeRouter.post('/createpaymentintent',stripeController.createPaymentIntent)

stripeRouter.post('/createsessioncheckout',stripeController.createCheckoutSession)

export default stripeRouter