import mongoose from "mongoose";

const contentPdfSchema = new mongoose.Schema(
    {
        class: {
            type: String,
            require: true,
        },
        subject: {
            type: String,
            require: true,
        },
        pdfFile: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true,
    }
);

const ContentPDF = mongoose.model("ContentPDF", contentPdfSchema);

export default ContentPDF;
