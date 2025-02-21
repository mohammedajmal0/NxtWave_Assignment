import mongoose, { Schema, model, Document } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const otpModel = mongoose.model<IOtp>("Otp", otpSchema);
export default otpModel;
