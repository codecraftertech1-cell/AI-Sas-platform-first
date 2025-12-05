'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { emailApi } from '@/lib/api';
import { Mail, Sparkles, Lightbulb, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EmailPage() {
  const [connected, setConnected] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = (provider: string) => {
    // In production, redirect to OAuth
    toast.info(`${provider} OAuth integration required`);
    setConnected(true);
  };

  const generateReply = async () => {
    if (!originalEmail.trim()) {
      toast.error('Please enter the original email');
      return;
    }

    setLoading(true);
    try {
      const response = await emailApi.generateReply({
        originalEmail,
        tone
      });
      setGeneratedReply(response.data.reply);
      toast.success('Reply generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate reply');
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    if (!emailContent.trim()) {
      toast.error('Please enter email content');
      return;
    }

    setLoading(true);
    try {
      const response = await emailApi.getSuggestions({
        emailContent,
        context: 'General business email'
      });
      setSuggestions(response.data.suggestions);
      toast.success('Suggestions generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to get suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Email Assistant</h1>
          {!connected && (
            <div className="flex gap-2">
              <button
                onClick={() => handleConnect('Gmail')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Connect Gmail
              </button>
              <button
                onClick={() => handleConnect('Outlook')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Connect Outlook
              </button>
            </div>
          )}
        </div>

        {connected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">✓ Email account connected</p>
          </div>
        )}

        {/* AI Reply Generator */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">AI Reply Generator</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Original Email</label>
              <textarea
                value={originalEmail}
                onChange={(e) => setOriginalEmail(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Paste the email you want to reply to..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            <button
              onClick={generateReply}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Reply'}
            </button>
            {generatedReply && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{generatedReply}</p>
                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  Use as Draft
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Suggestions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">Smart Email Suggestions</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Email Content</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter your email draft to get AI suggestions..."
              />
            </div>
            <button
              onClick={getSuggestions}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Suggestions'}
            </button>
            {suggestions && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{suggestions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Inbox */}
        {connected && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Inbox</h2>
            <p className="text-gray-600">No emails to display</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

