import AdminServices from "./adminServices";

class AdminController {

    /**
     * @description: Upload new avatars
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async uploadAvatars(req, res) {
        try {
            await AdminServices.uploadAvatars(req.body, req.files);

            return res.status(201).json({
                success: true,
                status: 201,
                message: "File uploaded successfully.",
            });
        } catch (error) {
            console.error("Error in uploadAvatars controller:", error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: "Internal server error.",
            });
        }
    }

    /**
     * @description: Avatar delection list
     * @param {*} req 
     * @param {*} res 
     */
    static async avatarSelectionList(req, res) {
        const response = await AdminServices.avatarSelectionList(req, res);
        return res.status(response.status).json(response);
    }


    /**
     * @description: Upload teacher avatar
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async uploadTeacherAvatar(req, res) {
        const response = await AdminServices.uploadTeacherAvatar(req.body);
        return res.status(response.status).json(response);
    }

}

export default AdminController;