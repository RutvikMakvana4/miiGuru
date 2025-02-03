import AccessToken from "../../../models/accessToken";
import RefreshToken from "../../../models/refreshToken";
import User from "../../../models/users";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";
import jwt from "jsonwebtoken";


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

    /**
     * @description: Logout users
     * @param {*} data
     * @param {*} req 
     * @param {*} res
     */
    static async logout(req, res) {
        const token = await req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.decode(token)
        const decodedData = await JSON.parse(decodedToken.data);
        const findToken = await AccessToken.findOne({ token: decodedData.jti });
        if (!findToken) {
            throw new UnauthorizedException("This access token is expired , please login !")
        }
        await AccessToken.findByIdAndDelete({ _id: findToken._id });
        await RefreshToken.findOneAndDelete({ accessToken: findToken.token });
        return
    }

    /**
     * @description : genearte new access token
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async newAccessToken(data, req, res) {
        const { refreshToken } = data;
        const authentication = await authHelper.generateNewAccessToken(refreshToken);
        return { authentication };
    }

}

export default AuthServices;