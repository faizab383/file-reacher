const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle file upload and generate link
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const fileId = crypto.randomBytes(16).toString('hex');
    const fileLink = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Save file metadata to a file or database (optional)
    const fileMetadata = {
      id: fileId,
      filename: req.file.filename,
      path: req.file.path,
      link: fileLink,
      uploadDate: new Date()
    };

    fs.writeFileSync(`${uploadDir}/${fileId}.json`, JSON.stringify(fileMetadata, null, 2));

    res.json({ link: fileLink });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the file upload.' });
  }
});

// Handle sending email
router.post('/send-email', (req, res) => {
  const { fromEmail, toEmail, fileLink } = req.body;

  if (!fromEmail || !toEmail || !fileLink) {
    return res.status(400).send('Missing required fields.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: 'File Sharing Link',
    text: `You have received a file. You can download it using the following link: ${fileLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Email sent: ' + info.response);
  });
});

module.exports = router;
