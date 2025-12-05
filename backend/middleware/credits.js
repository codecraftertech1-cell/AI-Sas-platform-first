const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Credit costs for different features
const CREDIT_COSTS = {
  chat: 1,
  chat_with_file: 2,
  pdf_upload: 5,
  pdf_chat: 2,
  video_transcribe: 10,
  audio_transcribe: 5,
  presentation_generate: 20,
  website_generate: 30,
  mobile_app_generate: 40,
  email_assistant: 3,
  social_post: 5
};

const checkCredits = (feature) => {
  return async (req, res, next) => {
    try {
      const cost = CREDIT_COSTS[feature] || 1;
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });

      if (user.credits < cost) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: cost,
          available: user.credits
        });
      }

      // Deduct credits
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          credits: { decrement: cost },
          totalCreditsUsed: { increment: cost }
        }
      });

      // Log usage
      await prisma.usageLog.create({
        data: {
          userId: req.user.id,
          feature,
          creditsUsed: cost,
          metadata: { endpoint: req.path }
        }
      });

      req.creditCost = cost;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkCredits, CREDIT_COSTS };

