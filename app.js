import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import "./src/common/config/dbConnection";
import "./src/common/config/jwtPassport";
import mainRouter from "./routes/index";
import errorMiddleware from "./src/common/middleware/error";
import swaggerSetup from "./src/common/swagger";
import { JWT } from "./src/common/constants/constants";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: process.env.APP_NAME,
    secret: JWT.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

app.get("/", (req, res) => {
  res.status(200).send("App is working!");
});

// Flash message globelly define
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(swaggerSetup);
app.use(mainRouter);

app.use(express.static(path.join(__dirname + "/public")));
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});