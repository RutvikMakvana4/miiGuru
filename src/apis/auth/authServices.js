import User from "../../../models/users";
import { BadRequestException, ConflictException, NotFoundException } from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";


class AuthServices {
    /**
     * @description: User registration
     * @param {*} data 
     */
    static async register(data) {
        const { email, password, confirmPassword } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictException("This email is already in use. Please try a different email.");
        }

        if (password !== confirmPassword) {
            throw new ConflictException("Password and Confirm Password do not match.");
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUND);

        return await User.create({
            email,
            password: hashedPassword
        });
    }


    /**
     * @description: User login
     * @param {*} data 
     */
    static async login(data) {
        const { email, password } = data
        const findUser = await User.findOne({ email })
        if (!findUser) throw new NotFoundException("This email id is not registered. please register first")

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid password")
        }

        const authentication = await authHelper.generateTokenPairs(findUser._id)

        return { findUser, authentication }
    }
}

export default AuthServices;