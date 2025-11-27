import React from 'react';
import { DashboardContent } from '../../components/DashboardContent';
import { useAppNavigation } from '../../hooks';

export function DashboardPage() {
  const nav = useAppNavigation();

  return (
    <DashboardContent 
      onCreateProposal={() => nav.toCreateProposal()}
      onViewProposals={() => nav.toProposalList()}
      onViewProposal={(id) => nav.toProposalDetails(id)}
      onNavigate={(screen) => {
        if (screen === 'proposal-details') {
          nav.toProposalDetails('');
        } else if (screen === 'dashboard') {
          nav.toDashboard();
        }
      }}
    />
  );
}