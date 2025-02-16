import TeacherController from "./teacherController";
import express from "express";
import asyncHandler from "express-async-handler";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get("/list", authentication, asyncHandler(TeacherController.teacherAvatarList));

module.exports = routes;