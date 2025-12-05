const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const { checkCredits } = require('../middleware/credits');

const router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create agent workflow
router.post('/create', checkCredits('chat'), async (req, res, next) => {
  try {
    const { name, description, workflow } = req.body;

    if (!name || !workflow) {
      return res.status(400).json({ error: 'Name and workflow are required' });
    }

    // In production, store agent workflows in database
    const agent = {
      id: `agent_${Date.now()}`,
      name,
      description,
      workflow,
      userId: req.user.id,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({ agent });
  } catch (error) {
    next(error);
  }
});

// Run agent workflow
router.post('/run', checkCredits('chat'), async (req, res, next) => {
  try {
    const { agentId, input } = req.body;

    if (!agentId || !input) {
      return res.status(400).json({ error: 'Agent ID and input are required' });
    }

    // Execute workflow nodes
    // This is a simplified version - in production, implement a proper workflow engine
    const result = {
      agentId,
      input,
      output: 'Agent workflow executed',
      status: 'completed',
      executedAt: new Date().toISOString()
    };

    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// Get workflow nodes
router.get('/nodes', async (req, res, next) => {
  try {
    // Return available workflow node types
    const nodes = [
      {
        type: 'llm',
        name: 'LLM Node',
        description: 'Call OpenAI/Claude/Gemini',
        inputs: ['prompt', 'model'],
        outputs: ['response']
      },
      {
        type: 'condition',
        name: 'Condition Node',
        description: 'Branch based on condition',
        inputs: ['condition'],
        outputs: ['true', 'false']
      },
      {
        type: 'api',
        name: 'API Call Node',
        description: 'Make HTTP request',
        inputs: ['url', 'method', 'headers', 'body'],
        outputs: ['response']
      },
      {
        type: 'data',
        name: 'Data Processing Node',
        description: 'Transform data',
        inputs: ['data', 'transform'],
        outputs: ['result']
      }
    ];

    res.json({ nodes });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

