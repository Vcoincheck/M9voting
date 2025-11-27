import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen onGoToApp={() => window.location.assign('/dashboard')} />} />
      <Route path="/dashboard" element={<DashboardScreen onCreateProposal={() => window.location.assign('/create-proposal')} onViewProposals={() => window.location.assign('/proposal-list')} onViewProposal={id => window.location.assign(`/proposal-details/${id}`)} onNavigate={(screen, proposalId) => { if (screen === 'proposal-details' && proposalId) window.location.assign(`/proposal-details/${proposalId}`); else if (screen === 'dashboard') window.location.assign('/dashboard'); }} />} />
      <Route path="/create-proposal" element={<CreateProposalScreen onBack={() => window.history.back()} onSuccess={() => window.location.assign('/dashboard')} />} />
      <Route path="/proposal-list" element={<ProposalListScreen onBack={() => window.location.assign('/dashboard')} onViewProposal={id => window.location.assign(`/proposal-details/${id}`)} onCreateProposal={() => window.location.assign('/create-proposal')} />} />
      <Route path="/proposal-details/:proposalId" element={<ProposalDetailsScreen onBack={() => window.location.assign('/proposal-list')} onVote={id => window.location.assign(`/voting/${id}`)} />} />
      <Route path="/voting/:proposalId" element={<VotingScreen onBack={() => window.history.back()} onComplete={() => window.history.back()} />} />
      <Route path="/results/:proposalId" element={<VotingResultsScreen onBack={() => window.history.back()} />} />
      <Route path="/wallet-management" element={<WalletManagementScreen onBack={() => window.location.assign('/dashboard')} />} />
      <Route path="/documents" element={<DocumentsScreen onBack={() => window.location.assign('/dashboard')} />} />
      <Route path="/activities" element={<ActivitiesScreen onBack={() => window.location.assign('/dashboard')} />} />
      <Route path="/settings" element={<SettingsScreen onBack={() => window.location.assign('/dashboard')} onNavigateHome={() => window.location.assign('/')} />} />
      <Route path="/projects-community" element={<ProjectCommunityScreen onBack={() => window.location.assign('/dashboard')} onViewProject={id => window.location.assign(`/project-details/${id}`)} onCreateProject={() => window.location.assign('/create-project')} />} />
      <Route path="/project-details/:projectId" element={<ProjectDetailsScreen onBack={() => window.location.assign('/projects-community')} onNavigate={(screen, proposalId) => { if (screen === 'proposal-details' && proposalId) window.location.assign(`/proposal-details/${proposalId}`); }} />} />
      <Route path="/temp-project-details/:projectId" element={<TempProjectDetailsScreen projectId={''} onBack={() => window.location.assign('/projects-community')} onNavigate={(screen, proposalId) => { if (screen === 'proposal-details' && proposalId) window.location.assign(`/proposal-details/${proposalId}`); }} />} />
      <Route path="/create-project" element={<CreateProjectScreen onBack={() => window.location.assign('/projects-community')} onSuccess={() => window.location.assign('/projects-community')} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
