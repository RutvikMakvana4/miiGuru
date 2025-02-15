import express from "express";
import authRoutes from "../src/apis/auth/authRouter";
import otherRoutes from "../src/apis/other/otherRouter";
import studentRoutes from "../src/apis/student/studentRouter";
import adminRoutes from "../src/apis/admin/adminRouter";

const routes = express.Router();

routes.use((req, res, next) => {
    const startHrTime = process.hrtime();

    res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        console.log(
            `Request to ${req.method} ${req.originalUrl} took ${elapsedTimeInMs} ms`
        );
    });

    next();
});

routes.use("/auth", authRoutes);
routes.use("/other", otherRoutes);
routes.use("/student", studentRoutes);
routes.use("/admin", adminRoutes);

module.exports = routes;