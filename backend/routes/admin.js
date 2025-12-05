const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require admin
router.use(requireAdmin);

// Get all users
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          subscriptionPlan: true,
          subscriptionStatus: true,
          credits: true,
          totalCreditsUsed: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: {
            chats: true,
            documents: true,
            presentations: true,
            websites: true,
            mobileApps: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user
router.patch('/users/:id', async (req, res, next) => {
  try {
    const { credits, subscriptionPlan, subscriptionStatus, role } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(credits !== undefined && { credits }),
        ...(subscriptionPlan && { subscriptionPlan }),
        ...(subscriptionStatus && { subscriptionStatus }),
        ...(role && { role })
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/users/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// Get analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [totalUsers, totalUsage, usageByFeature, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.usageLog.count({ where }),
      prisma.usageLog.groupBy({
        by: ['feature'],
        where,
        _sum: { creditsUsed: true },
        _count: true
      }),
      prisma.invoice.aggregate({
        where: {
          ...where,
          status: 'paid'
        },
        _sum: { amount: true }
      })
    ]);

    res.json({
      totalUsers,
      totalUsage,
      usageByFeature,
      revenue: revenue._sum.amount || 0
    });
  } catch (error) {
    next(error);
  }
});

// Get usage logs
router.get('/usage-logs', async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId, feature } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (userId) where.userId = userId;
    if (feature) where.feature = feature;

    const logs = await prisma.usageLog.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ logs });
  } catch (error) {
    next(error);
  }
});

// API Keys Management (for admin to configure AI models)
router.get('/api-keys', async (req, res, next) => {
  try {
    // In production, store API keys securely
    res.json({
      openai: process.env.OPENAI_API_KEY ? '***configured***' : 'not set',
      models: ['gpt-4-turbo-preview', 'gpt-3.5-turbo', 'gpt-4']
    });
  } catch (error) {
    next(error);
  }
});

// Model Selection
router.post('/model-selection', async (req, res, next) => {
  try {
    const { model } = req.body;
    // In production, save model preference per user or globally
    res.json({ message: 'Model selection updated', model });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

