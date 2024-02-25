import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import http from "http";
import mongoose from "mongoose";
import passport from "passport";
import activityRoute from "./controllers/activity.controller";
import authRouter from "./controllers/auth.controller";
import commentRouter from "./controllers/comment.controller";
import userRoute from "./controllers/user.controller";
import "./strategies/google-strategy";
import { corsOptions } from "./utils/corsOptions";
dotenv.config();

// Validate essential environment variables
const validateEnvVars = () => {
  const requiredEnvVars = [
    "MONGO_CONNECTION_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "FRONTEND_URL",
    "PORT",
  ];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is missing`);
    }
  });
};
validateEnvVars();

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());
app.use(passport.initialize());

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env.development" });
}

app.use("/api", authRouter);
app.use("/users", userRoute);
app.use("/activities", activityRoute);
app.use("/activities/:slug/comments", commentRouter);

const serverMessage =
  process.env.NODE_ENV === "production"
    ? "Server running..."
    : `Server is running on port ${PORT}`;

mongoose
  .connect(process.env.MONGO_CONNECTION_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(-1);
  });

const server = http.createServer(app);
server.listen(PORT, () => console.log(serverMessage));
