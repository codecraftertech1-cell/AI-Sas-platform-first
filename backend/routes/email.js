const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Connect Gmail/Outlook
router.post('/connect', async (req, res, next) => {
  try {
    const { provider, accessToken, refreshToken } = req.body;

    if (!['gmail', 'outlook'].includes(provider.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid provider. Use gmail or outlook' });
    }

    // Store connection (would need EmailConnection model)
    // For now, return success
    res.json({
      message: `${provider} connected successfully`,
      provider
    });
  } catch (error) {
    next(error);
  }
});

// Draft email
router.post('/draft', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { to, subject, context, tone } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: 'To and subject are required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an email assistant. Create a ${tone || 'professional'} email draft.`
        },
        {
          role: 'user',
          content: `Draft an email to ${to} with subject: ${subject}. Context: ${context || 'General business email'}`
        }
      ],
      temperature: 0.7
    });

    const draft = response.choices[0].message.content;

    res.json({ draft, to, subject });
  } catch (error) {
    next(error);
  }
});

// Auto-reply email
router.post('/auto-reply', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { originalEmail, tone } = req.body;

    if (!originalEmail) {
      return res.status(400).json({ error: 'Original email is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an email assistant. Generate a ${tone || 'professional'} auto-reply.`
        },
        {
          role: 'user',
          content: `Generate an auto-reply to:\n\n${originalEmail}`
        }
      ],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;

    // TODO: Send via Gmail/Outlook API
    res.json({ reply, sent: false, message: 'Auto-reply generated. Integrate with email API to send.' });
  } catch (error) {
    next(error);
  }
});

// Send email
router.post('/send', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { to, subject, body, provider = 'gmail' } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    // TODO: Integrate with Gmail/Outlook API to send email
    res.json({
      to,
      subject,
      status: 'sent',
      message: 'Email sent successfully (mock - integrate with email API)'
    });
  } catch (error) {
    next(error);
  }
});

// Send bulk email campaign
router.post('/email-marketing/send-bulk', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { recipients, subject, body, provider = 'gmail' } = req.body;

    if (!recipients || !Array.isArray(recipients) || !subject || !body) {
      return res.status(400).json({ error: 'Recipients array, subject, and body are required' });
    }

    // TODO: Integrate with email marketing API
    const results = recipients.map(email => ({
      email,
      status: 'sent',
      messageId: `msg_${Date.now()}_${Math.random()}`
    }));

    res.json({
      results,
      total: recipients.length,
      message: 'Bulk email campaign sent (mock - integrate with email API)'
    });
  } catch (error) {
    next(error);
  }
});

// Generate AI reply draft (alias)
router.post('/generate-reply', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { originalEmail, tone, length } = req.body;

    const tonePrompts = {
      professional: 'Write a professional, formal email reply',
      friendly: 'Write a friendly, casual email reply',
      concise: 'Write a brief, to-the-point email reply',
      detailed: 'Write a comprehensive, detailed email reply'
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an email assistant. ${tonePrompts[tone] || tonePrompts.professional}.`
        },
        {
          role: 'user',
          content: `Generate a ${tone || 'professional'} email reply to:\n\n${originalEmail}\n\nLength: ${length || 'medium'}`
        }
      ],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;

    res.json({ reply, tone });
  } catch (error) {
    next(error);
  }
});

// Smart email suggestions
router.post('/suggestions', checkCredits('email_assistant'), async (req, res, next) => {
  try {
    const { emailContent, context } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an email assistant that provides suggestions for improving emails.'
        },
        {
          role: 'user',
          content: `Review this email and provide suggestions for improvement:\n\n${emailContent}\n\nContext: ${context || 'General business email'}`
        }
      ],
      temperature: 0.7
    });

    const suggestions = response.choices[0].message.content;

    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
});

// Get email inbox (mock)
router.get('/inbox', async (req, res, next) => {
  try {
    // In production, fetch from Gmail/Outlook API
    res.json({ emails: [] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

