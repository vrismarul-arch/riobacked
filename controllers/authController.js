// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
};

const sendRefreshTokenCookie = (res, token) => {
  res.cookie("rtk", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production with HTTPS
    path: "/api/auth/refresh",
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(admin);
    const refreshToken = createRefreshToken(admin);

    admin.refreshToken = refreshToken;
    await admin.save();

    sendRefreshTokenCookie(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.rtk;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const admin = await AdminUser.findById(payload.id);

    if (!admin || admin.refreshToken !== token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = createAccessToken(admin);
    res.json({
      accessToken,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Refresh error:", err.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const adminLogout = async (req, res) => {
  const token = req.cookies?.rtk;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const admin = await AdminUser.findById(payload.id);
      if (admin) {
        admin.refreshToken = "";
        await admin.save();
      }
    } catch (e) {}
  }

  res.clearCookie("rtk", { path: "/api/auth/refresh" });
  res.json({ message: "Logged out" });
};
