const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Subscription plans
const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    credits: 100,
    features: ['Basic chat', 'Limited usage']
  },
  PAID: {
    name: 'Paid',
    price: 9.99,
    credits: 1000,
    features: ['All chat features', 'PDF chat', 'Templates']
  },
  PRO: {
    name: 'Pro',
    price: 29.99,
    credits: 5000,
    features: ['All features', 'Automation', 'API access', 'Priority support']
  }
};

// Get current subscription
router.get('/', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        credits: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true
      }
    });

    res.json({
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      credits: user.credits,
      planDetails: PLANS[user.subscriptionPlan]
    });
  } catch (error) {
    next(error);
  }
});

// Create checkout session
router.post('/checkout', async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan] || plan === 'FREE') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    let customerId = req.user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user.id }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: req.user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${PLANS[plan].name} Plan`,
              description: PLANS[plan].features.join(', ')
            },
            unit_amount: Math.round(PLANS[plan].price * 100),
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: req.user.id,
        plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    next(error);
  }
});

// Webhook handler (should be in separate route for Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.userId;
      const plan = session.metadata.plan;

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: plan,
          subscriptionStatus: 'ACTIVE',
          credits: { increment: PLANS[plan].credits },
          stripeSubscriptionId: session.subscription
        }
      });

      // Create invoice record
      await prisma.invoice.create({
        data: {
          userId,
          stripeInvoiceId: session.invoice,
          amount: PLANS[plan].price,
          status: 'paid',
          plan
        }
      });
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionPlan: 'FREE',
            subscriptionStatus: 'CANCELLED',
            stripeSubscriptionId: null
          }
        });
      }
      break;
  }

  res.json({ received: true });
});

// Get invoices
router.get('/invoices', async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ invoices });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

