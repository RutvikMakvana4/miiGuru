import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "path";
import flash from "connect-flash";
import MongoStore from "connect-mongo";
import "./common/config/dbConnection";
import "./common/config/jwtPassport";
import mainRouter from "../routes/index";
import errorMiddleware from "./common/middleware/error";
import swaggerSetup from "./common/swagger";
import { JWT } from "./common/constants/constants";
import cors from "cors";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "https://mii-guru-frontend.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

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