import { Router } from "express";
import createPaymentSession from "../payment/createPaymentSession.js";
import getPaymentDetails from "../payment/getPaymentDetails.js";

const router = Router();

router.post("/create-payment-session", createPaymentSession);
router.get('/get-payment-details/:sessionId', getPaymentDetails);


// router.post('/payment-success', );

export default router;
