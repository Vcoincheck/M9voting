// Route paths constants for type-safe navigation
export const ROUTES = {
  // Public routes
  ROOT: '/',
  LANDING: '/',

  // Dashboard routes
  DASHBOARD: '/dashboard',

  // Proposal routes
  PROPOSALS: '/proposals',
  PROPOSAL_LIST: '/proposal-list',
  PROPOSAL_DETAILS: '/proposal-details/:proposalId',
  CREATE_PROPOSAL: '/create-proposal',
  VOTING: '/voting/:proposalId',
  VOTING_RESULTS: '/results/:proposalId',

  // Project routes
  PROJECTS_COMMUNITY: '/projects-community',
  PROJECT_DETAILS: '/project-details/:projectId',
  TEMP_PROJECT_DETAILS: '/temp-project-details/:projectId',
  CREATE_PROJECT: '/create-project',

  // Settings routes
  SETTINGS: '/settings',
  WALLET_MANAGEMENT: '/wallet-management',
  DOCUMENTS: '/documents',
  ACTIVITIES: '/activities',

  // Fallback
  NOT_FOUND: '*',
} as const;

// Helper functions for navigation with parameters
export const createRoute = {
  proposalDetails: (id: string) => `/proposal-details/${id}`,
  voting: (id: string) => `/voting/${id}`,
  votingResults: (id: string) => `/results/${id}`,
  projectDetails: (id: string) => `/project-details/${id}`,
  tempProjectDetails: (id: string) => `/temp-project-details/${id}`,
} as const;

export type RouteKey = keyof typeof ROUTES;
