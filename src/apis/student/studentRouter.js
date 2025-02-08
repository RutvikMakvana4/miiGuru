import StudentController from "./studentController";
import express from "express";
import asyncHandler from "express-async-handler";
import authentication from "../../common/middleware/authentication";
import storeFile from "../../common/middleware/uploadImages";

const routes = express.Router();

routes.get("/profile", authentication, asyncHandler(StudentController.studentProfile));
routes.post("/onboarding-form", authentication, storeFile("public/students/photos", "photo"), asyncHandler(StudentController.onboardingForm));

module.exports = routes;