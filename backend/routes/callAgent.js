const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Start AI call
router.post('/start', checkCredits('chat'), async (req, res, next) => {
  try {
    const { phoneNumber, purpose } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // In production, integrate with Twilio Voice API
    // For now, return a mock call session
    const callSession = {
      id: `call_${Date.now()}`,
      phoneNumber,
      status: 'initiated',
      createdAt: new Date().toISOString()
    };

    // TODO: Integrate with Twilio
    // const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // const call = await twilio.calls.create({
    //   to: phoneNumber,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   url: `${process.env.API_URL}/api/call/webhook`
    // });

    res.json({ callSession });
  } catch (error) {
    next(error);
  }
});

// Auto-dial numbers
router.post('/auto-dial', checkCredits('chat'), async (req, res, next) => {
  try {
    const { phoneNumbers, message } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
      return res.status(400).json({ error: 'Phone numbers array is required' });
    }

    // TODO: Integrate with Twilio for bulk dialing
    const results = phoneNumbers.map(phone => ({
      phoneNumber: phone,
      status: 'queued',
      callId: `call_${Date.now()}_${Math.random()}`
    }));

    res.json({ results, message: 'Calls queued for dialing' });
  } catch (error) {
    next(error);
  }
});

// Get call transcript
router.get('/transcript/:callId', async (req, res, next) => {
  try {
    const { callId } = req.params;

    // In production, fetch from Twilio or database
    // For now, return mock data
    const transcript = {
      callId,
      duration: 120,
      transcript: 'Mock transcript - integrate with Twilio Voice API',
      summary: 'Mock call summary',
      createdAt: new Date().toISOString()
    };

    res.json({ transcript });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

