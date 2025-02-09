import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      index: {
        unique: true,
      },
    },
    password: {
      type: String,
      require: true,
    },
    refKey: {
      type: Boolean,
      default: false
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
