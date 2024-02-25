import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateTokens = (user: IUser) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

  const accessToken = jwt.sign(
    { userId: user.userId, email: user.email },
    accessTokenSecret,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user.userId, email: user.email },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
