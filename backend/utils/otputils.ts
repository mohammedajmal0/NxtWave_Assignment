import crypto from "crypto";
import bcrypt from "bcryptjs";

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};

export const verifyOtp = async (
  otp: string,
  hashedOtp: string
): Promise<boolean> => {
  return await bcrypt.compare(otp, hashedOtp);
};
