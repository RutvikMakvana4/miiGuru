import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true
    },
    photo: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    schoolName: {
        type: String,
        required: true
    },
    board: {
        type: String,
        required: true
    },
    mediumOfStudy: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    major: {
        type: String,
        default: null
    },
    subjects: {
        type: [String],
    },
    otherSubject: {
        type: String,
    },
    otherActivities: {
        type: String,
    },
    selectedDays: {
        type: [String],
        required: true
    },
    timeAvailability: {
        type: String,
        required: true
    },
    timeToFinish: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Onboarding = mongoose.model("Onboarding", onboardingSchema);

export default Onboarding;
