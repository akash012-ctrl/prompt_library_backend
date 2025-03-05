// controllers/reportController.js
const Report = require('../models/Report');

// @desc    Get all reports (Admin-only)
// @route   GET /api/reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('promptId').populate('reportedBy', 'email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { promptId, reason } = req.body;

    const newReport = new Report({
      promptId,
      reportedBy: req.user, // User ID from auth middleware
      reason,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a report by ID
// @route   DELETE /api/reports/:id
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);

    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};