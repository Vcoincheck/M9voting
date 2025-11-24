import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { DAOProvider, useDAO } from './components/DAOProvider';
import { LandingScreen } from './components/LandingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CreateProposalScreen } from './components/CreateProposalScreen';
import { ProposalListScreen } from './components/ProposalListScreen';
import { ProposalDetailsScreen } from './components/ProposalDetailsScreen';
import { VotingScreen } from './components/VotingScreen';
import { VotingResultsScreen } from './components/VotingResultsScreen';
import { WalletManagementScreen } from './components/WalletManagementScreen';
import { DocumentsScreen } from './components/DocumentsScreen';
import { ActivitiesScreen } from './components/ActivitiesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProjectCommunityScreen } from './components/ProjectCommunityScreen';
import { ProjectDetailsScreen } from './components/ProjectDetailsScreen';
import { TempProjectDetailsScreen } from './components/TempProjectDetailsScreen';
import { CreateProjectScreen } from './components/CreateProjectScreen';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import { WalletSelector } from './components/WalletSelector';
import { WalletConnectionPopup } from './components/WalletConnectionPopup';
import { ThemeToggle } from './components/ThemeProvider';
import { FeedbackButton } from './components/FeedbackButton';
import { Toaster } from './components/ui/sonner';

type Screen = 
  | 'homepage'
  | 'dashboard'
  | 'create-proposal'
  | 'proposal-list'
  | 'proposal-details'
  | 'voting'
  | 'results'
  | 'wallet-management'
  | 'documents'
  | 'activities'
  | 'settings'
  | 'projects-community'
  | 'project-details'
  | 'create-project';

interface NavigationState {
  screen: Screen;
  proposalId?: string;
  projectId?: string;
}

