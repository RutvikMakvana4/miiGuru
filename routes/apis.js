import express from "express";
import authRoutes from "../src/apis/auth/authRouter";

const routes = express.Router();

routes.use("/auth", authRoutes);

module.exports = routes;