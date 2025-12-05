'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { presentationApi } from '@/lib/api';
import { Plus, Presentation, Trash2, Download, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await presentationApi.getAll();
      setPresentations(response.data.presentations);
    } catch (error) {
      toast.error('Failed to load presentations');
    }
  };

  const createPresentation = async () => {
    if (!title.trim() || !prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await presentationApi.create({ title, prompt, slideCount });
      toast.success('Presentation created!');
      setShowCreateModal(false);
      setTitle('');
      setPrompt('');
      fetchPresentations();
      setSelectedPresentation(response.data.presentation);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create presentation');
    } finally {
      setLoading(false);
    }
  };

  const deletePresentation = async (id: string) => {
    try {
      await presentationApi.delete(id);
      toast.success('Presentation deleted');
      fetchPresentations();
      if (selectedPresentation?.id === id) {
        setSelectedPresentation(null);
      }
    } catch (error) {
      toast.error('Failed to delete presentation');
    }
  };

  const exportPresentation = async (format: string) => {
    if (!selectedPresentation) return;
    try {
      if (format === 'pptx') {
        // For PPTX, we'll create a JSON file that can be converted using pptxgenjs on frontend
        const exportData = {
          title: selectedPresentation.title,
          slides: selectedPresentation.slides || []
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedPresentation.title}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Presentation data exported! Use pptxgenjs to convert to PPTX.');
      } else if (format === 'pdf') {
        // For PDF, create a text file with presentation content
        let content = `${selectedPresentation.title}\n\n`;
        if (Array.isArray(selectedPresentation.slides)) {
          selectedPresentation.slides.forEach((slide: any, index: number) => {
            content += `Slide ${index + 1}: ${slide.title || 'Untitled'}\n`;
            if (Array.isArray(slide.content)) {
              slide.content.forEach((item: string) => {
                content += `  • ${item}\n`;
              });
            } else {
              content += `  ${slide.content}\n`;
            }
            content += '\n';
          });
        }
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedPresentation.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Presentation exported as text file!');
      } else {
        const response = await presentationApi.export(selectedPresentation.id, format);
        toast.success('Export started');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to export');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Presentations</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Plus className="w-5 h-5" />
            Create Presentation
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Presentations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Your Presentations</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {presentations.map((pres) => (
                <div
                  key={pres.id}
                  onClick={() => setSelectedPresentation(pres)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedPresentation?.id === pres.id
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Presentation className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{pres.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(pres.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePresentation(pres.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {presentations.length === 0 && (
                <p className="text-center text-gray-500 py-8">No presentations yet</p>
              )}
            </div>
          </div>

          {/* Presentation Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedPresentation ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{selectedPresentation.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportPresentation('pptx')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Export PPTX
                    </button>
                    <button
                      onClick={() => exportPresentation('pdf')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {Array.isArray(selectedPresentation.slides) &&
                    selectedPresentation.slides.map((slide: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-3">{slide.title || `Slide ${index + 1}`}</h3>
                        {Array.isArray(slide.content) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {slide.content.map((item: string, i: number) => (
                              <li key={i} className="text-gray-700">{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700">{slide.content}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Presentation className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Select or create a presentation</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Presentation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="My Presentation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Describe what you want in your presentation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Slides</label>
                  <input
                    type="number"
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    min={3}
                    max={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={createPresentation}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
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

