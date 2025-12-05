'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { subscriptionApi } from '@/lib/api';
import { Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const plans = [
  {
    name: 'Free',
    price: 0,
    credits: 100,
    features: [
      'Basic AI Chat',
      'Limited usage',
      'Community support',
      '5 documents/month',
      'Basic templates'
    ]
  },
  {
    name: 'Paid',
    price: 9.99,
    credits: 1000,
    features: [
      'All chat features',
      'PDF/Document chat',
      'Presentation builder',
      'Website generator',
      'Email support',
      'Unlimited documents',
      'Advanced templates'
    ]
  },
  {
    name: 'Pro',
    price: 29.99,
    credits: 5000,
    features: [
      'Everything in Paid',
      'Mobile app builder',
      'Social media automation',
      'LinkedIn automation',
      'AI email assistant',
      'API access',
      'Priority support',
      'Custom integrations'
    ]
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (plan === 'FREE') {
      toast.info('You are already on the Free plan');
      return;
    }

    setLoading(plan);
    try {
      const response = await subscriptionApi.checkout(plan);
      const stripe = await stripePromise;
      if (stripe && response.data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg p-8 ${
                index === 1 ? 'border-2 border-red-500 scale-105' : 'border border-gray-200'
              }`}
            >
              {index === 1 && (
                <div className="bg-red-500 text-white text-center py-2 rounded-lg mb-4 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-500 ml-2">/month</span>}
                </div>
                <p className="text-gray-600 mt-2">{plan.credits} credits/month</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name.toUpperCase())}
                disabled={loading === plan.name.toUpperCase()}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  index === 1
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {loading === plan.name.toUpperCase() ? 'Processing...' : plan.price === 0 ? 'Current Plan' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">All plans include:</p>
          <div className="flex items-center justify-center gap-2 text-red-500">
            <Zap className="w-5 h-5" />
            <span>99.9% Uptime</span>
            <span className="mx-2">•</span>
            <span>Secure & Encrypted</span>
            <span className="mx-2">•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

