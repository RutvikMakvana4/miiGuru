import express from "express";
import authRoutes from "../src/apis/auth/authRouter";
import otherRoutes from "../src/apis/other/otherRouter";
import studentRoutes from "../src/apis/student/studentRouter";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/other", otherRoutes);
routes.use("/student", studentRoutes);

module.exports = routes;