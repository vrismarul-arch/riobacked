import Lead from "../models/Lead.js";

const pdfFiles = {
  "Knee Pain":
    "https://mrcet.com/downloads/digital_notes/IT/CLOUD%20COMPUTING%20DIGITAL%20NOTES%20(R18A0523).pdf",
  "Back / Spine Pain": "https://your-cdn.com/pdfs/back.pdf",
  "Shoulder Pain": "https://your-cdn.com/pdfs/shoulder.pdf",
  "Sports Injury": "https://your-cdn.com/pdfs/sports.pdf",
  "Other Joint Pain": "https://your-cdn.com/pdfs/joint.pdf",
};

export const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      concern,
      duration,
      symptoms,
      pain_level,
      landing_page,
    } = req.body;

    if (!name || !phone || !concern) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pdf_link = pdfFiles[concern] || ""; // ⬅️ auto assign PDF

    const lead = await Lead.create({
      name,
      phone,
      email,
      concern,
      duration,
      symptoms,
      pain_level,
      landing_page,
      pdf_link, // ⬅️ save to database
    });

    return res.status(200).json({
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Lead Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
export const getLeadsChartData = async (req, res) => {
  try {
    const chartData = await Lead.aggregate([
      {
        $group: {
          _id: "$concern",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          concern: "$_id",
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(chartData);
  } catch (error) {
    console.error("Chart Data Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLeads = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Lead.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lead.countDocuments(),
    ]);

    res.json({
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ message: "Status updated", data: lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
