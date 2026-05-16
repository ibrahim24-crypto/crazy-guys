'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { useEffect } from 'react';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const { isAuthorized, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthorized && user) {
      router.push('/apology');
    }
  }, [isAuthorized, loading, router, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return isAuthorized ? null : <LandingPage />;
}
