'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, MessageSquare, FileText, Presentation, 
  Globe, Smartphone, Settings, LogOut, CreditCard, Users, Video, Mail, Linkedin
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Media', href: '/media', icon: Video },
    { name: 'Presentations', href: '/presentations', icon: Presentation },
    { name: 'Websites', href: '/websites', icon: Globe },
    { name: 'Mobile Apps', href: '/mobile-apps', icon: Smartphone },
    { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
    { name: 'Social Media', href: '/social-media', icon: Globe },
    { name: 'Email', href: '/email', icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            AI SaaS Platform
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-red-50 text-red-500 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
          <Link
            href="/pricing"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <CreditCard className="w-5 h-5" />
            Pricing
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              <Users className="w-5 h-5" />
              Admin
            </Link>
          )}
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {navigation.find(nav => pathname === nav.href || pathname?.startsWith(nav.href + '/'))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">
                {user?.subscriptionPlan} Plan • {user?.credits} credits
              </p>
            </div>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0] || user?.email[0].toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

