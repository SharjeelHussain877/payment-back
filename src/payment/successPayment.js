export default async function successPayment(req, res)  {
    const sessions = {};

    const { sessionId } = req.body;

    if (sessions[sessionId]) {
        sessions[sessionId].status = 'completed';
        // console.log(`Payment status for session ${sessionId}: ${sessions[sessionId].status}`);
        // console.log("sessions=>", sessions[sessionId])

        // delete sessions[sessionId];
        res.status(200).json({ success: true });
    } else {
        return res.status(404).json({ error: 'Session not found or already completed' });
    }
}