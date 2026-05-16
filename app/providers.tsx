import { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { TranslationProvider } from './translation-provider';

interface Props {
  children: ReactNode;
}

export function RootProviders({ children }: Props) {
  return (
    <AuthProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </AuthProvider>
  );
}
