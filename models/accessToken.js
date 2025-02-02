import mongoose from "mongoose";

const accessTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

export default AccessToken;
