import TeacherAvatar from "../../../models/teacherAvatars";
import TeacherAvatarListResource from "./resource/teacherAvatarListResource";

class TeacherServices {
    /**
     * @description: teacher avatar list
     */
    static async teacherAvatarList(auth) {
        const findAvatars = await TeacherAvatar.find().populate("avatarId").populate("voiceId").populate("contentPdfId")

        return {
            success: true,
            status: 200,
            message: "Meet your teachers",
            data: new TeacherAvatarListResource(findAvatars)
        };
    }
}

export default TeacherServices;