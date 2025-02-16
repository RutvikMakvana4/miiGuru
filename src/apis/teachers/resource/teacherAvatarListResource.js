import { baseUrl } from "../../../common/constants/configConstants";

export default class TeacherAvatarListResource {
    constructor(data) {
        return data.map(item => ({
            avatarName: item.avatarId.avatarName,
            avatarImage: item.avatarId.avatarImage ? baseUrl(item.avatarId.avatarImage) : null,
            subject: item.contentPdfId.subject,
            class: item.contentPdfId.class
        }));
    }
}