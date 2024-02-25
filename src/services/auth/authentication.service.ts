import { Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../../interfaces/customRequest";
import { UserModel } from "../../models/User";
import { generateTokens } from "../../utils/generateTokens";

export const refreshUserToken = async (req: CustomRequest, res: Response) => {
  try {
    const requestRefreshToken = req.cookies.refreshToken;
    if (!requestRefreshToken) {
      return res.sendStatus(401); // Unauthorized
    }
    const payload = jwt.verify(
      requestRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    const userEmail = payload.email;

    // Optionally validate the refresh token further, e.g., checking it against a store of issued tokens

    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.sendStatus(403); // Forbidden
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set the new tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    }); // 15 minutes
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    res.sendStatus(200);
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    res.sendStatus(403); // Forbidden
  }
};
