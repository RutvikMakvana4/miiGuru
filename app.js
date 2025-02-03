import "dotenv/config";
import express from "express";
import path from "path";
import "./src/common/config/dbConnection";
import "./src/common/config/jwtPassport";
import mainRouter from "./routes/index";
import errorMiddleware from "./src/common/middleware/error";
import swaggerSetup from "./src/common/swagger";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("App is working!");
});

app.use(swaggerSetup);
app.use(mainRouter);

app.use(express.static(path.join(__dirname + "/public")));
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});