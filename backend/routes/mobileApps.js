const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();

// Initialize OpenAI with error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY is not set in environment variables');
  } else {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI:', error.message);
}

// Get all mobile apps
router.get('/', async (req, res, next) => {
  try {
    const mobileApps = await prisma.mobileApp.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ mobileApps });
  } catch (error) {
    next(error);
  }
});

// Get single mobile app
router.get('/:id', async (req, res, next) => {
  try {
    const mobileApp = await prisma.mobileApp.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!mobileApp) {
      return res.status(404).json({ error: 'Mobile app not found' });
    }

    res.json({ mobileApp });
  } catch (error) {
    next(error);
  }
});

// Generate mobile app code
router.post('/generate', checkCredits('mobile_app_generate'), async (req, res, next) => {
  try {
    const { title, prompt, framework = 'react-native' } = req.body;

    const systemPrompt = `You are a professional mobile app developer. Generate a complete ${framework} mobile app based on the user's prompt.
    Return a JSON object with:
    - code: complete source code files as an object where keys are file paths and values are file contents
    - packageJson: package.json content
    - readme: README.md with setup instructions
    
    Make it production-ready, well-structured, and follow best practices.`;

    if (!openai || !process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    let codeData;
    try {
      const parsed = JSON.parse(response.choices[0].message.content);
      codeData = parsed;
      
      // Ensure code structure is correct
      if (!codeData.code || typeof codeData.code !== 'object') {
        codeData.code = { 'App.js': JSON.stringify(parsed, null, 2) };
      }
      if (!codeData.packageJson) {
        codeData.packageJson = {
          name: title.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          main: 'App.js'
        };
      }
      if (!codeData.readme) {
        codeData.readme = `# ${title}\n\nGenerated mobile app using AI.\n\n## Setup\n\nInstall dependencies and run the app.`;
      }
    } catch (e) {
      // Fallback: create basic structure
      codeData = {
        code: { 
          'App.js': response.choices[0].message.content || '// Generated mobile app code',
          'package.json': JSON.stringify({
            name: title.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            main: 'App.js'
          }, null, 2)
        },
        packageJson: {
          name: title.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          main: 'App.js'
        },
        readme: `# ${title}\n\nGenerated mobile app using AI.\n\n## Setup\n\nInstall dependencies and run the app.`
      };
    }

    // Store as JSON string
    const mobileApp = await prisma.mobileApp.create({
      data: {
        userId: req.user.id,
        title: title || 'New Mobile App',
        prompt,
        code: JSON.stringify(codeData),
        previewUrl: `/preview/mobile-app/${Date.now()}`
      }
    });

    res.status(201).json({ mobileApp });
  } catch (error) {
    next(error);
  }
});

// Update mobile app
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, code } = req.body;

    const mobileApp = await prisma.mobileApp.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        ...(title && { title }),
        ...(code && { code })
      }
    });

    res.json({ mobileApp });
  } catch (error) {
    next(error);
  }
});

// Download mobile app package
router.get('/download/:id', async (req, res, next) => {
  try {
    const mobileApp = await prisma.mobileApp.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!mobileApp) {
      return res.status(404).json({ error: 'Mobile app not found' });
    }

    let codeData;
    try {
      codeData = JSON.parse(mobileApp.code);
    } catch (e) {
      codeData = { 'App.js': mobileApp.code };
    }

    res.json({
      files: codeData,
      title: mobileApp.title,
      message: 'Use frontend JSZip to create ZIP file'
    });
  } catch (error) {
    next(error);
  }
});

// Download mobile app as ZIP (alias)
router.get('/:id/download', async (req, res, next) => {
  try {
    const mobileApp = await prisma.mobileApp.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!mobileApp) {
      return res.status(404).json({ error: 'Mobile app not found' });
    }

    let codeData;
    try {
      codeData = JSON.parse(mobileApp.code);
    } catch (e) {
      codeData = { 'App.js': mobileApp.code };
    }

    res.json({
      files: codeData,
      title: mobileApp.title,
      message: 'Use frontend JSZip to create ZIP file'
    });
  } catch (error) {
    next(error);
  }
});

// Share mobile app preview
router.post('/:id/share', async (req, res, next) => {
  try {
    const mobileApp = await prisma.mobileApp.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!mobileApp) {
      return res.status(404).json({ error: 'Mobile app not found' });
    }

    // Generate shareable link
    const shareUrl = `${process.env.FRONTEND_URL}/preview/mobile-app/${mobileApp.id}`;

    res.json({
      shareUrl,
      message: 'Share link generated'
    });
  } catch (error) {
    next(error);
  }
});

// Delete mobile app
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.mobileApp.delete({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Mobile app deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

