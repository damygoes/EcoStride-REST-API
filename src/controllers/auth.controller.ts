import express from "express";
import passport from "passport";
import { CustomRequest } from "../interfaces/customRequest";
import { IUser } from "../models/User";
import { refreshUserToken } from "../services/auth/authentication.service";
import { generateTokens } from "../utils/generateTokens";

const authRouter = express.Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    const user = req.user as IUser;
    if (!user) {
      return res.status(400).send("User information is missing");
    }
    const { accessToken, refreshToken } = generateTokens(user);
    // Set access token in HTTP-only cookie (HHTP-only cookies are more secure than local storage and prevent XSS attacks from accessing the token)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 15 * 60, // 15 minutes
    });

    // Set refresh token in HTTP-only cookie, typically with a longer lifespan
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      path: "/", // Restrict the path to refresh token endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

// Refresh token endpoint
authRouter.post("/auth/refresh", (req, res) => {
  const customReq = req as CustomRequest;
  refreshUserToken(customReq, res);
});

// Logout endpoint
authRouter.post("/auth/logout", (req, res) => {
  console.log("Logging out");
  // clear accessToken cookie
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  // clear refreshToken cookie
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.status(200).send("Logged out successfully");
});

export default authRouter;
