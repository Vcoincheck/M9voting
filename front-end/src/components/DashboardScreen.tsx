import React from 'react';
import { DashboardContent } from './DashboardContent';

interface DashboardScreenProps {
  onCreateProposal: () => void;
  onViewProposals: () => void;
  onViewProposal: (id: string) => void;
  onNavigate: (screen: string, proposalId?: string) => void;
}

export function DashboardScreen({ onCreateProposal, onViewProposals, onViewProposal, onNavigate }: DashboardScreenProps) {
  return (
    <DashboardContent 
      onCreateProposal={onCreateProposal}
      onViewProposals={onViewProposals}
      onViewProposal={onViewProposal}
      onNavigate={onNavigate}
    />
  );
}