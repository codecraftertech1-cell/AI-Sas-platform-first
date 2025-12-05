const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Use centralized upload configuration
const upload = require('../utils/fileUpload');

// Files upload endpoint (alias)
router.post('/files/upload', upload.single('file'), checkCredits('pdf_upload'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let fileUrl = '';

    if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
      const fileKey = `documents/${req.user.id}/${Date.now()}-${file.originalname}`;
      const fileContent = await fs.readFile(file.path);

      await s3.putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: file.mimetype
      }).promise();

      fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
      fileUrl = `/uploads/${file.filename}`;
    }

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

// PDF process endpoint
router.post('/pdf/process', upload.single('file'), checkCredits('pdf_upload'), async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    res.json({
      text: pdfData.text,
      pages: pdfData.numpages,
      metadata: pdfData.info
    });
  } catch (error) {
    next(error);
  }
});

// PDF summarize endpoint
router.post('/pdf/summarize', upload.single('file'), checkCredits('pdf_upload'), async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const pdfBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes PDF documents concisely.'
        },
        {
          role: 'user',
          content: `Please provide a comprehensive summary of this PDF:\n\n${pdfData.text.substring(0, 12000)}`
        }
      ],
      temperature: 0.7
    });

    res.json({
      summary: summaryResponse.choices[0].message.content,
      pages: pdfData.numpages
    });
  } catch (error) {
    next(error);
  }
});

// PDF Q&A endpoint
router.post('/pdf/qa', upload.single('file'), checkCredits('pdf_chat'), async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const pdfBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    const context = pdfData.text.substring(0, 12000);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant answering questions about a PDF document. Use the following document content as context:\n\n${context}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7
    });

    res.json({
      answer: response.choices[0].message.content,
      question
    });
  } catch (error) {
    next(error);
  }
});

// Upload and process document
router.post('/upload', upload.single('file'), checkCredits('pdf_upload'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let extractedText = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      const pdfBuffer = await fs.readFile(file.path);
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const docxBuffer = await fs.readFile(file.path);
      const result = await mammoth.extractRawText({ buffer: docxBuffer });
      extractedText = result.value;
    } else if (file.mimetype === 'text/plain') {
      extractedText = await fs.readFile(file.path, 'utf-8');
    }

    // Generate summary using AI
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes documents concisely.'
        },
        {
          role: 'user',
          content: `Please provide a brief summary of this document:\n\n${extractedText.substring(0, 8000)}`
        }
      ],
      temperature: 0.7
    });

    const summary = summaryResponse.choices[0].message.content;

    // Upload to S3 or local storage
    let fileUrl = '';
    if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
      const fileKey = `documents/${req.user.id}/${Date.now()}-${file.originalname}`;
      const fileContent = await fs.readFile(file.path);

      await s3.putObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: file.mimetype
      }).promise();

      fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
      // Local storage for development
      fileUrl = `/uploads/${file.filename}`;
    }

    // Save to database
    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        filename: file.originalname,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        content: extractedText,
        summary
      }
    });

    // Clean up temp file
    await fs.unlink(file.path);

    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
});

// Get all documents
router.get('/', async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        fileType: true,
        fileSize: true,
        summary: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

// Get single document
router.get('/:id', async (req, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    next(error);
  }
});

// Chat with document
router.post('/:id/chat', checkCredits('pdf_chat'), async (req, res, next) => {
  try {
    const { message } = req.body;
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (!document.content) {
      return res.status(400).json({ error: 'Document content not available' });
    }

    // Set up streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const context = document.content.substring(0, 12000); // Limit context size

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant answering questions about a document. Use the following document content as context:\n\n${context}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        stream: true,
        temperature: 0.7
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

// Export document summary/answers
router.post('/:id/export', async (req, res, next) => {
  try {
    const { format = 'txt' } = req.body;
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    let content = '';
    if (format === 'summary') {
      content = document.summary || 'No summary available';
    } else if (format === 'full') {
      content = `Document: ${document.filename}\n\nSummary:\n${document.summary || 'N/A'}\n\nContent:\n${document.content || 'N/A'}`;
    } else {
      content = document.content || document.summary || 'No content available';
    }

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${document.filename}-${format}.txt"`);
    res.send(content);
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete('/:id', async (req, res, next) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (document) {
      // Delete from S3 if using S3, otherwise skip (local file)
      if (document.fileUrl.startsWith('http') && process.env.AWS_S3_BUCKET) {
        try {
          const fileKey = document.fileUrl.split('.com/')[1];
          await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey
          }).promise();
        } catch (error) {
          console.error('Error deleting from S3:', error);
          // Continue with database deletion even if S3 delete fails
        }
      }

      // Delete from database
      await prisma.document.delete({
        where: { id: req.params.id }
      });
    }

    res.json({ message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

