import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { sendEmail } from './utils.js';
import { stripe } from './src/constants/keys.js';
import routes from './src/routes/index.js';

dotenv.config()

// Middleware
const allowedOrigins = [
    'https://stripe-frontend-blush.vercel.app',
    'http://localhost:5173',
];

// it allow to all origin what to get call.
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// app.use(cors((req, callback) => {
//     const origin = req.header('Origin');
//     if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true); // Allow the origin
//     } else {
//         callback(new Error('Not allowed by CORS')); // Reject the origin
//     }
// }));

const sessions = {};
const port = 5000
const mongoURI = `mongodb+srv://fahadalam12405:W5LKAuHZx8KtEyWm@cluster0.mtooe.mongodb.net/`;

mongoose
    .connect(mongoURI)
    .then(() =>
        console.log(chalk.white.bgGreen("---- Connected to MongoDB ----"))
    )
    .catch((err) =>
        console.log(chalk.white.bgRed("---- Error Connected MongoDB ----", err))
    );

// done
app.post('/create-payment-session', async (req, res) => {
    const { title, description, amount, image, clientName, clientNum, clientEmail } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card', 'cashapp'],
            metadata: { title, description, image },
        });

        const sessionId = paymentIntent.id;
        const uniqueUrl = `http://localhost:5173/payment/${sessionId}`;

        const isEmailSent = paymentIntent.id && await sendEmail({ customerEmail: clientEmail, customerName: clientName, message: description }) // here should be that email sent what wanna recieve an email from company.


        let response = {}

        response.isEmailSent = isEmailSent
        response.redirect = uniqueUrl


        sessions[sessionId] = {
            status: 'pending',
            productDetails: { title, description, amount, image, clientName, clientNum, clientEmail },
            createdAt: Date.now(),
        };


        res.status(200).json({ message: "success", status: 200, response, url: uniqueUrl });

    } catch (error) {
        console.error('Error creating payment session:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

















// done
app.get('/get-payment-details/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    const session = sessions[sessionId];


    if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found or expired' });
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
        return res.status(500).json({ success: false, message: error.message });
    }
});














app.post('/payment-success', (req, res) => {
    const { sessionId } = req.body;


    if (sessions[sessionId]) {
        sessions[sessionId].status = 'completed';

        // delete sessions[sessionId];
        res.status(200).json({ success: true });
    } else {
        return res.status(404).json({ success: false, message: 'Session not found or already completed' });
    }
});










app.use("/api", routes);

app.get("/", (req, res) => res.status(200).json({ success: true, message: "API IS RUNNING ON THIS PORT " + port }))
app.get("*", (req, res) => res.status(400).json({ success: false, message: "THIS ROUTE IS INVALID PLEASE RETRY WITH CORRRECT ROUTE" }))


// Start the server
app.listen(port, () => console.log('Server running on port 5000'));
