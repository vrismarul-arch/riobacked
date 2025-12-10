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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 FIXED CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",                        // Local Dev
      "https://regenorthocare.netlify.app",           // Live Frontend
      "https://riobacked.onrender.com" ,               // Backend Domain Allowed
      "https://visit.regenorthocareforms.com"                // Backend Domain Allowed
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Routes
app.use("/api/cookies", cookieRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
