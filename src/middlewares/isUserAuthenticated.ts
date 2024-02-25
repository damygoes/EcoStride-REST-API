import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies.accessToken; // Access token read from cookies

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: any, authData: any) => {
        if (err) {
          return res.sendStatus(403); // Forbidden
        }
        req.user = authData;
        next();
      }
    );
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};
