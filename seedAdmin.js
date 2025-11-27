// backend/seedAdmin.js
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import AdminUser from "./models/AdminUser.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const existing = await AdminUser.findOne({ email: "enquiry@gmail.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const admin = await AdminUser.create({
    email: "enquiry@gmail.com",
    password: "Rio@123",
  });

  console.log("Admin created:", admin.email);
  process.exit(0);
};

run();
