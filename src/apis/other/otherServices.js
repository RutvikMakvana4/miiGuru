import ContactUs from "../../../models/contactUs";

class OtherServices {
    /**
     * @description: Contact Us
     * @param {*} data 
     */
    static async contactUs(data, auth) {
        return await ContactUs.create({
            userId: auth,
            ...data
        })
    }
}

export default OtherServices;