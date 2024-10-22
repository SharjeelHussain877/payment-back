// import mongoose, { Schema } from "mongoose";

// const dataSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       minlength: 3,
//       maxlength: 24,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     sessionKey: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );

// const paymentSessions = mongoose.model("paymentSessions", dataSchema);

// export default paymentSessions;

import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema({
  sessionId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  productDetails: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  agentDetails: {
    agentName: { type: String, required: true },
    agentNum: { type: String, required: true },
    agentEmail: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  sessionUrl: { type: String },
});

const paymentSessions = mongoose.model("paymentSessions", dataSchema);

export default paymentSessions;
