const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const auth = require('../middleware/auth');
const Upload = require('../models/Upload');
const User = require('../models/User');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Excel file
router.post('/', [auth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const uploadDoc = new Upload({
      user: req.user.id,
      filename: req.file.filename || 'uploaded.xlsx',
      originalname: req.file.originalname,
      data,
    });
    await uploadDoc.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { uploads: uploadDoc._id } });
    res.json(uploadDoc);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 