import mongoose from "mongoose";

const cookieTrackSchema = new mongoose.Schema(
  {
    cookie_id: { type: String, required: true },
    accepted: { type: Boolean, default: false },

    // Browser / device info
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    device_type: { type: String, default: "" }, // "mobile" / "desktop" / "tablet"
    user_agent: { type: String, default: "" },
    language: { type: String, default: "" },
    screen_resolution: { type: String, default: "" },

    // Navigation info
    referrer: { type: String, default: "" },
    site_page: { type: String, default: "" },

    // IP info
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CookieTrack", cookieTrackSchema);
