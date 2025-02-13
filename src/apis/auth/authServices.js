import AccessToken from "../../../models/accessToken";
import RefreshToken from "../../../models/refreshToken";
import User from "../../../models/users";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException, ValidationError } from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BCRYPT, JWT } from "../../common/constants/constants";
import LoginResource from "./resources/loginResource";
import { baseUrl } from "../../common/constants/configConstants";
import { sendMail } from "../../common/sendEmail";


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

        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        const authentication = await authHelper.generateTokenPairs(newUser._id)

        return {
            success: true,
            status: 201,
            message: "User registered successfully",
            data: { ...new LoginResource(newUser), authentication },
        };
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

        return {
            success: true,
            status: 200,
            message: "Login successful",
            data: { ...new LoginResource(findUser), authentication },
        };
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

        return { success: true, status: 200, message: "Logout successful", data: {} };
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


    /**
     * @description: Forgot password link generate
     * @param {*} data 
     */
    static async forgotPassword(data) {
        const { email } = data;
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            throw new NotFoundException("This email is not register");
        } else {
            const token = jwt.sign({ id: findUser._id }, JWT.SECRET, { expiresIn: 300 });
            const link = `http://localhost:3000/resetpassword/?token=${token}`;


            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { link }
            }

            await User.findOneAndUpdate(findUser._id, {
                refKey: true
            });

            sendMail(obj, 'forgotPassword');

            return { success: true, status: 200, message: "Reset password link has been sent to the email address" };

        }
    }


    /**
     * @description: Verify token validity
     * @param {*} token
     */
    static async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT.SECRET);
            const user = await User.findOne({ _id: decoded.id });
            if (!user) throw new BadRequestException("Invalid token");

            return { success: true, status: 200, message: "Verify token successfully" };
        } catch (err) {
            return { success: false, status: 400, message: "Invalid or expired token" };
        }
    }


    /**
     * @description: Resend Forgot Password Email
     * @param {*} data
     */
    static async resendEmail(data) {
        return this.forgotPassword(data);
    }

    /**
     * @description: Reset Password
     * @param {*} token
     * @param {*} newPassword
     * @param {*} confirmPassword
     */
    static async resetPassword(token, data) {
        const { newPassword, confirmPassword } = data;
        if (!newPassword || !confirmPassword) {
            throw new ValidationError("Both fields are required");
        }

        if (newPassword.length < 8) {
            throw new ValidationError("Password must be at least 8 characters");
        }

        if (newPassword !== confirmPassword) {
            throw new BadRequestException("Passwords do not match");
        }

        try {
            const decoded = jwt.verify(token, JWT.SECRET);
            const hashPass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);

            const user = await User.findOneAndUpdate(
                { _id: decoded.id },
                { password: hashPass },
                { new: true }
            );

            if (!user) throw new NotFoundException("Invalid token or user not found");

            return { success: true, status: 200, message: "Password reset successfully" };
        } catch (err) {
            throw new BadRequestException("Invalid or expired token");
        }
    }

}

export default AuthServices;