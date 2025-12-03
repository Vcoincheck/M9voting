import React from 'react';
import { AppSidebar, AppHeader } from './components/layout';
import { FeedbackButton } from './components/FeedbackButton';
import { useDAO } from './components/context';
import { AuthDialogs } from './components/auth';

interface AppShellProps {
  children: React.ReactNode;
  currentScreen?: string;
}

export function AppShell({ children, currentScreen }: AppShellProps) {
  const { setShowWalletSelector, wallet } = useDAO();

  return (
    <div className="flex relative">
      <AppSidebar currentScreen={currentScreen || ''} />
      <main className="flex-1 overflow-auto">
        <AppHeader
          showWalletConnect={!wallet}
          onWalletConnect={() => setShowWalletSelector(true)}
          onNavigateHome={() => { window.location.assign('/'); }}
        />
        <div className="pt-4 md:pt-0">
          {children}
        </div>
      </main>
      <FeedbackButton />
      <AuthDialogs />
    </div>
  );
}
