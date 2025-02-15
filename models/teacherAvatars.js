import mongoose from "mongoose";

const teacherAvatarSchema = new mongoose.Schema({
    avatarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Avatar",
        required: true,
    },
    voiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voice",
        required: true,
    },
    contentPdfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContentPDF",
        required: true,
    },
}, {
    timestamps: true
});

const TeacherAvatar = mongoose.model("TeacherAvatar", teacherAvatarSchema);

export default TeacherAvatar;
