import AuthController from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";

const routes = express.Router();

routes.post("/register", asyncHandler(AuthController.register));
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
routes.get('/forgotPage/:token', asyncHandler(AuthController.forgotPage));
routes.post('/forgotPage/:token', asyncHandler(AuthController.resetPassword));

module.exports = routes;