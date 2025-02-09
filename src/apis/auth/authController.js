import AuthServices from "./authServices";

class AuthController {

  /**
   * @description: User register
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async register(req, res) {
    await AuthServices.register(req.body);
    return res.send({ message: "User registered successfully" })
  }

  /**
   * @description: User login
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async login(req, res) {
    const data = await AuthServices.login(req.body);
    return res.send({ message: "User login successfully", data })
  }

  /**
   * @description: User logout
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async logout(req, res) {
    await AuthServices.logout(req, res);
    return res.send({ message: "User logout successfully" })
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
   * @description: Social login
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async socialLogin(req, res) {
    try {
      const user = req.user;
      const authentication = await authHelper.generateTokenPairs(user._id);
      return res.redirect(`http://localhost:3000?token=${authentication.accessToken}`);
    } catch (error) {
      return res.status(500).json({ message: "Authentication failed", error });
    }
  }

  /**
     * @description: Forgot password link generate
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
  static async forgotPassword(req, res) {
    await AuthServices.forgotPassword(req.body);
    return res.send({ message: "Reset password link has been sent to the email address" });
  }


  /**
   * @description: Forgot password page
   * @param {*} req 
   * @param {*} res 
   */
  static async forgotPage(req, res) {
    await AuthServices.forgotPage(req.params.token, req, res)
  }


  /**
   * @description: Reset password
   * @param {*} req 
   * @param {*} res 
   */
  static async resetPassword(req, res) {
    await AuthServices.resetPassword(req.params.token, req.body, req, res);
  }
}

export default AuthController;