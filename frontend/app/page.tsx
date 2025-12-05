import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, Video, Presentation, Globe, Smartphone, Mail, Zap } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Chatbot',
      description: 'ChatGPT-style interface with streaming responses and chat history',
      href: '/chat'
    },
    {
      icon: FileText,
      title: 'Chat with PDF',
      description: 'Upload documents and ask questions with AI-powered analysis',
      href: '/documents'
    },
    {
      icon: Video,
      title: 'Video/Audio Chat',
      description: 'Transcribe and interact with video and audio content',
      href: '/media'
    },
    {
      icon: Presentation,
      title: 'AI Presentation Builder',
      description: 'Create professional presentations with AI assistance',
      href: '/presentations'
    },
    {
      icon: Globe,
      title: 'AI Website Builder',
      description: 'Generate complete websites from simple prompts',
      href: '/websites'
    },
    {
      icon: Smartphone,
      title: 'AI Mobile App Builder',
      description: 'Generate React Native and Flutter apps with AI',
      href: '/mobile-apps'
    },
    {
      icon: Mail,
      title: 'AI Email Assistant',
      description: 'Smart email management and auto-replies',
      href: '/email'
    },
    {
      icon: Zap,
      title: 'Social Media Automation',
      description: 'Automate posting and engagement across platforms',
      href: '/automation'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            AI SaaS Platform
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Complete AI Tools Suite
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Professional AI SaaS platform with ChatGPT, document processing, presentation builder, 
          website generator, and automation tools all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg font-semibold">
            Start Free Trial
          </Link>
          <Link href="/pricing" className="px-8 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-lg font-semibold">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">All-in-One AI Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.href}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 hover:border-red-200 group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition">
                  <Icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                <ArrowRight className="w-5 h-5 text-red-500 mt-4 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users creating amazing content with AI
          </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition font-semibold">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 AI SaaS Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

