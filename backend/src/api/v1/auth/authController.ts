import express from "express";
import StatusCodes from "../../../../config/constants/statusCodes";
import MainAuthService from "./service";
import { createError } from "../../../../utils/errors/createError";
import userModel from "../../../../DB/models/user";
class MainAuthController {
  static async signup(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const data = request.body;
    const result = await MainAuthService.signup(data, next);
    if (result) {
      const payload = {
        content: result,
        status: true,
      };
      return response.status(StatusCodes.CREATED).json(payload);
    }
  }

  static async login(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const data = request.body;
    const result = await MainAuthService.login(data, next);
    if (result) {
      const payload = {
        content: result,
        status: true,
      };
      return response.status(StatusCodes.OK).json(payload);
    }
  }

  static async verifyOtp(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const { email, otp } = request.query;
    if (
      !email ||
      !otp ||
      typeof email === "undefined" ||
      typeof otp === "undefined"
    ) {
      return next(createError({ status: 400, message: "PARAMS_MISSING" }));
    }

    const result = await MainAuthService.verifyOtp(
      email as string,
      otp as string,
      next
    );
    if (result) {
      const payload = {
        content: result,
        status: true,
      };
      return response.status(StatusCodes.OK).json(payload);
    }
  }

  static async uploadImage(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded." });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async delete(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const authData = request.authData;
    if (!authData) {
      return next(createError({ status: 400, message: "USER_NOT_FOUND" }));
    }
    const result = await userModel.deleteOne({ _id: authData.userId });
    const payload = {
      content: result,
      status: true,
    };
    return response.status(StatusCodes.OK).json(payload);
  }
}
export default MainAuthController;
