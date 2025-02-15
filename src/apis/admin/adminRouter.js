import AdminController from "./adminController";
import express from "express";
import asyncHandler from "express-async-handler";
import authentication from "../../common/middleware/authentication";
import storeFile from "../../common/middleware/uploadImages";

const routes = express.Router();

routes.post("/upload-avatar", storeFile("public/uploads", [
    { name: "avatarImage", maxCount: 1 },
    { name: "voiceFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
], "array"), asyncHandler(AdminController.uploadAvatars));

routes.get("/avatar", asyncHandler(AdminController.avatarSelectionList));

routes.post("/teacher-avatar", asyncHandler(AdminController.uploadTeacherAvatar));

module.exports = routes;