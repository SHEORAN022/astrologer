const Report = require("../models/Report");

// ✅ Get all reports (with optional search by clientName)
exports.getReports = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.clientName = { $regex: search, $options: "i" }; // case-insensitive
    }
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports", error });
  }
};

// ✅ Create a new report
exports.createReport = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : null;
    const report = new Report({ ...req.body, fileUrl });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error });
  }
};

// ✅ Get single report
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report", error });
  }
};

// ✅ Update report
exports.updateReport = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : req.body.fileUrl;
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fileUrl },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error });
  }
};

// ✅ Delete report
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report", error });
  }
};
