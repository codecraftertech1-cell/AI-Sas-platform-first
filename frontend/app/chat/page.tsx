'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/lib/auth-context';
import { chatApi } from '@/lib/api';
import { Send, Plus, Trash2, Download, Share2, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchChat();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await chatApi.getAll();
      setChats(response.data.chats);
      if (response.data.chats.length > 0 && !selectedChat) {
        setSelectedChat(response.data.chats[0]);
      }
    } catch (error) {
      toast.error('Failed to load chats');
    }
  };

  const fetchChat = async () => {
    if (!selectedChat) return;
    try {
      const response = await chatApi.getOne(selectedChat.id);
      const chatMessages = Array.isArray(response.data.chat.messages) 
        ? response.data.chat.messages 
        : [];
      setMessages(chatMessages);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const createNewChat = async () => {
    try {
      const response = await chatApi.create({ title: 'New Chat' });
      const newChat = response.data.chat;
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
      setMessages([]);
    } catch (error: any) {
      console.error('Chat creation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create chat';
      
      // Show specific error messages
      if (error.response?.status === 402) {
        toast.error(`Insufficient credits. You need ${error.response.data.required} credits but have ${error.response.data.available}.`);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || loading) return;

    const userMessage = { role: 'user', content: input, ...(selectedFile && { file: selectedFile.name }) };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    const currentFile = selectedFile;
    setInput('');
    setSelectedFile(null);
    setLoading(true);
    setStreaming(true);

    try {
      const token = localStorage.getItem('token');
      // If file attached, upload it first
      let fileUrl = null;
      if (currentFile) {
        const formData = new FormData();
        formData.append('file', currentFile);
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/documents/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.document.fileUrl;
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/chat/${selectedChat.id}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: currentInput, fileUrl }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle SSE streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

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
                if (data.error) {
                  // Handle error from backend
                  toast.error(data.error);
                  setMessages((prev) => prev.slice(0, -1)); // Remove assistant message
                  setStreaming(false);
                  break;
                }
                if (data.content) {
                  assistantMessage.content += data.content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...assistantMessage };
                    return newMessages;
                  });
                }
                if (data.done) {
                  setStreaming(false);
                }
              } catch (e) {
                // Ignore parse errors
                console.error('Parse error:', e);
              }
            }
          }
        }
      } else {
        // If no reader, try to get error from response
        const errorData = await response.text();
        try {
          const errorJson = JSON.parse(errorData);
          throw new Error(errorJson.error || 'Failed to get response');
        } catch (e) {
          throw new Error('Failed to read response stream');
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error.message || 'Failed to send message';
      toast.error(errorMessage);
      setMessages((prev) => {
        // Remove the last user message and any assistant message
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages.pop();
        }
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'user') {
          newMessages.pop();
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
      fetchChat(); // Refresh to get saved messages
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatApi.delete(chatId);
      setChats(chats.filter(c => c.id !== chatId));
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const exportChat = () => {
    if (!selectedChat) return;
    const content = messages.map(m => 
      `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`
    ).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChat.title || 'chat'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow mr-4 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={createNewChat}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer mb-2 transition ${
                  selectedChat?.id === chat.id
                    ? 'bg-red-50 border border-red-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">{chat.title}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold">{selectedChat.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportChat}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Download chat"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Share chat"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {streaming && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200">
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,image/*,video/*,audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">No chat selected</p>
                <p className="text-sm">Create a new chat to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

