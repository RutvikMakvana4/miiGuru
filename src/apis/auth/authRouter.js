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

// Facebook Auth
routes.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
routes.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  AuthController.socialLogin
);

module.exports = routes;