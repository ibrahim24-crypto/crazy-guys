'use client';

import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
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

  return isAuthorized ? <SettingsContent /> : null;
}
