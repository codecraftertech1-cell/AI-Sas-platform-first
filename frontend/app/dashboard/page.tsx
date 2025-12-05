'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/lib/auth-context';
import { userApi } from '@/lib/api';
import { MessageSquare, FileText, Presentation, Globe, Smartphone, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // If no user after auth loads, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch dashboard data once if user exists
    if (user && !hasFetched) {
      fetchDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    if (hasFetched) return; // Prevent duplicate calls
    
    setHasFetched(true);
    setLoading(true);
    
    try {
      const response = await userApi.getDashboard();
      setStats(response.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Set default stats if API fails - dashboard will still show
      setStats({
        counts: {
          chats: 0,
          documents: 0,
          presentations: 0,
          websites: 0,
          mobileApps: 0
        },
        recentUsage: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading only if auth is still loading
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Show dashboard even if stats haven't loaded yet (with default values)
  const displayStats = stats || {
    counts: {
      chats: 0,
      documents: 0,
      presentations: 0,
      websites: 0,
      mobileApps: 0
    },
    recentUsage: []
  };

  const quickActions = [
    { name: 'New Chat', icon: MessageSquare, href: '/chat', color: 'bg-red-500' },
    { name: 'Upload Document', icon: FileText, href: '/documents', color: 'bg-green-500' },
    { name: 'Create Presentation', icon: Presentation, href: '/presentations', color: 'bg-purple-500' },
    { name: 'Build Website', icon: Globe, href: '/websites', color: 'bg-orange-500' },
    { name: 'Generate App', icon: Smartphone, href: '/mobile-apps', color: 'bg-pink-500' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-red-100">You have {user?.credits || 0} credits remaining</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Credits</p>
                <p className="text-2xl font-bold mt-1">{user?.credits || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chats</p>
                <p className="text-2xl font-bold mt-1">{displayStats.counts.chats || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Documents</p>
                <p className="text-2xl font-bold mt-1">{displayStats.counts.documents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Projects</p>
                <p className="text-2xl font-bold mt-1">
                  {(displayStats.counts.presentations || 0) + (displayStats.counts.websites || 0) + (displayStats.counts.mobileApps || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Presentation className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className={`${action.color} text-white p-6 rounded-lg hover:opacity-90 transition transform hover:scale-105`}
                >
                  <Icon className="w-8 h-8 mb-2 mx-auto" />
                  <p className="font-semibold">{action.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {displayStats.recentUsage && displayStats.recentUsage.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayStats.recentUsage.map((usage: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {usage.feature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usage.creditsUsed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usage.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

