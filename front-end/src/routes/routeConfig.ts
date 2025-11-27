import React from 'react';
import { ROUTES } from '../constants/routes';

// Pages imports
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Proposal pages
import { ProposalListPage } from '../pages/proposals/ProposalListPage';
import { ProposalDetailsPage } from '../pages/proposals/ProposalDetailsPage';
import { CreateProposalPage } from '../pages/proposals/CreateProposalPage';
import { VotingPage } from '../pages/proposals/VotingPage';
import { VotingResultsPage } from '../pages/proposals/VotingResultsPage';

// Project pages
import { ProjectCommunityPage } from '../pages/projects/ProjectCommunityPage';
import { ProjectDetailsPage } from '../pages/projects/ProjectDetailsPage';
import { TempProjectDetailsPage } from '../pages/projects/TempProjectDetailsPage';
import { CreateProjectPage } from '../pages/projects/CreateProjectPage';

// Settings pages
import { SettingsPage } from '../pages/settings/SettingsPage';
import { WalletManagementPage } from '../pages/settings/WalletManagementPage';
import { DocumentsPage } from '../pages/settings/DocumentsPage';
import { ActivitiesPage } from '../pages/settings/ActivitiesPage';

export type RoutePermission = 'public' | 'authenticated' | 'admin';

export interface AppRouteConfig {
  path: string;
  element: React.ComponentType<any>;
  layout?: 'main' | 'auth' | 'none';
  permission?: RoutePermission;
  title?: string;
  children?: AppRouteConfig[];
  index?: boolean;
}

export const routeConfig: AppRouteConfig[] = [
  // Public routes
  {
    path: ROUTES.LANDING,
    element: LandingPage,
    layout: 'none',
    permission: 'public',
    title: 'M9 Privacy - Secure DAO Governance',
  },

  // Dashboard
  {
    path: ROUTES.DASHBOARD,
    element: DashboardPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Dashboard',
  },

  // Proposals
  {
    path: ROUTES.PROPOSAL_LIST,
    element: ProposalListPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'All Proposals',
  },
  {
    path: ROUTES.PROPOSAL_DETAILS,
    element: ProposalDetailsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Proposal Details',
  },
  {
    path: ROUTES.CREATE_PROPOSAL,
    element: CreateProposalPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Create Proposal',
  },
  {
    path: ROUTES.VOTING,
    element: VotingPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Voting',
  },
  {
    path: ROUTES.VOTING_RESULTS,
    element: VotingResultsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Voting Results',
  },

  // Projects
  {
    path: ROUTES.PROJECTS_COMMUNITY,
    element: ProjectCommunityPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Projects Community',
  },
  {
    path: ROUTES.PROJECT_DETAILS,
    element: ProjectDetailsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Project Details',
  },
  {
    path: ROUTES.TEMP_PROJECT_DETAILS,
    element: TempProjectDetailsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Project Details',
  },
  {
    path: ROUTES.CREATE_PROJECT,
    element: CreateProjectPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Create Project',
  },

  // Settings
  {
    path: ROUTES.SETTINGS,
    element: SettingsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Settings',
  },
  {
    path: ROUTES.WALLET_MANAGEMENT,
    element: WalletManagementPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Wallet Management',
  },
  {
    path: ROUTES.DOCUMENTS,
    element: DocumentsPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Documents',
  },
  {
    path: ROUTES.ACTIVITIES,
    element: ActivitiesPage,
    layout: 'main',
    permission: 'authenticated',
    title: 'Activities',
  },
];
