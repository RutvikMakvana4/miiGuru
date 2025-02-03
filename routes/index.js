import express from "express";
import apiRoutes from "./apis"

const routes = express.Router();

routes.use("/api/v1", apiRoutes);

module.exports = routes;