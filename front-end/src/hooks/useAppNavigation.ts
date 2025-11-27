import { useNavigate } from 'react-router-dom';
import { ROUTES, createRoute } from '../constants/routes';

/**
 * Custom hook for type-safe navigation throughout the app
 */
export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    navigate,
    
    // Dashboard
    toDashboard: () => navigate(ROUTES.DASHBOARD),
    
    // Proposals
    toProposalList: () => navigate(ROUTES.PROPOSAL_LIST),
    toProposalDetails: (id: string) => navigate(createRoute.proposalDetails(id)),
    toCreateProposal: () => navigate(ROUTES.CREATE_PROPOSAL),
    toVoting: (id: string) => navigate(createRoute.voting(id)),
    toVotingResults: (id: string) => navigate(createRoute.votingResults(id)),
    
    // Projects
    toProjectsCommunity: () => navigate(ROUTES.PROJECTS_COMMUNITY),
    toProjectDetails: (id: string) => navigate(createRoute.projectDetails(id)),
    toTempProjectDetails: (id: string) => navigate(createRoute.tempProjectDetails(id)),
    toCreateProject: () => navigate(ROUTES.CREATE_PROJECT),
    
    // Settings
    toSettings: () => navigate(ROUTES.SETTINGS),
    toWalletManagement: () => navigate(ROUTES.WALLET_MANAGEMENT),
    toDocuments: () => navigate(ROUTES.DOCUMENTS),
    toActivities: () => navigate(ROUTES.ACTIVITIES),
    
    // Landing
    toLanding: () => navigate(ROUTES.LANDING),
    
    // Navigation - fallback to dashboard if no history
    goBack: () => {
      console.log('🔙 Going back...');
      // Try to go back in history, but if no history exists, go to dashboard
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        console.log('⚠️ No history available, redirecting to dashboard');
        navigate(ROUTES.DASHBOARD);
      }
    },
  };
}
