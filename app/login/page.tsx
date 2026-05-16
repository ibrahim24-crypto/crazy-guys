'use client';

import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { APPROVED_EMAILS } from '@/utils/constants';
import { useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useEffect } from 'react';
import { useTranslation } from '@/app/translation-provider';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthorized, loading } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && isAuthorized) {
      router.push('/apology');
    }
  }, [isAuthorized, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email && APPROVED_EMAILS.includes(result.user.email)) {
        router.push('/apology');
      } else {
        setError(t('login.unauthorized'));
        await auth.signOut();
      }
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A]">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A0F2E] to-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1A0F2E] rounded-lg shadow-2xl p-8 border border-[#5D3B7F]">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">{t('app.title')}</h1>
          <p className="text-center text-[#C084FC] mb-8">{t('login.subtitle')}</p>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full bg-[#5D3B7F] hover:bg-[#7D5BA3] disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {signingIn ? `${t('common.loading')}...` : t('login.signIn')}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
