import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    concern: { type: String, required: true },
    duration: { type: String, default: "" },
    symptoms: { type: [String], default: [] },
    pain_level: { type: Number, default: null },
    landing_page: { type: String, default: "" },

    pdf_link: { type: String, default: "" }, // ⬅️ added

    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
