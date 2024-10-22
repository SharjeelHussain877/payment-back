import { stripe } from "../constants/keys.js";

export default async function getPaymentDetails(req, res) {
    const sessions = {};
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];

    if (!session) {
        return res.status(404).json({ error: 'Session not found or expired' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);
        res.json({
            productDetails: session.productDetails,
            clientSecret: paymentIntent.client_secret,
            status: sessions[sessionId].status
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}