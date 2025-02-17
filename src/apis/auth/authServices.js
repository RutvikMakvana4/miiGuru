import AccessToken from "../../../models/accessToken";
import RefreshToken from "../../../models/refreshToken";
import User from "../../../models/users";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException, ValidationError } from "../../common/exceptions/errorException";
import authHelper from "../../common/helper/authHelper";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BCRYPT, JWT, URL } from "../../common/constants/constants";
import LoginResource from "./resources/loginResource";
import { baseUrl } from "../../common/constants/configConstants";
import { sendMail } from "../../common/sendEmail";
import { google } from "googleapis";
import axios from "axios";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);

class AuthServices {
    /**
     * @description: User registration
     * @param {*} data 
     */
    static async register(data) {
        const { email, password, confirmPassword } = data;

        if (password !== confirmPassword) {
            throw new ConflictException("Password and Confirm Password do not match.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictException("Email is already registered.");
        }

        const verificationToken = jwt.sign({ email, password }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });

        const verificationLink = `${URL.FRONTEND}/verify?token=${verificationToken}&email=${email}`;
        const emailData = {
            to: email,
            subject: "Verify Your Email",
            data: { link: verificationLink }
        };

        sendMail(emailData, 'emailVerification');

        return {
            success: true,
            status: 201,
            message: "Please check your email to verify your account.",
        };
    }

    /**
     * @description: email verify
     * @param {*} token 
     * @returns 
     */
    static async verifyEmail(token) {
        console.log("verify email api call")
        const decoded = jwt.verify(token, JWT.SECRET);

        const { email, password } = decoded;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictException("Email is already verified and registered.");
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUND);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            isVerified: true,
        });

        const authentication = await authHelper.generateTokenPairs(newUser._id)

        return {
            success: true,
            status: 200,
            message: "Email verified. You are now registered!",
            data: { ...new LoginResource(newUser), authentication },
        };
    }

    /**
     * @description: Resend email verify
     * @param {*} data 
     */
    static async resendEmailVerify(data) {
        const { email } = data;

        const verificationToken = jwt.sign({ email }, JWT.SECRET, { expiresIn: "1h" });

        const verificationLink = `${URL.FRONTEND}/verify?token=${verificationToken}&email=${email}`;
        const emailData = {
            to: email,
            subject: "Verify Your Email",
            data: { link: verificationLink }
        };

        sendMail(emailData, 'emailVerification');

        return {
            success: true,
            status: 201,
            message: "Please check your email to verify your account.",
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

        if (!findUser.password) {
            throw new BadRequestException("This email is registered with Google. Please log in using Google.");
        }

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid password");
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
            const link = `${URL.FRONTEND}/resetpassword/?token=${token}&email=${findUser.email}`;

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


    /**
     * @description: google social login
     * @param {*} query 
     */
    static async googleLogin(query) {
        try {
            const { code } = query;

            const { tokens } = await oauth2Client.getToken(code);
            const accessToken = tokens.access_token;

            const userRes = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
            );

            const { email, id } = userRes.data;

            let user = await User.findOne({ email });

            if (user) {
                if (!user.googleId) {
                    throw new ConflictException("This email is registered with a password. Please log in using email and password.");
                }
            }

            user = await User.findOneAndUpdate(
                { email },
                { email, googleId: id, isVerified: true },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const authentication = await authHelper.generateTokenPairs(user._id)

            return {
                success: true,
                status: 200,
                message: "Login successful",
                data: { ...new LoginResource(user), authentication },
            };
        } catch (error) {
            console.log(error)
        }
    }

}

export default AuthServices;