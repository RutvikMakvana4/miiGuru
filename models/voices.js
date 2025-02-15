import mongoose from "mongoose";

const voiceSchema = new mongoose.Schema(
    {
        voiceDescription: {
            type: String,
            require: true,
        },
        voiceFile: {
            type: String,
            require: true,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

const Voice = mongoose.model("Voice", voiceSchema);

export default Voice;
