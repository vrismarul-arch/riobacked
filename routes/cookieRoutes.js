import express from "express";
import { trackCookie,getCookies } from "../controllers/cookieController.js";

const router = express.Router();
router.get("/", getCookies); // ⬅ NEW
router.post("/track", trackCookie);

export default router;
