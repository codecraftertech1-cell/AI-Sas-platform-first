'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { documentApi } from '@/lib/api';
import { Upload, FileText, MessageSquare, Trash2, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getAll();
      setDocuments(response.data.documents);
    } catch (error) {
      toast.error('Failed to load documents');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentApi.upload(file);
      toast.success('Document uploaded successfully!');
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChat = async () => {
    if (!selectedDoc || !chatMessage.trim()) return;

    const message = chatMessage;
    setChatMessage('');
    setChatResponse('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/documents/${selectedDoc.id}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle SSE streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullResponse += data.content;
                  setChatResponse(fullResponse);
                }
                if (data.done) {
                  break;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to chat with document');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await documentApi.delete(id);
      toast.success('Document deleted');
      fetchDocuments();
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload PDF, DOCX, or TXT'}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Your Documents</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedDoc?.id === doc.id
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.filename}</p>
                        {doc.summary && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {doc.summary}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-center text-gray-500 py-8">No documents yet</p>
              )}
            </div>
          </div>

          {/* Document Chat */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedDoc ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedDoc.filename}</h3>
                    {selectedDoc.summary && (
                      <p className="text-sm text-gray-600 mt-1">{selectedDoc.summary}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedDoc.fileType === 'application/pdf' && (
                      <button
                        onClick={() => setShowPdfViewer(!showPdfViewer)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title={showPdfViewer ? "Hide PDF" : "View PDF"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/documents/${selectedDoc.id}/export`,
                            {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({ format: 'summary' }),
                            }
                          );
                          if (!response.ok) throw new Error('Export failed');
                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedDoc.filename}-summary.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success('Summary exported!');
                        } catch (error) {
                          toast.error('Failed to export');
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Export Summary"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  {showPdfViewer && selectedDoc.fileType === 'application/pdf' ? (
                    <div className="h-full">
                      <iframe
                        src={selectedDoc.fileUrl}
                        className="w-full h-full border border-gray-200 rounded-lg"
                        title="PDF Viewer"
                      />
                    </div>
                  ) : (
                    <>
                      {chatResponse && (
                        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                          <p className="whitespace-pre-wrap">{chatResponse}</p>
                        </div>
                      )}
                      {!chatResponse && (
                        <div className="text-center text-gray-500 py-12">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>Ask questions about this document</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleChat();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask a question about this document..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Select a document to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

