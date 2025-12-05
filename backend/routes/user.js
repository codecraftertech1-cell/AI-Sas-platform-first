const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        subscriptionPlan: true,
        credits: true,
        totalCreditsUsed: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.patch('/profile', async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        subscriptionPlan: true,
        credits: true
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Get usage statistics
router.get('/usage', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { userId: req.user.id };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [totalUsage, usageByFeature, recentLogs] = await Promise.all([
      prisma.usageLog.aggregate({
        where,
        _sum: { creditsUsed: true },
        _count: true
      }),
      prisma.usageLog.groupBy({
        by: ['feature'],
        where,
        _sum: { creditsUsed: true },
        _count: true
      }),
      prisma.usageLog.findMany({
        where,
        take: 20,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      totalCreditsUsed: totalUsage._sum.creditsUsed || 0,
      totalRequests: totalUsage._count || 0,
      usageByFeature,
      recentLogs
    });
  } catch (error) {
    next(error);
  }
});

// Get dashboard stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionPlan: true,
        credits: true,
        role: true,
        createdAt: true,
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

    const recentUsage = await prisma.usageLog.findMany({
      where: { userId: req.user.id },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
        credits: user.credits
      },
      counts: user._count || {
        chats: 0,
        documents: 0,
        presentations: 0,
        websites: 0,
        mobileApps: 0
      },
      recentUsage
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

