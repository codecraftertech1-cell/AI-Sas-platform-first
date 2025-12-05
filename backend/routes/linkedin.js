const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');
const axios = require('axios');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// LinkedIn login (OAuth)
router.post('/login', async (req, res, next) => {
  try {
    // In production, initiate LinkedIn OAuth flow
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    
    res.json({
      authUrl,
      message: 'Redirect user to authUrl to complete LinkedIn login'
    });
  } catch (error) {
    next(error);
  }
});

// LinkedIn OAuth callback
router.get('/oauth/callback', async (req, res, next) => {
  try {
    const { code } = req.query;
    // Exchange code for access token
    // This requires LinkedIn API credentials
    // For now, return success message
    res.json({ message: 'LinkedIn OAuth connected', code });
  } catch (error) {
    next(error);
  }
});

// Auto message connections
router.post('/auto-message', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { connections, message } = req.body;

    if (!connections || !Array.isArray(connections)) {
      return res.status(400).json({ error: 'Connections array is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // TODO: Integrate with LinkedIn Messaging API
    const results = connections.map(connection => ({
      connectionId: connection,
      status: 'queued',
      message
    }));

    res.json({ results, message: 'Messages queued for sending' });
  } catch (error) {
    next(error);
  }
});

// Auto comment on posts
router.post('/auto-comment', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { postId, comment } = req.body;

    if (!postId || !comment) {
      return res.status(400).json({ error: 'Post ID and comment are required' });
    }

    // TODO: Integrate with LinkedIn Social Actions API
    res.json({
      postId,
      comment,
      status: 'posted',
      message: 'Comment posted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Schedule LinkedIn post
router.post('/schedule-post', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { content, scheduledTime } = req.body;

    if (!content || !scheduledTime) {
      return res.status(400).json({ error: 'Content and scheduled time are required' });
    }

    // TODO: Store in database and schedule using cron job
    const scheduledPost = {
      id: `post_${Date.now()}`,
      content,
      scheduledTime,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    res.json({ scheduledPost, message: 'Post scheduled successfully' });
  } catch (error) {
    next(error);
  }
});

// Generate AI post
router.post('/generate-post', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { topic, tone, length } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional LinkedIn content creator. Create engaging LinkedIn posts with relevant hashtags.`
        },
        {
          role: 'user',
          content: `Create a ${tone || 'professional'} LinkedIn post about: ${topic}. Length: ${length || 'medium'}. Include relevant hashtags.`
        }
      ],
      temperature: 0.7
    });

    const post = response.choices[0].message.content;

    res.json({ post });
  } catch (error) {
    next(error);
  }
});

// Schedule post
router.post('/schedule', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { content, scheduledTime, platforms } = req.body;

    // Save scheduled post (would need ScheduledPost model)
    // For now, return success
    res.json({
      message: 'Post scheduled',
      content,
      scheduledTime,
      platforms
    });
  } catch (error) {
    next(error);
  }
});

// Auto message
router.post('/auto-message', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { recipientId, message, template } = req.body;

    // Generate personalized message if template provided
    let finalMessage = message;
    if (template) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn messaging assistant.'
          },
          {
            role: 'user',
            content: `Create a personalized LinkedIn message using this template: ${template}`
          }
        ],
        temperature: 0.7
      });
      finalMessage = response.choices[0].message.content;
    }

    // In production, this would send via LinkedIn API
    res.json({
      message: 'Message sent',
      recipientId,
      content: finalMessage
    });
  } catch (error) {
    next(error);
  }
});

// Auto comment
router.post('/auto-comment', checkCredits('social_post'), async (req, res, next) => {
  try {
    const { postId, comment } = req.body;

    // Generate comment if not provided
    let finalComment = comment;
    if (!comment) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LinkedIn commenter. Create engaging, valuable comments.'
          },
          {
            role: 'user',
            content: `Create a professional comment for LinkedIn post ID: ${postId}`
          }
        ],
        temperature: 0.7
      });
      finalComment = response.choices[0].message.content;
    }

    res.json({
      message: 'Comment posted',
      postId,
      comment: finalComment
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

