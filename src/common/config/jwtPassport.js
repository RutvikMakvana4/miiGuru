import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../../models/users";
import { JWT } from "../constants/constants";
import AccessToken from "../../../models/accessToken";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET
}

passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
    const decodedData = JSON.parse(payload.data)

    const checkToken = await AccessToken.findOne({
      userId: decodedData.userId,
      token: decodedData.jti
    });

    if (!checkToken) {
      return done(null, false)
    }

    const user = decodedData.userId

    return done(null, user)
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
}));


const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/v1/auth/google/callback",
  passReqToCallback: true
}

// Google OAuth Strategy
passport.use(new GoogleStrategy(googleOptions, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;