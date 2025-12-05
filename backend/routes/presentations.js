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

// Get all presentations
router.get('/', async (req, res, next) => {
  try {
    const presentations = await prisma.presentation.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ presentations });
  } catch (error) {
    next(error);
  }
});

// Get single presentation
router.get('/:id', async (req, res, next) => {
  try {
    const presentation = await prisma.presentation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    res.json({ presentation });
  } catch (error) {
    next(error);
  }
});

// Generate presentation (alias)
router.post('/generate', checkCredits('presentation_generate'), async (req, res, next) => {
  try {
    const { title, prompt, slideCount = 5 } = req.body;

    const systemPrompt = `You are a professional presentation creator. Create a ${slideCount}-slide presentation based on the user's prompt. 
    Return a JSON object with a "slides" array where each object represents a slide with:
    - title: string
    - content: array of bullet points (strings)
    - layout: "title-content" or "title-image-content"
    
    Make it professional and engaging. Return ONLY valid JSON.`;

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

    let slides;
    try {
      const parsed = JSON.parse(response.choices[0].message.content);
      slides = parsed.slides || (Array.isArray(parsed) ? parsed : [parsed]);
      
      if (!Array.isArray(slides)) {
        if (typeof slides === 'object' && slides !== null) {
          slides = [slides];
        } else {
          slides = [];
        }
      }
      
      // Ensure slides have proper structure
      slides = slides.map((slide, index) => ({
        title: slide.title || `Slide ${index + 1}`,
        content: Array.isArray(slide.content) 
          ? slide.content.filter((c) => c && typeof c === 'string')
          : (slide.content ? [String(slide.content)] : ['Content placeholder']),
        layout: slide.layout || 'title-content'
      }));
      
      // Ensure we have the right number of slides
      if (slides.length < slideCount) {
        const additionalSlides = Array.from({ length: slideCount - slides.length }, (_, i) => ({
          title: `Slide ${slides.length + i + 1}`,
          content: ['Content will be added'],
          layout: 'title-content'
        }));
        slides = [...slides, ...additionalSlides];
      } else if (slides.length > slideCount) {
        slides = slides.slice(0, slideCount);
      }
    } catch (e) {
      // Fallback: create slides from text
      const content = response.choices[0].message.content;
      const contentParts = content.split('\n\n').filter(p => p.trim());
      slides = Array.from({ length: slideCount }, (_, i) => {
        const part = contentParts[i] || contentParts[0] || 'Content';
        const lines = part.split('\n').filter(l => l.trim());
        return {
          title: `Slide ${i + 1}`,
          content: lines.length > 0 ? lines : [part],
          layout: 'title-content'
        };
      });
    }

    const presentation = await prisma.presentation.create({
      data: {
        userId: req.user.id,
        title: title || 'New Presentation',
        slides
      }
    });

    res.status(201).json({ presentation });
  } catch (error) {
    console.error('Presentation generation error:', error);
    next(error);
  }
});

// Edit presentation
router.post('/edit', checkCredits('presentation_generate'), async (req, res, next) => {
  try {
    const { id, changes } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Presentation ID is required' });
    }

    const presentation = await prisma.presentation.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    // Use AI to edit based on changes
    const editPrompt = `Edit this presentation based on: ${JSON.stringify(changes)}. 
    Current slides: ${JSON.stringify(presentation.slides)}.
    Return updated slides in the same JSON format.`;

    if (!openai || !process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a professional presentation editor.' },
        { role: 'user', content: editPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    let updatedSlides;
    try {
      const parsed = JSON.parse(response.choices[0].message.content);
      updatedSlides = parsed.slides || parsed;
    } catch (e) {
      updatedSlides = presentation.slides;
    }

    const updated = await prisma.presentation.update({
      where: { id },
      data: { slides: updatedSlides }
    });

    res.json({ presentation: updated });
  } catch (error) {
    next(error);
  }
});

// Export PPTX
router.get('/export-pptx/:id', async (req, res, next) => {
  try {
    const presentation = await prisma.presentation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    // Return presentation data for frontend to convert to PPTX
    // In production, use pptxgenjs on server side
    res.json({
      presentation,
      format: 'pptx',
      message: 'Use frontend pptxgenjs library to generate PPTX file'
    });
  } catch (error) {
    next(error);
  }
});

// Create new presentation
router.post('/', checkCredits('presentation_generate'), async (req, res, next) => {
  try {
    const { title, prompt, slideCount = 5 } = req.body;

    const systemPrompt = `You are a professional presentation creator. Create a ${slideCount}-slide presentation based on the user's prompt. 
    Return a JSON array where each object represents a slide with:
    - title: string
    - content: array of bullet points (strings)
    - layout: "title-content" or "title-image-content"
    
    Make it professional and engaging.`;

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

    let slides;
    try {
      const parsed = JSON.parse(response.choices[0].message.content);
      slides = parsed.slides || parsed;
      if (!Array.isArray(slides)) {
        slides = [slides];
      }
    } catch (e) {
      // Fallback: create slides from text
      const content = response.choices[0].message.content;
      slides = content.split('\n\n').slice(0, slideCount).map((text, i) => ({
        title: `Slide ${i + 1}`,
        content: text.split('\n').filter(l => l.trim()),
        layout: 'title-content'
      }));
    }

    const presentation = await prisma.presentation.create({
      data: {
        userId: req.user.id,
        title: title || 'New Presentation',
        slides
      }
    });

    res.status(201).json({ presentation });
  } catch (error) {
    next(error);
  }
});

// Update presentation
router.patch('/:id', async (req, res, next) => {
  try {
    const { title, slides } = req.body;

    const presentation = await prisma.presentation.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: {
        ...(title && { title }),
        ...(slides && { slides })
      }
    });

    res.json({ presentation });
  } catch (error) {
    next(error);
  }
});

// Export presentation as PPTX (simplified - returns JSON for frontend to convert)
router.post('/:id/export', async (req, res, next) => {
  try {
    const { format = 'json' } = req.body;
    const presentation = await prisma.presentation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }

    if (format === 'json') {
      res.json({ presentation });
    } else {
      // For PPTX/PDF, return data for frontend to handle conversion
      res.json({
        presentation,
        exportUrl: `/api/presentations/${req.params.id}/download?format=${format}`
      });
    }
  } catch (error) {
    next(error);
  }
});

// Delete presentation
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.presentation.delete({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Presentation deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

