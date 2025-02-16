import AuthController from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post("/register", asyncHandler(AuthController.register));
routes.post("/verify-email/:token", asyncHandler(AuthController.verifyEmail));
routes.post("/resend-verify-email", asyncHandler(AuthController.resendEmailVerify));
routes.post("/login", asyncHandler(AuthController.login));
routes.post("/logout", authentication, asyncHandler(AuthController.logout));
routes.post("/refresh-token", asyncHandler(AuthController.newAccessToken));

routes.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
routes.post("/verify-token/:token", asyncHandler(AuthController.verifyToken));
routes.post("/resend-email", asyncHandler(AuthController.resendEmail));
routes.post("/reset-password/:token", asyncHandler(AuthController.resetPassword));

routes.post("/google", asyncHandler(AuthController.googleLogin));

module.exports = routes;