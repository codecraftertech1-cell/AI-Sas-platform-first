const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Post to multiple platforms
router.post('/post', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { content, platforms, mediaUrl } = req.body;

    if (!content || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ error: 'Content and platforms array are required' });
    }

    // TODO: Integrate with Instagram, Facebook, LinkedIn, TikTok, GMB APIs
    const results = platforms.map(platform => ({
      platform,
      status: 'posted',
      postId: `post_${Date.now()}_${platform}`,
      message: `Posted to ${platform}`
    }));

    res.json({ results });
  } catch (error) {
    next(error);
  }
});

// Schedule posts
router.post('/schedule', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { content, platforms, scheduledTime, mediaUrl } = req.body;

    if (!content || !platforms || !scheduledTime) {
      return res.status(400).json({ error: 'Content, platforms, and scheduled time are required' });
    }

    // TODO: Store in database and schedule using cron job
    const scheduledPost = {
      id: `schedule_${Date.now()}`,
      content,
      platforms,
      scheduledTime,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    res.json({ scheduledPost, message: 'Posts scheduled successfully' });
  } catch (error) {
    next(error);
  }
});

// Get templates
router.get('/templates', async (req, res, next) => {
  try {
    const templates = [
      {
        id: 'promotional',
        name: 'Promotional Post',
        template: 'Check out our latest {product}! {description} #promotion'
      },
      {
        id: 'educational',
        name: 'Educational Post',
        template: 'Did you know? {fact} Learn more: {link} #education'
      },
      {
        id: 'announcement',
        name: 'Announcement',
        template: 'We\'re excited to announce {announcement}! {details} #announcement'
      }
    ];

    res.json({ templates });
  } catch (error) {
    next(error);
  }
});

// Generate AI post with caption and hashtags
router.post('/generate', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { topic, platform, tone, includeHashtags } = req.body;

    const platformPrompts = {
      instagram: 'Create an engaging Instagram post with emojis',
      facebook: 'Create a Facebook post',
      linkedin: 'Create a professional LinkedIn post',
      tiktok: 'Create a catchy TikTok caption',
      twitter: 'Create a Twitter/X post'
    };

    const prompt = `${platformPrompts[platform] || 'Create a social media post'} about: ${topic}. Tone: ${tone || 'friendly'}. ${includeHashtags ? 'Include relevant hashtags.' : ''}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional social media content creator.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;

    // Extract hashtags if included
    const hashtags = content.match(/#\w+/g) || [];

    res.json({
      post: content,
      hashtags,
      platform
    });
  } catch (error) {
    next(error);
  }
});

// Schedule post to multiple platforms
router.post('/schedule', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { content, platforms, scheduledTime, mediaUrl } = req.body;

    // Validate platforms
    const validPlatforms = ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter', 'gmb'];
    const selectedPlatforms = platforms.filter(p => validPlatforms.includes(p.toLowerCase()));

    if (selectedPlatforms.length === 0) {
      return res.status(400).json({ error: 'No valid platforms selected' });
    }

    // In production, this would integrate with each platform's API
    // For now, return scheduled post info
    res.json({
      message: 'Post scheduled',
      content,
      platforms: selectedPlatforms,
      scheduledTime,
      mediaUrl
    });
  } catch (error) {
    next(error);
  }
});

// Get scheduled posts
router.get('/scheduled', async (req, res, next) => {
  try {
    // In production, fetch from database
    res.json({ posts: [] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

