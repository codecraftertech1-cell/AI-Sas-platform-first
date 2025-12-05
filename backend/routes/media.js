const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const fsSync = require('fs');
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

const upload = require('../utils/fileUpload');

// Video upload endpoint
router.post('/video/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    if (!file.mimetype.startsWith('video/')) {
      return res.status(400).json({ error: 'File must be a video' });
    }

    let fileUrl = '';
    if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
      const fileKey = `media/${req.user.id}/${Date.now()}-${file.originalname}`;
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

// Video transcribe endpoint
router.post('/video/transcribe', upload.single('file'), checkCredits('video_transcribe'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const isVideo = file.mimetype.startsWith('video/');
    const isAudio = file.mimetype.startsWith('audio/');

    if (!isVideo && !isAudio) {
      return res.status(400).json({ error: 'File must be video or audio' });
    }

    // Transcribe using OpenAI Whisper API
    const fileStream = fsSync.createReadStream(file.path);
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: 'en'
    });

    const transcript = transcriptionResponse.text;

    res.json({
      transcript,
      language: transcriptionResponse.language || 'en'
    });
  } catch (error) {
    next(error);
  }
});

// Video Q&A endpoint
router.post('/video/qa', upload.single('file'), checkCredits('video_transcribe'), async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // First transcribe
    const fileStream = fsSync.createReadStream(req.file.path);
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: 'en'
    });

    const transcript = transcriptionResponse.text;

    // Then answer question based on transcript
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant answering questions about a video/audio transcript.'
        },
        {
          role: 'user',
          content: `Transcript:\n${transcript.substring(0, 12000)}\n\nQuestion: ${question}`
        }
      ],
      temperature: 0.7
    });

    res.json({
      answer: response.choices[0].message.content,
      question,
      transcript: transcript.substring(0, 500) // Return first 500 chars of transcript
    });
  } catch (error) {
    next(error);
  }
});

// Upload and transcribe video/audio
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const isVideo = file.mimetype.startsWith('video/');
    const isAudio = file.mimetype.startsWith('audio/');

    if (!isVideo && !isAudio) {
      return res.status(400).json({ error: 'File must be video or audio' });
    }

    // Determine credit cost
    const creditType = isVideo ? 'video_transcribe' : 'audio_transcribe';
    
    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const cost = isVideo ? 10 : 5;
    if (user.credits < cost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: cost,
        available: user.credits
      });
    }

    // Upload to S3 or local storage
    let fileUrl = '';
    if (process.env.NODE_ENV === 'production' && process.env.AWS_S3_BUCKET) {
      const fileKey = `media/${req.user.id}/${Date.now()}-${file.originalname}`;
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

    // Transcribe using OpenAI Whisper API
    const fileStream = fsSync.createReadStream(file.path);
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: 'en'
    });

    const transcript = transcriptionResponse.text;

    // Generate summary
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes audio/video transcripts concisely.'
        },
        {
          role: 'user',
          content: `Please provide a brief summary of this transcript:\n\n${transcript.substring(0, 8000)}`
        }
      ],
      temperature: 0.7
    });

    const summary = summaryResponse.choices[0].message.content;

    // Deduct credits
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        credits: { decrement: cost },
        totalCreditsUsed: { increment: cost }
      }
    });

    // Log usage
    await prisma.usageLog.create({
      data: {
        userId: req.user.id,
        feature: creditType,
        creditsUsed: cost,
        metadata: { filename: file.originalname, type: file.mimetype }
      }
    });

    // Save to database (using Document model for now, or create Media model)
    const media = await prisma.document.create({
      data: {
        userId: req.user.id,
        filename: file.originalname,
        fileUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        content: transcript,
        summary
      }
    });

    // Clean up temp file
    await fs.unlink(file.path);

    res.status(201).json({ media, transcript, summary });
  } catch (error) {
    next(error);
  }
});

// Chat with transcript
router.post('/:id/chat', checkCredits('pdf_chat'), async (req, res, next) => {
  try {
    const { message } = req.body;
    const media = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    if (!media.content) {
      return res.status(400).json({ error: 'Transcript not available' });
    }

    // Set up streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const context = media.content.substring(0, 12000);

    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant answering questions about a video/audio transcript. Use the following transcript as context:\n\n${context}`
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

module.exports = router;

