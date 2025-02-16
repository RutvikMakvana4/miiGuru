import { URL } from "../../common/constants/constants";
import AuthServices from "./authServices";

class AuthController {

  /**
   * @description: User register
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async register(req, res) {
    const response = await AuthServices.register(req.body);
    return res.status(response.status).json(response);
  }


  /**
   * @description: Verify email
   */
  static async verifyEmail(req, res) {
    const response = await AuthServices.verifyEmail(req.params.token);
    return res.status(response.success ? 200 : 400).send(response);
  }

  /**
 * @description: Resend Verify email
 */
  static async resendEmailVerify(req, res) {
    const response = await AuthServices.resendEmailVerify(req.body);
    return res.status(response.status).json(response);
  }

  /**
   * @description: User login
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async login(req, res) {
    const response = await AuthServices.login(req.body);
    return res.status(response.status).json(response);
  }

  /**
   * @description: User logout
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async logout(req, res) {
    const response = await AuthServices.logout(req);
    return res.status(response.status).json(response);
  }

  /**
   * @description: Generate new access token
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async newAccessToken(req, res) {
    const data = await AuthServices.newAccessToken(req.body);
    return res.send({ data })
  }

  /**
     * @description: Forgot password link generate
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
  static async forgotPassword(req, res) {
    const response = await AuthServices.forgotPassword(req.body);
    return res.status(response.status).json(response);
  }

  /**
   * @description: Verify Token
   */
  static async verifyToken(req, res) {
    const response = await AuthServices.verifyToken(req.params.token);
    return res.status(response.success ? 200 : 400).send(response);
  }

  /**
   * @description: Resend Forgot Password Email
   */
  static async resendEmail(req, res) {
    const response = await AuthServices.resendEmail(req.body);
    return res.status(response.status).json(response);
  }

  /**
   * @description: Reset Password
   */
  static async resetPassword(req, res) {
    const response = await AuthServices.resetPassword(req.params.token, req.body);
    return res.status(response.status).json(response);
  }

  /**
   * @description: Google Login
   */
  static async googleLogin(req, res) {
    const response = await AuthServices.googleLogin(req.query);
    return res.status(response.status).json(response);
  }

}

export default AuthController;