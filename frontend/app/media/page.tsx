'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { mediaApi } from '@/lib/api';
import { Upload, Video, Music, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    // Fetch media files (using documents endpoint for now)
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    // In production, create separate media endpoint
    // For now, filter documents by media type
    try {
      // This would be a separate endpoint in production
      setMediaFiles([]);
    } catch (error) {
      toast.error('Failed to load media files');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isVideo && !isAudio) {
      toast.error('Please upload a video or audio file');
      return;
    }

    setUploading(true);
    try {
      const response = await mediaApi.upload(file);
      toast.success('Media uploaded and transcribed!');
      setSelectedMedia(response.data.media);
      setChatResponse(response.data.transcript);
      fetchMedia();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChat = async () => {
    if (!selectedMedia || !chatMessage.trim()) return;

    try {
      // Handle streaming response similar to document chat
      const response = await mediaApi.chat(selectedMedia.id, chatMessage);
      setChatMessage('');
      toast.success('Response received');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to chat with transcript');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Video/Audio Transcription</h1>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Video or Audio</h2>
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 transition">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {uploading ? 'Uploading and transcribing...' : 'Click to upload video or audio file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Supports: MP4, MP3, WAV, etc.</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="video/*,audio/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {selectedMedia && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedMedia.fileType.startsWith('video/') ? (
                  <Video className="w-8 h-8 text-red-500" />
                ) : (
                  <Music className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <h3 className="font-semibold">{selectedMedia.filename}</h3>
                  <p className="text-sm text-gray-500">{selectedMedia.fileType}</p>
                </div>
              </div>
              {selectedMedia.summary && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Summary:</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedMedia.summary}</p>
                </div>
              )}
            </div>

            {/* Chat with Transcript */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Chat with Transcript</h3>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                {chatResponse ? (
                  <p className="text-sm whitespace-pre-wrap">{chatResponse}</p>
                ) : (
                  <p className="text-sm text-gray-500">Transcript will appear here</p>
                )}
              </div>
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
                  placeholder="Ask a question about the transcript..."
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
          </div>
        )}
      </div>
    </Layout>
  );
}

