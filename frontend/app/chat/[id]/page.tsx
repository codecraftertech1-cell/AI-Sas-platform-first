'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { chatApi } from '@/lib/api';
import toast from 'react-hot-toast';

// Redirect to main chat page with selected chat
export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      router.push(`/chat?chatId=${params.id}`);
    } else {
      router.push('/chat');
    }
  }, [params.id, router]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    </Layout>
  );
}

