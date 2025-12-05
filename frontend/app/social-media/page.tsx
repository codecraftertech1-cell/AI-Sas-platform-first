'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { socialMediaApi } from '@/lib/api';
import { Instagram, Facebook, Linkedin, Music, MapPin, Sparkles, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SocialMediaPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('friendly');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'bg-black' },
    { id: 'twitter', name: 'Twitter/X', icon: Sparkles, color: 'bg-blue-400' },
    { id: 'gmb', name: 'Google My Business', icon: MapPin, color: 'bg-green-600' },
  ];

  const generatePost = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await socialMediaApi.generate({
        topic,
        platform,
        tone,
        includeHashtags
      });
      setGeneratedPost(response.data);
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
        <h1 className="text-2xl font-bold">Social Media Auto Posting</h1>

        {/* Post Generator */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">AI Post Generator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="What should the post be about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-3 rounded-lg border-2 transition ${
                        platform === p.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${platform === p.id ? 'text-red-500' : 'text-gray-400'}`} />
                      <p className="text-xs mt-1">{p.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="funny">Funny</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hashtags"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
              />
              <label htmlFor="hashtags" className="text-sm">Include hashtags</label>
            </div>

            <button
              onClick={generatePost}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Post'}
            </button>
          </div>
        </div>

        {/* Generated Post */}
        {generatedPost && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Generated Post</h3>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="whitespace-pre-wrap">{generatedPost.post}</p>
            </div>
            {generatedPost.hashtags && generatedPost.hashtags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {generatedPost.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Post Now
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
            </div>
          </div>
        )}

        {/* Scheduled Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
          <p className="text-gray-600">No scheduled posts</p>
        </div>
      </div>
    </Layout>
  );
}

