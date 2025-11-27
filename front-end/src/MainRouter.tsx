import React from 'react';
import { Navigate, Route, Routes, useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
import { useDAO } from './components/DAOProvider';
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
import { AppShell } from './AppShell';
import { AuthDialogs } from './components/AuthDialogs';

function ProposalId() {
  const { proposalId } = useParams();
  return proposalId || '';
}
function ProjectId() {
  const { projectId } = useParams();
  return projectId || '';
}

export function MainRouter() {
  const { setShowWalletSelector } = useDAO();
  const navigate = useNavigate();
  const location = useLocation();

  // Map pathname to currentScreen for sidebar highlighting
  const getCurrentScreen = () => {
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/proposal-list')) return 'proposal-list';
    if (location.pathname.startsWith('/projects-community')) return 'projects-community';
    if (location.pathname.startsWith('/activities')) return 'activities';
    if (location.pathname.startsWith('/settings')) return 'settings';
    if (location.pathname.startsWith('/documents')) return 'documents';
    if (location.pathname.startsWith('/proposal-details')) return 'proposal-list';
    if (location.pathname.startsWith('/voting')) return 'proposal-list';
    if (location.pathname.startsWith('/results')) return 'proposal-list';
    if (location.pathname.startsWith('/project-details')) return 'projects-community';
    if (location.pathname.startsWith('/temp-project-details')) return 'projects-community';
    if (location.pathname.startsWith('/wallet-management')) return 'dashboard';
    if (location.pathname.startsWith('/create-proposal')) return 'dashboard';
    if (location.pathname.startsWith('/create-project')) return 'projects-community';
    return '';
  };
  const currentScreen = getCurrentScreen();

  const handleSidebarNavigate = (screen: string, proposalId?: string, projectId?: string) => {
    switch (screen) {
      case 'dashboard':
        navigate('/dashboard'); break;
      case 'proposal-list':
        navigate('/proposal-list'); break;
      case 'projects-community':
        navigate('/projects-community'); break;
      case 'activities':
        navigate('/activities'); break;
      case 'settings':
        navigate('/settings'); break;
      case 'documents':
        navigate('/documents'); break;
      default:
        navigate('/dashboard'); break;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LandingScreen onGoToApp={() => setShowWalletSelector(true)} />
            <AuthDialogs />
          </>
        }
      />
      <Route
        element={
          <AppShell currentScreen={currentScreen} onNavigate={handleSidebarNavigate}>
            <Outlet />
          </AppShell>
        }
      >
        <Route path="dashboard" element={
          <DashboardScreen
            onCreateProposal={() => navigate('/create-proposal')}
            onViewProposals={() => navigate('/proposal-list')}
            onViewProposal={id => navigate(`/proposal-details/${id}`)}
            onNavigate={(screen, proposalId) => {
              if (screen === 'proposal-details' && proposalId) navigate(`/proposal-details/${proposalId}`);
              else if (screen === 'dashboard') navigate('/dashboard');
            }}
          />
        } />
        <Route path="create-proposal" element={
          <CreateProposalScreen
            onBack={() => navigate('/dashboard')}
            onSuccess={() => navigate('/dashboard')}
          />
        } />
        <Route path="proposal-list" element={
          <ProposalListScreen
            onBack={() => navigate('/dashboard')}
            onViewProposal={id => navigate(`/proposal-details/${id}`)}
            onCreateProposal={() => navigate('/create-proposal')}
          />
        } />
        <Route path="proposal-details/:proposalId" element={
          <ProposalDetailsScreen
            onBack={() => navigate('/proposal-list')}
            onVote={id => navigate(`/voting/${id}`)}
          />
        } />
        <Route path="voting/:proposalId" element={
          <VotingScreen
            onBack={() => navigate(-1)}
            onComplete={() => navigate(-1)}
          />
        } />
        <Route path="results/:proposalId" element={
          <VotingResultsScreen
            onBack={() => navigate(-1)}
          />
        } />
        <Route path="wallet-management" element={<WalletManagementScreen onBack={() => navigate('/dashboard')} />} />
        <Route path="documents" element={<DocumentsScreen onBack={() => navigate('/dashboard')} />} />
        <Route path="activities" element={<ActivitiesScreen onBack={() => navigate('/dashboard')} />} />
        <Route path="settings" element={<SettingsScreen onBack={() => navigate('/dashboard')} onNavigateHome={() => navigate('/')} />} />
        <Route path="projects-community" element={
          <ProjectCommunityScreen
            onBack={() => navigate('/dashboard')}
            onViewProject={id => navigate(`/project-details/${id}`)}
            onCreateProject={() => navigate('/create-project')}
          />
        } />
        <Route path="project-details/:projectId" element={
          <ProjectDetailsScreen
            onBack={() => navigate('/projects-community')}
            onNavigate={(screen: string, proposalId?: string) => {
              if (screen === 'proposal-details' && proposalId) navigate(`/proposal-details/${proposalId}`);
            }}
          />
        } />
        <Route path="temp-project-details/:projectId" element={
          <TempProjectDetailsScreen
            projectId={ProjectId()}
            onBack={() => navigate('/projects-community')}
            onNavigate={(screen, proposalId) => {
              if (screen === 'proposal-details' && proposalId) navigate(`/proposal-details/${proposalId}`);
            }}
          />
        } />
        <Route path="create-project" element={
          <CreateProjectScreen
            onBack={() => navigate('/projects-community')}
            onSuccess={() => navigate('/projects-community')}
          />
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}