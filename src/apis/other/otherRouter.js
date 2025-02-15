import OtherController from "./otherController";
import express from "express";
import asyncHandler from "express-async-handler";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post("/contact-us", asyncHandler(OtherController.contactUs));

module.exports = routes;