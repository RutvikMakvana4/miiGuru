import OtherServices from "./otherServices";

class OtherController {
 /**
     * @description: Contact Us
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
 static async contactUs(req, res) {
    await OtherServices.contactUs(req.body, req.user);
    return res.send({ message: "Send message to the admin successfully" })
}
}

export default OtherController;