import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, Video, Presentation, Globe, Smartphone, Mail, Zap, Star, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Chatbot',
      description: 'ChatGPT-style interface with streaming responses and chat history',
      href: '/chat',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: 'Chat with PDF',
      description: 'Upload documents and ask questions with AI-powered analysis',
      href: '/documents',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Video,
      title: 'Video/Audio Chat',
      description: 'Transcribe and interact with video and audio content',
      href: '/media',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Presentation,
      title: 'AI Presentation Builder',
      description: 'Create professional presentations with AI assistance',
      href: '/presentations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'AI Website Builder',
      description: 'Generate complete websites from simple prompts',
      href: '/websites',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Smartphone,
      title: 'AI Mobile App Builder',
      description: 'Generate React Native and Flutter apps with AI',
      href: '/mobile-apps',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Mail,
      title: 'AI Email Assistant',
      description: 'Smart email management and auto-replies',
      href: '/email',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Zap,
      title: 'Social Media Automation',
      description: 'Automate posting and engagement across platforms',
      href: '/automation',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10K+', icon: Users },
    { label: 'Docs Generated', value: '50K+', icon: TrendingUp },
    { label: 'Average Rating', value: '4.9/5', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            AI SaaS
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/login" className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link href="/register" className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold text-sm sm:text-base">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 text-center overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Complete AI Tools Suite
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional AI SaaS platform with ChatGPT, document processing, presentation builder, 
            website generator, and automation tools all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="px-6 sm:px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold transform hover:scale-105 duration-200 text-center">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="px-6 sm:px-8 py-3 border-2 border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500/10 transition font-semibold text-center">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6 hover:bg-white/10 transition text-center">
                <StatIcon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text mb-2">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">All-in-One AI Platform</h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Everything you need to build, create, and automate with AI
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.href}
                className="group p-6 bg-white/5 backdrop-blur border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300 hover:bg-white/10"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-pink-400 group-hover:bg-clip-text transition">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 group-hover:text-gray-300 transition">
                  {feature.description}
                </p>
                <ArrowRight className="w-5 h-5 text-red-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Why Choose Our Platform?</h2>
            <ul className="space-y-3 sm:space-y-4">
              {[
                'Fast & Easy to Use',
                'No Credit Card Required',
                '24/7 Customer Support',
                'Secure & Reliable',
                'Regular Updates',
                'Affordable Pricing'
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-sm sm:text-base text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-white/10 rounded-2xl p-8 sm:p-10">
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
              <div className="h-4 bg-white/10 rounded-full w-full"></div>
              <div className="h-4 bg-white/10 rounded-full w-5/6"></div>
              <div className="mt-8 h-40 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl p-6 sm:p-8 md:p-12 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-95 max-w-2xl mx-auto">
              Join thousands of users creating amazing content with AI. Start your free trial today!
            </p>
            <Link href="/register" className="inline-block px-8 py-3 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition font-semibold transform hover:scale-105 duration-200">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 md:px-8 py-8 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/chat" className="hover:text-white transition">Chat</Link></li>
              <li><Link href="/documents" className="hover:text-white transition">Documents</Link></li>
              <li><Link href="/presentations" className="hover:text-white transition">Presentations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition">API</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">About</Link></li>
              <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; 2024 AI SaaS Platform. All rights reserved. | Crafted with AI</p>
        </div>
      </footer>
    </div>
  );
}

