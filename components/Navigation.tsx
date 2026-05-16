'use client';

import { useAuth } from '@/app/auth-provider';
import { useTranslation } from '@/app/translation-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavigationProps {
  onMusicToggle?: (enabled: boolean) => void;
  musicEnabled?: boolean;
}

export default function Navigation({ onMusicToggle, musicEnabled = false }: NavigationProps) {
  const { logout, user } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isArabic = language === 'ar';

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { path: '/apology', labelKey: 'nav.apology' },
    { path: '/personal', labelKey: 'nav.personal' },
    { path: '/rules', labelKey: 'nav.rules' },
    { path: '/gallery', labelKey: 'nav.gallery' },
    { path: '/chat', labelKey: 'nav.chat' },
    { path: '/settings', labelKey: 'nav.settings' },
  ];

  return (
    <nav className="bg-[#1A0F2E]/80 border-b border-[#5D3B7F] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/apology" className="text-2xl font-bold text-[#8B5CF6]">
          {t('app.title')}
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`transition duration-200 ${
                isActive(link.path)
                  ? 'text-[#8B5CF6] font-semibold'
                  : 'text-gray-300 hover:text-[#C084FC]'
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* User info and actions */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
            className="px-3 py-2 rounded bg-[#5D3B7F]/30 hover:bg-[#5D3B7F]/60 text-[#C084FC] transition text-sm"
            title="Toggle language"
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>

          <button
            onClick={() => onMusicToggle?.(!musicEnabled)}
            className="px-3 py-2 rounded bg-[#5D3B7F]/30 hover:bg-[#5D3B7F]/60 text-[#C084FC] transition text-sm"
            title="Toggle music"
          >
            {musicEnabled ? '🔊' : '🔇'}
          </button>
          
          <button
            onClick={logout}
            className="px-3 py-2 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 transition text-sm"
          >
            {t('settings.logout')}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/50 p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-3 py-2 rounded transition ${
                isActive(link.path)
                  ? 'bg-[#5D3B7F] text-white'
                  : 'text-gray-300 hover:bg-[#5D3B7F]/30'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
