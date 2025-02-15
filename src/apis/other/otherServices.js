import ContactUs from "../../../models/contactUs";

class OtherServices {
    /**
     * @description: Contact Us
     * @param {*} data 
     */
    static async contactUs(data) {
        return await ContactUs.create({
            ...data
        })
    }
}

export default OtherServices;