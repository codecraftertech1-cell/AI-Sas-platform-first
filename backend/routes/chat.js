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
    console.log('✅ OpenAI client initialized');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI:', error.message);
}

// Chat completions (OpenAI-style API)
router.post('/completions', checkCredits('chat'), async (req, res, next) => {
  try {
    const { messages, model = 'gpt-4-turbo-preview', temperature = 0.7 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature
    });

    res.json({
      id: response.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: response.model,
      choices: response.choices,
      usage: response.usage
    });
  } catch (error) {
    next(error);
  }
});

// Chat stream endpoint
router.get('/stream', checkCredits('chat'), async (req, res, next) => {
  try {
    const { messages, model = 'gpt-4-turbo-preview' } = req.query;

    if (!messages) {
      return res.status(400).json({ error: 'Messages parameter is required' });
    }

    const parsedMessages = JSON.parse(messages);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await openai.chat.completions.create({
        model,
        messages: parsedMessages,
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

// Generate embeddings
router.post('/embeddings', checkCredits('chat'), async (req, res, next) => {
  try {
    const { input, model = 'text-embedding-3-small' } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const response = await openai.embeddings.create({
      model,
      input: Array.isArray(input) ? input : [input]
    });

    res.json({
      object: 'list',
      data: response.data,
      model: response.model,
      usage: response.usage
    });
  } catch (error) {
    next(error);
  }
});

// Chats endpoints (aliases for compatibility)
router.post('/chats/create', async (req, res, next) => {
  try {
    const { title, initialMessage } = req.body;

    // If initialMessage is provided, check credits before creating with message
    if (initialMessage) {
      const cost = 1; // Cost for the initial message
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (user.credits < cost) {
        return res.status(402).json({
          error: 'Insufficient credits to send initial message',
          required: cost,
          available: user.credits
        });
      }
    }

    const messages = initialMessage ? [
      { role: 'user', content: initialMessage },
      { role: 'assistant', content: 'Hello! How can I help you today?' }
    ] : [];

    const chat = await prisma.chat.create({
      data: {
        userId: req.user.id,
        title: title || 'New Chat',
        messages
      }
    });

    // Deduct credits only if initial message was sent
    if (initialMessage) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          credits: { decrement: 1 },
          totalCreditsUsed: { increment: 1 }
        }
      });

      await prisma.usageLog.create({
        data: {
          userId: req.user.id,
          feature: 'chat',
          creditsUsed: 1,
          metadata: { endpoint: '/chat/chats/create', action: 'initial_message' }
        }
      });
    }

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Chat creation error:', error);
    next(error);
  }
});

router.get('/chats/history', async (req, res, next) => {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        messages: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ chats });
  } catch (error) {
    next(error);
  }
});

