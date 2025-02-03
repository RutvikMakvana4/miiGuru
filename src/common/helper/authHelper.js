import { JWT } from "../constants/constants";
import jwt from "jsonwebtoken";
import RefreshToken from "../../../models/refreshToken";
import AccessToken from "../../../models/accessToken";
import { BadRequestException } from "../exceptions/errorException";

class authHelper {

    /**
     * @description: Generate Access Token
     * @param {*} userId
     */
    static async generateAccessToken(userId) {
        const jti = randomStringGenerator()
        const data = await JSON.stringify({ userId, jti });
        const accessToken = jwt.sign({ data }, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
        const decodedToken = jwt.decode(accessToken)

        await AccessToken.create({
            token: jti,
            userId: userId
        })
        return { accessToken, expiresAt: decodedToken.exp }
    }

    /**
     * @description: Generate refresh token
     * @param {*} accessToken 
     * @returns 
     */
    static async generateRefreshToken(accessToken) {
        const refreshToken = randomStringGenerator()
        const decodedToken = jwt.decode(accessToken)
        const accessJti = await JSON.parse(decodedToken.data);

        await RefreshToken.create({
            token: refreshToken,
            accessToken: accessJti.jti
        });
        return refreshToken
    };

    /**
     * @description : Generate access token & refresh token
     * @param {*} authUser 
     * @returns 
     */
    static async generateTokenPairs(authUser) {
        const { accessToken, expiresAt } = await this.generateAccessToken(authUser)
        if (accessToken) { var refreshToken = await this.generateRefreshToken(accessToken) }
        return { accessToken, refreshToken, expiresAt }
    }


    /**
     * @description : generate new access token
     * @param {*} refreshToken 
     */
    static async generateNewAccessToken(refreshToken) {
        const findRefreshToken = await RefreshToken.findOne({ token: refreshToken });

        if (!findRefreshToken) {
            throw new BadRequestException('Refresh token expired');
        }

        const findAccessToken = await AccessToken.findOne({ token: findRefreshToken.accessToken });

        if (!findAccessToken) {
            throw new BadRequestException('Access token expired');
        }

        const user = findAccessToken.userId;

        await AccessToken.findByIdAndDelete(findAccessToken._id)
        await RefreshToken.findByIdAndDelete(findRefreshToken._id)

        return await this.generateTokenPairs(user)
    }
}

export default authHelper;
