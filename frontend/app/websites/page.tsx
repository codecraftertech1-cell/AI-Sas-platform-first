'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { websiteApi } from '@/lib/api';
import { Plus, Globe, Trash2, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await websiteApi.getAll();
      setWebsites(response.data.websites);
    } catch (error) {
      toast.error('Failed to load websites');
    }
  };

  const generateWebsite = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await websiteApi.generateCode({ title, prompt });
      toast.success('Website generated!');
      setShowCreateModal(false);
      setTitle('');
      setPrompt('');
      fetchWebsites();
      setSelectedWebsite(response.data.website);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      await websiteApi.delete(id);
      toast.success('Website deleted');
      fetchWebsites();
      if (selectedWebsite?.id === id) {
        setSelectedWebsite(null);
      }
    } catch (error) {
      toast.error('Failed to delete website');
    }
  };

  const downloadWebsite = async () => {
    if (!selectedWebsite) return;
    try {
      const response = await websiteApi.download(selectedWebsite.id);
      const { files } = response.data;
      
      // Use JSZip to create ZIP file
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content as string);
      });
      
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedWebsite.title}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Website downloaded as ZIP!');
    } catch (error) {
      // Fallback to HTML download
      const blob = new Blob([selectedWebsite.code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedWebsite.title}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Plus className="w-5 h-5" />
            Generate Website
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Websites List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Your Websites</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {websites.map((website) => (
                <div
                  key={website.id}
                  onClick={() => setSelectedWebsite(website)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedWebsite?.id === website.id
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Globe className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{website.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(website.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWebsite(website.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {websites.length === 0 && (
                <p className="text-center text-gray-500 py-8">No websites yet</p>
              )}
            </div>
          </div>

          {/* Website Preview/Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedWebsite ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedWebsite.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadWebsite}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => {
                        const newWindow = window.open();
                        if (newWindow) {
                          newWindow.document.write(selectedWebsite.code || '<html><body>No code available</body></html>');
                          newWindow.document.close();
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                  {selectedWebsite.code ? (
                    <iframe
                      srcDoc={selectedWebsite.code}
                      className="w-full h-full min-h-[600px] border border-gray-200 rounded-lg"
                      title="Website Preview"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <p>No code available for preview</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Select or generate a website</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Generate Website</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="My Website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Describe the website you want to create. Be specific about the design, features, and content..."
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={generateWebsite}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Website'}
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

