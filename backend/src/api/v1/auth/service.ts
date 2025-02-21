import { NextFunction } from "express";
import { ILogin, IUser } from "../../../../DB/interfaces/user";
import { createError } from "../../../../utils/errors/createError";
import { hashPassword, matchHash } from "../../../../utils/hashPwd";
import { signJwt } from "../../../../utils/jwtUtils";
import userModel from "../../../../DB/models/user";
import { generateOtp, hashOtp, verifyOtp } from "../../../../utils/otputils";
import otpModel from "../../../../DB/models/otp";
import { sendEmail } from "../../../../utils/mailer";
import { decode } from "jsonwebtoken";

class MainAuthService {
  static async signup(data: IUser, next: NextFunction) {
    const { email, name, password, companyName, dob, profilePhoto, age } = data;

    const userExists = await userModel.exists({ email: email });

    if (userExists) {
      return next(createError({ status: 400, message: "User already exists" }));
    }
    console.log(data);

    const hashedPassword = await hashPassword(password as string);
    data.password = hashedPassword;
    const newUser = new userModel({
      name: name,
      password: hashedPassword,
      companyName: companyName,
      dob: dob,
      email: email,
      profilePhoto: profilePhoto,
      age: age,
    });
    const result = await newUser.save();

    const accessToken = signJwt(
      {
        name: name,
        userId: result._id,
        email: result.email,
      },
      "7d"
    );

    return {
      data: { userId: result._id, name: result.name, email: result.email },
      accessToken: accessToken,
    };
  }

  static async login(data: ILogin, next: NextFunction) {
    const { email, password } = data;

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(createError({ status: 404, message: "User not found" }));
    }

    if (!(await matchHash(password, user.password))) {
      return next(createError({ status: 401, message: "Invalid password" }));
    }

    // const accessToken = signJwt(
    //   {
    //     name: user.name,
    //     email: user.email,
    //     userId: user._id,
    //   },
    //   7
    // );

    // return {
    //   data: {
    //     userId: user._id,
    //     email: user.email,
    //     name: user.name,
    //     age: user.age,
    //     companyName: user.companyName,
    //     dob: user.dob,
    //   },
    //   accessToken: accessToken,
    // };

    return this.sendOtp(user.email, next);
  }

  static async sendOtp(email: string, next: NextFunction) {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createError({ status: 404, message: "User not found" }));
    }

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    // Delete any existing OTP for this email (to prevent multiple valid OTPs)
    await otpModel.deleteMany({ email });

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await otpModel.create({ email, otp: hashedOtp, expiresAt });

    // TODO: Send OTP via email or SMS
    await sendEmail(email, "OTP", otp, next);

    return { message: "OTP sent successfully" };
  }

  static async verifyOtp(email: string, otp: string, next: NextFunction) {
    const record = await otpModel.findOne({ email });
    if (!record) {
      return next(
        createError({ status: 400, message: "No OTP found for this email" })
      );
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(
        createError({ status: 400, message: "No user found for this email" })
      );
    }

    if (record.expiresAt < new Date()) {
      await otpModel.deleteOne({ email });
      return next(createError({ status: 400, message: "OTP expired" }));
    }

    const isValid = await verifyOtp(otp, record.otp);
    if (!isValid) {
      return next(createError({ status: 400, message: "Invalid OTP" }));
    }

    await otpModel.deleteOne({ email }); // Cleanup after successful verification

    const accessToken = signJwt(
      {
        name: user.name,
        email: user.email,
        userId: user._id,
      },
      7
    );

    return {
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        companyName: user.companyName,
        dob: user.dob,
        profilePhoto: user.profilePhoto,
      },
      accessToken: accessToken,
    };
  }
}

export default MainAuthService;
