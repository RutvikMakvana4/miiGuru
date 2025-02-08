import express from "express";
import authRoutes from "../src/apis/auth/authRouter";
import otherRoutes from "../src/apis/other/otherRouter";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/other", otherRoutes); 

module.exports = routes;