import OtherServices from "./otherServices";

class OtherController {
    /**
        * @description: Contact Us
        * @param {*} req 
        * @param {*} res 
        * @returns 
        */
    static async contactUs(req, res) {
        const contact = await OtherServices.contactUs(req.body, req.user);
        return res.status(201).json({
            success: true,
            status: 201,
            message: "Message sent to admin successfully",
            data: contact
        });
    }
}

export default OtherController;