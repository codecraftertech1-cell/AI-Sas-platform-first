'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { linkedinApi } from '@/lib/api';
import { Linkedin, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LinkedInPage() {
  const [connected, setConnected] = useState(false);
  const [postTopic, setPostTopic] = useState('');
  const [postTone, setPostTone] = useState('professional');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await linkedinApi.login();
      if (response.data.authUrl) {
        // Redirect to LinkedIn OAuth
        window.location.href = response.data.authUrl;
      } else {
        setConnected(true);
        toast.success('LinkedIn connected successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to connect LinkedIn');
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async () => {
    if (!postTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await linkedinApi.generatePost({
        topic: postTopic,
        tone: postTone
      });
      setGeneratedPost(response.data.post);
      toast.success('Post generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">LinkedIn Automation</h1>
          {!connected && (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Linkedin className="w-5 h-5" />
              Connect LinkedIn
            </button>
          )}
        </div>

        {connected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">✓ LinkedIn Connected</p>
          </div>
        )}

        {/* AI Post Generator */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">AI Post Generator</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={postTopic}
                onChange={(e) => setPostTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="What should the post be about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={postTone}
                onChange={(e) => setPostTone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
            <button
              onClick={generatePost}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Post'}
            </button>
            {generatedPost && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{generatedPost}</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Post to LinkedIn
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Auto Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">Auto Message</h2>
          </div>
          <p className="text-gray-600 mb-4">Send automated messages to LinkedIn connections</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Configure Auto Messages
          </button>
        </div>

        {/* Scheduling */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">Post Scheduling</h2>
          </div>
          <p className="text-gray-600 mb-4">Schedule your LinkedIn posts for optimal engagement</p>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            View Scheduled Posts
          </button>
        </div>
      </div>
    </Layout>
  );
}

