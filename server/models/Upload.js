const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  data: { type: Object }, // Parsed Excel data
  analysis: { type: Object }, // Chart/analysis info
});

module.exports = mongoose.model('Upload', UploadSchema); 