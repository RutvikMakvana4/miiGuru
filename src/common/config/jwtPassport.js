import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../../../models/users";
import { JWT } from "../constants/constants";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT.SECRET
}

passport.use(new JwtStrategy(options, async (payload, done) => {
  try {
      const decodedData = JSON.parse(payload.data)

      const checkToken = await AccessToken.findOne({
          userId: decodedData.user,
          token: decodedData.jti
      });

      if (!checkToken) {
          return done(null, false)
      }

      const user = decodedData.user
      return done(null, user)
  } catch (error) {
      console.log(error);
      return done(error, false);
  }
}));
