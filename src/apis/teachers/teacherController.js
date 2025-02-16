import TeacherServices from "./teacherServices";

class TeacherController {

    /**
     * @description: Teacher avatar list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async teacherAvatarList(req, res) {
        const response = await TeacherServices.teacherAvatarList(req.user);
        return res.status(response.status).json(response);
    }

}

export default TeacherController;