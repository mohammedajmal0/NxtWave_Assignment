import express from "express";
import MainAuthController from "./authController";
import upload from "../../../../utils/upload";
import AuthHandler from "../../../../middleware/authHandler";

const AuthRouter = express.Router();

AuthRouter.post(
  "/signup",
  (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    MainAuthController.signup(request, response, next);
  }
);

AuthRouter.post(
  "/login",
  (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    MainAuthController.login(request, response, next);
  }
);

AuthRouter.post(
  "/verifyOtp",
  (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    MainAuthController.verifyOtp(request, response, next);
  }
);

AuthRouter.post(
  "/upload",
  upload.single("file"),
  MainAuthController.uploadImage
);

AuthRouter.delete(
  "/",
  AuthHandler.authMiddleware,
  (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    MainAuthController.delete(request, response, next);
  }
);
export default AuthRouter;
