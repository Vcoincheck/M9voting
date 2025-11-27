import React from 'react';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { FeedbackButton } from './components/FeedbackButton';
import { useDAO } from './components/DAOProvider';
import { AuthDialogs } from './components/AuthDialogs';

interface AppShellProps {
  children: React.ReactNode;
  currentScreen?: string;
  onNavigate?: (screen: string, proposalId?: string, projectId?: string) => void;
}

export function AppShell({ children, currentScreen, onNavigate }: AppShellProps) {
  const { setShowWalletSelector, wallet } = useDAO();

  return (
    <div className="flex relative">
      <AppSidebar currentScreen={currentScreen || ''} onNavigate={onNavigate || (() => {})} />
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
