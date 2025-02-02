import mongoose from "mongoose";

export default mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log("Database not connected", error));
