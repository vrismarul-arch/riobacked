// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import leadRoutes from "./routes/leadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieRoutes from "./routes/cookieRoutes.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
origin: ["http://localhost:5173", "https://myclinic.com"],    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Running");
});
app.use("/api/cookies", cookieRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
