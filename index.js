import Stripe from 'stripe';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendEmail } from './utils.js';

dotenv.config()

// Middleware
const allowedOrigins = [
    'https://stripe-frontend-blush.vercel.app',
    'http://localhost:5173',
];


const app = express();
const stripe = new Stripe('sk_test_51Q5CQjBSRlxFwzyWpwO9MYCbfPKEmJKJ9tGmyoDeHaSzB2KCUxtasfJdV1Qb311utzXiuccUMGhd91NR52KSMaAy00i4V12Ovz');

app.use(express.json());

// app.use(cors((req, callback) => {
//     const origin = req.header('Origin');
//     if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true); // Allow the origin
//     } else {
//         callback(new Error('Not allowed by CORS')); // Reject the origin
//     }
// }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}));

const sessions = {};

// const SESSION_EXPIRATION_TIME = 1 * 60 * 1000; 



app.post('/create-payment-session', async (req, res) => {
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
        const isEmailSent = await sendEmail('sharjeelhussain877@gmail.com', 'success') // here should be that email sent what wanna recieve an email from company.

        let response = {}

        response.isEmailSent = isEmailSent
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
});



app.post('/test', async (req, res) => {
    try {
        const isEmailSent = await sendEmail({ customerEmail: 'touseefabid47@gmail.com', customerName: 'Sharjeel', message: 'koshish kro' });


        res.status(200).json({ message: "success", status: 200, isEmailSent });

    } catch (error) {
        console.error('Error creating payment session:', error.message);
        res.status(400).json({ error: error.message });
    }
});

















app.get('/get-payment-details/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];

    console.log(session)
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
        console.error('Error retrieving payment intent:', error.message);
        return res.status(500).json({ error: error.message });
    }
});


app.post('/payment-success', (req, res) => {
    const { sessionId } = req.body;


    if (sessions[sessionId]) {
        sessions[sessionId].status = 'completed';
        console.log(`Payment status for session ${sessionId}: ${sessions[sessionId].status}`);
        console.log("sessions=>", sessions[sessionId])

        // delete sessions[sessionId];
        res.status(200).json({ success: true });
    } else {
        return res.status(404).json({ error: 'Session not found or already completed' });
    }
});


// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
