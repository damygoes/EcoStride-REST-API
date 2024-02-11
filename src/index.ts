import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import activityRoute from "./controllers/activity.controller";
import authenticateUserRoute from "./controllers/auth.controller";
import userRoute from "./controllers/user.controller";
import { corsOptions } from "./utils/corsOptions";

dotenv.config();

const PORT = process.env.PORT || 8000;

// Middleware
const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());

// Routes
app.use("/api", authenticateUserRoute);
app.use("/users", userRoute);
app.use("/activities", activityRoute);

// DB Connection
mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.log("Error connecting to MongoDB: " + error);
    process.exit(-1);
  });

// Server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
