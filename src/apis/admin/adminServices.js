import Avatar from "../../../models/avatars";
import Voice from "../../../models/voices";
import ContentPDF from "../../../models/contentPdfs";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import { baseUrl } from "../../common/constants/configConstants";
import TeacherAvatar from "../../../models/teacherAvatars";

class AdminServices {

    /**
     * @description: Uplaod Avatars
     * @param {*} data 
     * @param {*} files 
     */
    static async uploadAvatars(data, files) {
        try {
            const { type } = data;

            let avatarImage = files?.avatarImage
                ? `uploads/${files.avatarImage[0].filename}`
                : null;
            let voiceFile = files?.voiceFile
                ? `uploads/${files.voiceFile[0].filename}`
                : null;
            let pdfFile = files?.pdfFile
                ? `uploads/${files.pdfFile[0].filename}`
                : null;

            console.log(avatarImage)

            if (type == 1) {
                await Avatar.create({
                    avatarName: data.avatarName,
                    avatarImage: avatarImage,
                });
            } else if (type == 2) {
                await Voice.create({
                    voiceDescription: data.voiceDescription,
                    voiceFile: voiceFile,
                });
            } else if (type == 3) {
                await ContentPDF.create({
                    class: data.class,
                    subject: data.subject,
                    pdfFile: pdfFile,
                });
            } else {
                throw new BadRequestException("Invalid type provided.");
            }

            return {
                success: true,
                status: 201,
                message: "File uploaded successfully.",
            };
        } catch (error) {
            console.error("Error in uploadAvatars service:", error);
            throw error;
        }
    }

    /**
     * @description: Avatar selection list
     */
    static async avatarSelectionList(req, res) {
        const avatars = await Avatar.find();
        const voices = await Voice.find();
        const contents = await ContentPDF.find();

        const avatarList = avatars.map((avatar) => ({
            _id: avatar._id,
            avatarName: avatar.avatarName,
            avatarImage: avatar.avatarImage ? baseUrl(avatar.avatarImage) : null,
        }));

        const voiceList = voices.map((voice) => ({
            _id: voice._id,
            voiceDescription: voice.voiceDescription,
            voiceFile: voice.voiceFile ? baseUrl(voice.voiceFile) : null,
        }));

        const contentList = contents.map((content) => ({
            _id: content._id,
            class: content.class,
            subject: content.subject,
            pdfFile: content.pdfFile ? baseUrl(content.pdfFile) : null,
        }));

        return {
            success: true,
            status: 200,
            message: "Avatar, Voice, and Content list retrieved successfully.",
            data: {
                avatars: avatarList,
                voices: voiceList,
                contents: contentList,
            },
        };
    }

    /**
     * @description: Upload teacher avatar
     * @param {*} data 
     */
    static async uploadTeacherAvatar(data) {
        const { avatarId, voiceId, contentPdfId } = data;

        const findAvatar = await Avatar.findById(avatarId)

        if (!findAvatar) {
            throw new NotFoundException("avatarId not found")
        }

        const findVoice = await Voice.findById(voiceId)
        if (!findVoice) {
            throw new NotFoundException("voiceId not found")
        }

        const findContentPdf = await ContentPDF.findById(contentPdfId)
        if (!findContentPdf) {
            throw new NotFoundException("contentPdfId not found")
        }

        await TeacherAvatar.create({
            avatarId: findAvatar._id,
            voiceId: findVoice._id,
            contentPdfId: findContentPdf._id
        });

        return {
            success: true,
            status: 201,
            message: "Avatar added successfully",
        };

    }

}

export default AdminServices;