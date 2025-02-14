import AuthController from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";

const routes = express.Router();

routes.post("/register", asyncHandler(AuthController.register));
routes.post("/verify-email/:token", asyncHandler(AuthController.verifyEmail));
routes.post("/resend-verify-email", asyncHandler(AuthController.resendEmailVerify));
routes.post("/login", asyncHandler(AuthController.login));
routes.post("/logout", asyncHandler(AuthController.logout));
routes.post("/refresh-token", asyncHandler(AuthController.newAccessToken));

// Google Auth
routes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
routes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthController.socialLogin
);

routes.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
routes.post("/verify-token/:token", asyncHandler(AuthController.verifyToken));
routes.post("/resend-email", asyncHandler(AuthController.resendEmail));
routes.post("/reset-password/:token", asyncHandler(AuthController.resetPassword));

module.exports = routes;