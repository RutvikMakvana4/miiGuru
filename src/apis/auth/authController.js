import AuthServices from "./authServices";

class AuthController {

    /**
     * @description: User register
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async register(req, res){
        await AuthServices.register(req.body);
        return res.send({ message: "User regsiterd successfully" })
    }

    /**
     * @description: User login
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(req, res){
        const data = await AuthServices.login(req.body);
        return res.send({ message: "User login successfully", data })
    }
}

export default AuthController;