router.delete('/chats/delete/:id', async (req, res, next) => {
  try {
    await prisma.chat.delete({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Chat deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/chats/download/:id', async (req, res, next) => {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Format chat as text
    let transcript = `Chat: ${chat.title}\n`;
    transcript += `Created: ${new Date(chat.createdAt).toLocaleString()}\n\n`;
    transcript += 'Messages:\n';
    transcript += '='.repeat(50) + '\n\n';

    const messages = Array.isArray(chat.messages) ? chat.messages : [];
    messages.forEach((msg, index) => {
      transcript += `${index + 1}. [${msg.role.toUpperCase()}]\n`;
      transcript += `${msg.content}\n\n`;
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="chat-${chat.id}.txt"`);
    res.send(transcript);
  } catch (error) {
    next(error);
  }
});

// Get all chats for user
router.get('/', async (req, res, next) => {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ chats });
  } catch (error) {
    next(error);
  }
});

// Get single chat
router.get('/:id', async (req, res, next) => {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    next(error);
  }
});

// Create new chat (no credit check - only message sending costs credits)
router.post('/', async (req, res, next) => {
  try {
    const { title, initialMessage } = req.body;

    // If initialMessage is provided, check credits before creating with message
    if (initialMessage) {
      const cost = 1; // Cost for the initial message
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.credits < cost) {
        return res.status(402).json({
          error: 'Insufficient credits to send initial message',
          required: cost,
          available: user.credits
        });
      }
    }

    const messages = initialMessage ? [
      { role: 'user', content: initialMessage },
      { role: 'assistant', content: 'Hello! How can I help you today?' }
    ] : [];

    const chat = await prisma.chat.create({
      data: {
        userId: req.user.id,
        title: title || 'New Chat',
        messages
      }
    });

    // Deduct credits only if initial message was sent
    if (initialMessage) {
      try {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            credits: { decrement: 1 },
            totalCreditsUsed: { increment: 1 }
          }
        });

        await prisma.usageLog.create({
          data: {
            userId: req.user.id,
            feature: 'chat',
            creditsUsed: 1,
            metadata: { endpoint: '/chat', action: 'initial_message' }
          }
        });
      } catch (creditError) {
        console.error('Error updating credits:', creditError);
        // Don't fail the chat creation if credit update fails
      }
    }

    res.status(201).json({ chat });
  } catch (error) {
    console.error('Chat creation error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Chat with this title already exists' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    next(error);
  }
});

// Share chat
router.post('/:id/share', async (req, res, next) => {
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Generate shareable link
    const shareUrl = `${process.env.FRONTEND_URL}/chat/${chat.id}?shared=true`;

    res.json({
      shareUrl,
      message: 'Share link generated'
    });
  } catch (error) {
    next(error);
  }
});

// Send message (streaming response)
router.post('/:id/message', checkCredits('chat'), async (req, res, next) => {
  try {
    const { message, fileData, fileUrl } = req.body;
    const chatId = req.params.id;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: req.user.id
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = Array.isArray(chat.messages) ? chat.messages : [];
    messages.push({ role: 'user', content: message });

    // Prepare OpenAI messages
    const openaiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add file context if provided
    if (fileData) {
      openaiMessages[openaiMessages.length - 1].content = [
        { type: 'text', text: message },
        ...fileData
      ];
    }

    // Set up streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    try {
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY || !openai) {
        throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in backend/.env file');
      }

      const stream = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: openaiMessages,
        stream: true,
        temperature: 0.7
      }).catch((apiError) => {
        // Handle OpenAI API errors specifically
        if (apiError.status === 401 || apiError.code === 'invalid_api_key') {
          console.error('❌ OpenAI API Key Error:', apiError.message);
          throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in backend/.env file. Get a valid key from https://platform.openai.com/account/api-keys');
        }
        if (apiError.status === 429) {
          const errorMsg = apiError.message || '';
          if (errorMsg.includes('quota') || errorMsg.includes('billing') || errorMsg.includes('insufficient')) {
            throw new Error('OpenAI API quota exceeded or insufficient credits. Please add credits at https://platform.openai.com/account/billing');
          }
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
        if (apiError.status === 402 || apiError.code === 'insufficient_quota') {
          throw new Error('OpenAI API insufficient quota. Please add credits to your account at https://platform.openai.com/account/billing');
        }
        if (apiError.status === 500 || apiError.status === 503) {
          throw new Error('OpenAI API service is temporarily unavailable. Please try again later.');
        }
        throw apiError;
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
        }
      }

      // Save the complete response
      messages.push({ role: 'assistant', content: fullResponse });

      await prisma.chat.update({
        where: { id: chatId },
        data: {
          messages,
          updatedAt: new Date()
        }
      });

      res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      const errorMessage = error.message || 'Failed to get AI response';
      res.write(`data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`);
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

// Update chat title
router.patch('/:id/title', async (req, res, next) => {
  try {
    const { title } = req.body;

    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: { title }
    });

    res.json({ chat });
  } catch (error) {
    next(error);
  }
});

// Delete chat
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.chat.delete({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    res.json({ message: 'Chat deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

