const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = require('../utils/fileUpload');

// Upload file
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let fileUrl = '';

    if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
      // Upload to S3
      const fileKey = `uploads/${req.user.id}/${Date.now()}-${file.originalname}`;
      const fileContent = await fs.readFile(file.path);

      await s3.putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: file.mimetype
      }).promise();

      fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
      // Local storage
      fileUrl = `/uploads/${file.filename}`;
    }

    // Clean up temp file
    await fs.unlink(file.path);

    res.json({
      fileUrl,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  } catch (error) {
    next(error);
  }
});

// Download file
router.get('/download', async (req, res, next) => {
  try {
    const { fileUrl } = req.query;

    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    if (fileUrl.startsWith('http')) {
      // S3 file - redirect or proxy
      res.redirect(fileUrl);
    } else {
      // Local file
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(fileUrl));
      res.download(filePath);
    }
  } catch (error) {
    next(error);
  }
});

// Delete file
router.delete('/delete', async (req, res, next) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL is required' });
    }

    if (fileUrl.startsWith('http') && process.env.AWS_S3_BUCKET) {
      // Delete from S3
      const urlParts = fileUrl.split('/');
      const fileKey = urlParts.slice(3).join('/'); // Remove https://bucket.s3.region.amazonaws.com/

      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey
      }).promise();
    } else {
      // Delete local file
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(fileUrl));
      await fs.unlink(filePath);
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

