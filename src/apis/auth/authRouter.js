import AuthController from "./authController";
import express from "express";
import asyncHandler from "express-async-handler";

const routes = express.Router();

routes.post("/register", asyncHandler(AuthController.register));
routes.post("/login", asyncHandler(AuthController.login));

module.exports = routes;