import "dotenv/config";
import express from "express";
import path from "path";
import "./src/common/config/dbConnection";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.status(200).send("App is working!");
});

app.use(express.static(path.join(__dirname + "/public")));

app.listen(PORT, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});