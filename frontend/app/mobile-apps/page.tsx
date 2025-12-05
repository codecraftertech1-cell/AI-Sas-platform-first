'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { mobileAppApi } from '@/lib/api';
import { Plus, Smartphone, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MobileAppsPage() {
  const [mobileApps, setMobileApps] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState('react-native');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMobileApps();
  }, []);

  const fetchMobileApps = async () => {
    try {
      const response = await mobileAppApi.getAll();
      setMobileApps(response.data.mobileApps);
    } catch (error) {
      toast.error('Failed to load mobile apps');
    }
  };

  const generateApp = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await mobileAppApi.generate({ title, prompt, framework });
      toast.success('Mobile app generated!');
      setShowCreateModal(false);
      setTitle('');
      setPrompt('');
      fetchMobileApps();
      setSelectedApp(response.data.mobileApp);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate app');
    } finally {
      setLoading(false);
    }
  };

  const deleteApp = async (id: string) => {
    try {
      await mobileAppApi.delete(id);
      toast.success('Mobile app deleted');
      fetchMobileApps();
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    } catch (error) {
      toast.error('Failed to delete app');
    }
  };

  const downloadApp = async () => {
    if (!selectedApp) return;
    try {
      const response = await mobileAppApi.download(selectedApp.id);
      const { files } = response.data;
      
      // Use JSZip to create ZIP file
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
      });
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedApp.title}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Mobile app downloaded as ZIP!');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Mobile App Builder</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Plus className="w-5 h-5" />
            Generate App
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apps List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Your Mobile Apps</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {mobileApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedApp?.id === app.id
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Smartphone className="w-5 h-5 text-pink-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{app.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteApp(app.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {mobileApps.length === 0 && (
                <p className="text-center text-gray-500 py-8">No mobile apps yet</p>
              )}
            </div>
          </div>

          {/* App Code Viewer */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedApp ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedApp.title}</h2>
                  <button
                    onClick={downloadApp}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Code
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {(() => {
                      try {
                        const codeData = typeof selectedApp.code === 'string' 
                          ? JSON.parse(selectedApp.code) 
                          : selectedApp.code;
                        return JSON.stringify(codeData, null, 2);
                      } catch (e) {
                        return selectedApp.code || 'No code available';
                      }
                    })()}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Select or generate a mobile app</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Generate Mobile App</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="My Mobile App"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Framework</label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="react-native">React Native</option>
                    <option value="flutter">Flutter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Describe the mobile app you want to create. Include features, design preferences, and functionality..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={generateApp}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate App'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

