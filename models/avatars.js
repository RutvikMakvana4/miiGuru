import mongoose from "mongoose";

const avatarSchema = new mongoose.Schema(
    {
        avatarName: {
            type: String,
            require: true,
        },
        avatarImage: {
            type: String,
            require: true,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

const Avatar = mongoose.model("Avatar", avatarSchema);

export default Avatar;
