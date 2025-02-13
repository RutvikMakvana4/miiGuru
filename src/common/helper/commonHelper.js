import { BCRYPT } from "../constants/constants";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { baseUrl } from "../constants/configConstants";

class commonHelper {

  /**
  * @description: Hash password
  * @param {*} password
  * @returns
  */
  static async hashPassword(password) {
    try {
      const saltRounds = BCRYPT.SALT_ROUND;

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Failed to hash password");
    }
  }

  /**
   * @description: Compare password
   * @param {*} plainPassword
   * @param {*} hashedPassword
   * @returns
   */
  static async comparePassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error("Failed to compare passwords");
    }
  }

  /**
   * @description: random string generator
   * @param {*} size 
   */
  static async randomStringGenerator(size) {
    return await crypto.randomBytes(size).toString("hex")
  }

  /**
   * @description: logo url
   * @returns 
   */
  static async logo() {
    return baseUrl("/img/logo2.svg");
  };
}

export default commonHelper;