function AppContent() {
  const [navigation, setNavigation] = useState<NavigationState>({ screen: 'homepage' });
  const { 
    wallet, 
    isGuestMode,
    showWalletSelector, 
    showConnectionPopup,
    connectionDetails,
    setShowWalletSelector, 
    setShowConnectionPopup,
    connectWallet,
    enterGuestMode 
  } = useDAO();

  const navigateTo = (screen: Screen, proposalId?: string, projectId?: string) => {
    setNavigation({ screen, proposalId, projectId });
  };

  const handleGoToApp = () => {
    if (wallet) {
      navigateTo('dashboard');
    } else {
      setShowWalletSelector(true);
    }
  };

  const handleWalletConnect = async (walletType: 'midnight' | 'hydra' | 'lace') => {
    await connectWallet(walletType);
    // Navigation will be handled by the popup close
  };

  const handleGuestAccess = () => {
    enterGuestMode();
    navigateTo('dashboard');
  };

  const handleConnectionPopupClose = () => {
    setShowConnectionPopup(false);
    navigateTo('dashboard');
  };

  const handleNavigateHome = () => {
    navigateTo('homepage');
  };

  const renderAppWithSidebar = (content: React.ReactNode) => {
    return (
      <div className="flex h-screen relative">
        <AppSidebar 
          currentScreen={navigation.screen} 
          onNavigate={(screen, proposalId, projectId) => navigateTo(screen as Screen, proposalId, projectId)} 
        />
        <main className="flex-1 overflow-auto">
          <AppHeader 
            showWalletConnect={!wallet && !isGuestMode}
            onWalletConnect={() => setShowWalletSelector(true)}
            onNavigateHome={handleNavigateHome}
          />
          <div className="pt-4 md:pt-0">
            {content}
          </div>
        </main>
      </div>
    );
  };

  const renderScreen = () => {
    switch (navigation.screen) {
      case 'homepage':
        return (
          <div className="relative">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <LandingScreen 
              onGoToApp={handleGoToApp}
            />
          </div>
        );
      
      case 'dashboard':
        if (!wallet && !isGuestMode) {
          // Show header with connect wallet option if not connected and not in guest mode
          return (
            <div>
              <AppHeader 
                showWalletConnect 
                onWalletConnect={() => setShowWalletSelector(true)}
                onNavigateHome={handleNavigateHome}
              />
              <div className="p-6 text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4 dao-text-gradient">
                    Connect Your Wallet
                  </h2>
                  <p className="text-xl opacity-70 mb-8" style={{color: 'var(--dao-foreground)'}}>
                    Connect your wallet to access M9 Privacy Voting features
                  </p>
                  <div className="dao-card p-8">
                    <p className="mb-4" style={{color: 'var(--dao-foreground)'}}>
                      Click "Connect Wallet" in the header to get started with anonymous voting and ZK privacy features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return renderAppWithSidebar(
          <DashboardScreen
            onCreateProposal={() => navigateTo('create-proposal')}
            onViewProposals={() => navigateTo('proposal-list')}
            onViewProposal={(id) => navigateTo('proposal-details', id)}
            onNavigate={(screen, proposalId) => navigateTo(screen as Screen, proposalId)}
          />
        );
      
      case 'create-proposal':
        // Redirect guest mode users
        if (isGuestMode) {
          return renderAppWithSidebar(
            <div className="p-6 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 dao-text-gradient">
                  Connect Wallet Required
                </h2>
                <p className="text-xl opacity-70 mb-8" style={{color: 'var(--dao-foreground)'}}>
                  You need to connect a wallet to create proposals
                </p>
              </div>
            </div>
          );
        }
        return renderAppWithSidebar(
          <CreateProposalScreen
            onBack={() => navigateTo('dashboard')}
            onSuccess={() => navigateTo('dashboard')}
          />
        );
      
      case 'proposal-list':
        return renderAppWithSidebar(
          <ProposalListScreen
            onBack={() => navigateTo('dashboard')}
            onViewProposal={(id) => navigateTo('proposal-details', id)}
            onCreateProposal={isGuestMode ? undefined : () => navigateTo('create-proposal')}
          />
        );
      
      case 'proposal-details':
        return renderAppWithSidebar(
          <ProposalDetailsScreen
            proposalId={navigation.proposalId!}
            onBack={() => navigateTo('proposal-list')}
            onVote={(id) => navigateTo('voting', id)}
          />
        );
      
      case 'voting':
        // Redirect guest mode users
        if (isGuestMode) {
          return renderAppWithSidebar(
            <div className="p-6 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 dao-text-gradient">
                  Connect Wallet Required
                </h2>
                <p className="text-xl opacity-70 mb-8" style={{color: 'var(--dao-foreground)'}}>
                  You need to connect a wallet to participate in voting
                </p>
              </div>
            </div>
          );
        }
        return renderAppWithSidebar(
          <VotingScreen
            proposalId={navigation.proposalId!}
            onBack={() => navigateTo('proposal-details', navigation.proposalId)}
            onComplete={() => navigateTo('proposal-details', navigation.proposalId)}
          />
        );
      
      case 'results':
        return renderAppWithSidebar(
          <VotingResultsScreen
            proposalId={navigation.proposalId!}
            onBack={() => navigateTo('proposal-details', navigation.proposalId)}
          />
        );
      
      case 'activities':
        return renderAppWithSidebar(
          <ActivitiesScreen
            onBack={() => navigateTo('dashboard')}
          />
        );
      
      case 'wallet-management':
        return renderAppWithSidebar(
          <WalletManagementScreen
            onBack={() => navigateTo('dashboard')}
          />
        );
      
      case 'documents':
        return renderAppWithSidebar(
          <DocumentsScreen
            onBack={() => navigateTo('dashboard')}
          />
        );
      
      case 'settings':
        return renderAppWithSidebar(
          <SettingsScreen
            onBack={() => navigateTo('dashboard')}
            onNavigateHome={handleNavigateHome}
          />
        );

      case 'projects-community':
        return renderAppWithSidebar(
          <ProjectCommunityScreen
            onBack={() => navigateTo('dashboard')}
            onViewProject={(id) => navigateTo('project-details', undefined, id)}
            onCreateProject={isGuestMode ? undefined : () => navigateTo('create-project')}
          />
        );

      case 'project-details':
        // Check if it's a temporary project
        if (navigation.projectId?.startsWith('temp_')) {
          return renderAppWithSidebar(
            <TempProjectDetailsScreen
              projectId={navigation.projectId}
              onBack={() => navigateTo('projects-community')}
              onNavigate={(screen, proposalId) => navigateTo(screen as Screen, proposalId)}
            />
          );
        }
        
        return renderAppWithSidebar(
          <ProjectDetailsScreen
            projectId={navigation.projectId!}
            onBack={() => navigateTo('projects-community')}
            onNavigate={(screen, proposalId) => navigateTo(screen as Screen, proposalId)}
          />
        );

      case 'create-project':
        // Redirect guest mode users
        if (isGuestMode) {
          return renderAppWithSidebar(
            <div className="p-6 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 dao-text-gradient">
                  Connect Wallet Required
                </h2>
                <p className="text-xl opacity-70 mb-8" style={{color: 'var(--dao-foreground)'}}>
                  You need to connect a wallet to create projects
                </p>
              </div>
            </div>
          );
        }
        return renderAppWithSidebar(
          <CreateProjectScreen
            onBack={() => navigateTo('projects-community')}
            onSuccess={() => navigateTo('projects-community')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen dao-background-gradient">
      {renderScreen()}
      <FeedbackButton />
      <WalletSelector
        open={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onConnect={handleWalletConnect}
        onGuestAccess={handleGuestAccess}
      />
      {wallet && 
       connectionDetails.walletType && 
       connectionDetails.zkSessionHash && 
       wallet.address && (
        <WalletConnectionPopup
          open={showConnectionPopup}
          onClose={handleConnectionPopupClose}
          walletAddress={wallet.address}
          walletType={connectionDetails.walletType}
          zkSessionHash={connectionDetails.zkSessionHash}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DAOProvider>
        <AppContent />
        <Toaster />
      </DAOProvider>
    </ThemeProvider>
  );
}