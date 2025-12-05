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

// Get all websites
router.get('/', async (req, res, next) => {
  try {
    const websites = await prisma.website.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ websites });
  } catch (error) {
    next(error);
  }
});

// Get single website
router.get('/:id', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json({ website });
  } catch (error) {
    next(error);
  }
});

// Generate website code
router.post('/generate-code', checkCredits('website_generate'), async (req, res, next) => {
  try {
    const { title, prompt } = req.body;

    const systemPrompt = `You are a professional web developer. Generate a complete, modern, responsive website based on the user's prompt.
    Return a JSON object with:
    - html: complete HTML code with inline CSS and JavaScript
    - css: separate CSS code (optional, if not inline)
    - js: separate JavaScript code (optional)
    
    Make it beautiful, modern, and fully functional. Use Tailwind CSS classes or inline styles.
    Include all necessary HTML, CSS, and JavaScript in a single HTML file that can run standalone.`;

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
      codeData = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      // Fallback
      codeData = {
        html: response.choices[0].message.content,
        css: '',
        js: ''
      };
    }

    // Combine into single HTML if separate
    let fullHtml = codeData.html;
    if (codeData.css && !fullHtml.includes('<style>')) {
      fullHtml = fullHtml.replace('</head>', `<style>${codeData.css}</style></head>`);
    }
    if (codeData.js && !fullHtml.includes('<script>')) {
      fullHtml = fullHtml.replace('</body>', `<script>${codeData.js}</script></body>`);
    }

    const website = await prisma.website.create({
      data: {
        userId: req.user.id,
        title: title || 'New Website',
        prompt,
        code: fullHtml,
        previewUrl: `/preview/website/${Date.now()}`
      }
    });

    res.status(201).json({ website });
  } catch (error) {
    next(error);
  }
});

// Preview website
router.get('/preview/:id', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Return HTML for preview
    res.setHeader('Content-Type', 'text/html');
    res.send(website.code);
  } catch (error) {
    next(error);
  }
});

// Export website
router.get('/export/:id', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Create ZIP structure
    const zipData = {
      'index.html': website.code,
      'README.md': `# ${website.title}\n\nGenerated website from prompt: ${website.prompt}\n\nCreated: ${website.createdAt}`
    };

    // Return JSON for frontend to create ZIP
    res.json({ 
      files: zipData,
      title: website.title,
      message: 'Use frontend JSZip to create ZIP file'
    });
  } catch (error) {
    next(error);
  }
});

// Generate website
router.post('/generate', checkCredits('website_generate'), async (req, res, next) => {
  try {
    const { title, prompt } = req.body;

    const systemPrompt = `You are a professional web developer. Generate a complete, modern, responsive website based on the user's prompt.
    Return a JSON object with:
    - html: complete HTML code with inline CSS and JavaScript
    - css: separate CSS code (optional, if not inline)
    - js: separate JavaScript code (optional)
    
    Make it beautiful, modern, and fully functional. Use Tailwind CSS classes or inline styles.
    Include all necessary HTML, CSS, and JavaScript in a single HTML file that can run standalone.`;

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
      codeData = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      // Fallback
      codeData = {
        html: response.choices[0].message.content,
        css: '',
        js: ''
      };
    }

    // Combine into single HTML if separate
    let fullHtml = codeData.html;
    if (codeData.css && !fullHtml.includes('<style>')) {
      fullHtml = fullHtml.replace('</head>', `<style>${codeData.css}</style></head>`);
    }
    if (codeData.js && !fullHtml.includes('<script>')) {
      fullHtml = fullHtml.replace('</body>', `<script>${codeData.js}</script></body>`);
    }

    const website = await prisma.website.create({
      data: {
        userId: req.user.id,
        title: title || 'New Website',
        prompt,
        code: fullHtml,
        previewUrl: `/preview/website/${Date.now()}`
      }
    });

    res.status(201).json({ website });
  } catch (error) {
    next(error);
  }
});

// Update website
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, code } = req.body;

    const website = await prisma.website.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        ...(title && { title }),
        ...(code && { code })
      }
    });

    res.json({ website });
  } catch (error) {
    next(error);
  }
});

// Download website as ZIP
router.get('/:id/download', async (req, res, next) => {
  try {
    const website = await prisma.website.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // Create ZIP structure
    const zipData = {
      'index.html': website.code,
      'README.md': `# ${website.title}\n\nGenerated website from prompt: ${website.prompt}\n\nCreated: ${website.createdAt}`
    };

    // Return JSON for frontend to create ZIP
    res.json({ 
      files: zipData,
      title: website.title,
      message: 'Use frontend JSZip to create ZIP file'
    });
  } catch (error) {
    next(error);
  }
});

// Delete website
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.website.delete({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Website deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

