import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/User";

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_STRATEGY_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id }).exec();
        if (!user) {
          const newUser = {
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile.photos?.[0]?.value,
            role: "USER", // Make sure this aligns with your IUser interface
          };
          user = new UserModel(newUser);
          await user.save();
        }
        // Ensure the object passed to done() matches IUser interface
        done(null, user.toObject());
      } catch (error) {
        return done(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred"),
          undefined
        );
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id).exec();
    done(null, user ? user.toObject() : false);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

export { passport as googlePassportStrategy };
