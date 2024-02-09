import express from "express";
import { authenticateUser } from "../services/auth/authentication.service";

const router = express.Router();

router.post("/auth", authenticateUser);

export default router;
