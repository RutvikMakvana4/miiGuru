import AccessToken from "../../../models/accessToken";
import RefreshToken from "../../../models/refreshToken";
import User from "../../../models/users";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/exceptions/errorException";
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
            const link = baseUrl(`api/v1/auth/forgotPage/${token}`);

            const obj = {
                to: email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { link }
            }

            await User.findOneAndUpdate(findUser._id, {
                refKey: true
            });

            sendMail(obj, 'forgotPassword');
        }
    }



    /**
    * @description: Forgot password page load
    * @param {*} token 
    * @param {*} req 
    * @param {*} res 
    */
    static async forgotPage(token, req, res) {
        try {
            const verifyToken = jwt.verify(token, JWT.SECRET);
            const forgotRefKey = await User.findOne({ _id: verifyToken.id });
            if (verifyToken) {
                return res.render('forgotPassword/resetPassword', { layout: "forgotPassword/resetPassword", "forgotPassRefKey": forgotRefKey })
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).send({ message: "Your link has been expired" });
            }
            return res.status(403).send({ message: "Invalid token" });
        }
    }



    /**
     * @description: Resetpassword
     * @param {*} token 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async resetPassword(token, data, req, res) {
        const { newPassword, confirmPassword } = data;
        const isValid = jwt.verify(token, JWT.SECRET);
        if (isValid) {
            if (newPassword == "" || confirmPassword == "") {
                req.flash('error', 'New Password and Confirm Password is required');
                return res.redirect("back");
            } else {
                if (newPassword.length < 8) {
                    req.flash('error', 'Your password needs to be at least 8 characters long');
                    return res.redirect("back");
                } else {
                    if (newPassword === confirmPassword) {
                        const hashPass = await bcrypt.hash(newPassword, BCRYPT.SALT_ROUND);
                        const findId = await User.findByIdAndUpdate(isValid.id, { password: hashPass, refKey: false });
                        if (findId) {
                            req.flash('success', 'Password has been changed');
                            return res.redirect('back');
                        }
                    } else {
                        req.flash('error', 'password and confirm password does not match');
                        return res.redirect('back');
                    }
                }
            }

        } else {
            req.flash('error', 'Link has been Expired');
            return res.redirect('back');
        }
    }

}

export default AuthServices;