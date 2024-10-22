import { sendEmail } from '../../utils.js';
import { stripe } from '../constants/keys.js';
import PaymentSession from '../models/paymentSessions.js';


export default async function createPaymentSession(req, res) {
    const sessions = {};
    const { title, description, amount, image, agentName, agentNum, agentEmail } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card', 'cashapp'],
            metadata: { title, description, image },
        });

        const sessionId = paymentIntent.id;
        const uniqueUrl = `http://localhost:5173/payment/${sessionId}`;

        const newSession = new PaymentSession({
            sessionId: sessionId,
            status: 'pending',
            amount: amount,
            productDetails: { title, description, image },
            agentDetails: { agentName, agentNum, agentEmail },
            sessionUrl: uniqueUrl,
        });

        await newSession.save();

        const isEmailSent = paymentIntent.id && await sendEmail({ customerEmail: agentEmail, customerName: agentName, message: description });

        let response = {}

        // response.isEmailSent = isEmailSent
        response.redirect = uniqueUrl


        sessions[sessionId] = {
            status: 'pending',
            productDetails: { title, description, amount, image, agentName, agentNum, agentEmail },
            createdAt: Date.now(),
        };


        res.status(200).json({ message: "success", status: 200, response, url: uniqueUrl });

    } catch (error) {
        console.error('Error creating payment session:', error.message);
        res.status(400).json({ error: error.message });
    }
};