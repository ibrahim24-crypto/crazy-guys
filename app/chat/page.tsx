'use client';

import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatContent from '@/components/ChatContent';

export default function ChatPage() {
  const { isAuthorized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthorized) {
      router.push('/login');
    }
  }, [isAuthorized, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return isAuthorized ? <ChatContent /> : null;
}
