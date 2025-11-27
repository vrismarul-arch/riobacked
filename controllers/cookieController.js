import CookieTrack from "../models/CookieTrack.js";

export const trackCookie = async (req, res) => {
  try {
    const {
      cookie_id,
      accepted,
      browser,
      os,
      device_type,
      user_agent,
      language,
      screen_resolution,
      referrer,
      site_page,
    } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    const entry = await CookieTrack.create({
      cookie_id,
      accepted,
      browser,
      os,
      device_type,
      user_agent,
      language,
      screen_resolution,
      referrer,
      site_page,
      ip,
    });

    res.status(200).json({ message: "Cookie tracked", data: entry });
  } catch (err) {
    console.error("Cookie Track Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCookies = async (req, res) => {
  try {
    const items = await CookieTrack.find({}).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error("Get Cookies Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
