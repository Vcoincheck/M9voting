import React from 'react';
import { ArrowLeft, Users, Clock, FileText, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useDAO, Proposal } from './DAOProvider';

interface ProposalDetailsScreenProps {
  proposalId: string;
  onBack: () => void;
  onVote: (proposalId: string) => void;
}

export function ProposalDetailsScreen({ proposalId, onBack, onVote }: ProposalDetailsScreenProps) {
  const { proposals } = useDAO();
  const proposal = proposals.find(p => p.id === proposalId);

  if (!proposal) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
            Proposal Not Found
          </h2>
          <Button onClick={onBack} className="dao-gradient-blue text-white rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return 'Voting has ended';
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'commit':
        return {
          title: 'Commit Phase',
          description: 'Cast your encrypted vote',
          color: 'var(--dao-warning)',
          icon: '🔒'
        };
      case 'reveal':
        return {
          title: 'Reveal Phase', 
          description: 'Reveal your vote with ZK proof',
          color: 'var(--dao-accent-blue)',
          icon: '🔓'
        };
      case 'tally':
        return {
          title: 'Tally Phase',
          description: 'Results are being calculated',
          color: 'var(--dao-success)',
          icon: '📊'
        };
      default:
        return {
          title: 'Unknown Phase',
          description: '',
          color: 'var(--dao-foreground)',
          icon: '❓'
        };
    }
  };

  const phaseInfo = getPhaseInfo(proposal.phase || 'commit');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-xl"
          style={{
            borderColor: 'var(--dao-border)',
            color: 'var(--dao-foreground)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold dao-text-gradient">Proposal Details</h1>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            ID: {proposal.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <div className="dao-card p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge 
                variant="secondary"
                className="rounded-lg"
                style={{
                  backgroundColor: proposal.status === 'active' ? 'var(--dao-success)' : 
                                 proposal.status === 'pending' ? 'var(--dao-warning)' : 'var(--dao-accent-blue)',
                  color: 'white'
                }}
              >
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </Badge>
              <span className="text-sm font-mono opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Created by {formatAddress(proposal.creator)}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
              {proposal.title}
            </h2>

            <p className="leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
              {proposal.description}
            </p>
          </div>

          {/* Token Requirements */}
          <div className="dao-card p-6">
            <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--dao-foreground)'}}>
              <FileText className="w-5 h-5 mr-2" />
              Token Requirements
            </h3>
            <div className="space-y-2">
              {proposal.requiredTokens.wada && (
                <div className="flex items-center justify-between">
                  <span style={{color: 'var(--dao-foreground)'}}>Minimum WADA:</span>
                  <span className="font-mono font-semibold" style={{color: 'var(--dao-accent-blue)'}}>
                    {proposal.requiredTokens.wada.toLocaleString()}
                  </span>
                </div>
              )}
              {proposal.requiredTokens.night && (
                <div className="flex items-center justify-between">
                  <span style={{color: 'var(--dao-foreground)'}}>Minimum NIGHT:</span>
                  <span className="font-mono font-semibold" style={{color: 'var(--dao-accent-purple)'}}>
                    {proposal.requiredTokens.night.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span style={{color: 'var(--dao-foreground)'}}>Token Type:</span>
                <span className="font-semibold" style={{color: 'var(--dao-foreground)'}}>
                  {proposal.tokenType}
                </span>
              </div>
            </div>
          </div>

          {/* Vote History (for demonstration) */}
          <div className="dao-card p-6">
            <h3 className="font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
              Vote History (Anonymized)
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg"
                     style={{backgroundColor: 'var(--dao-background)'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" 
                         style={{backgroundColor: (proposal.phase || 'commit') === 'commit' ? 'var(--dao-warning)' : 'var(--dao-success)'}}></div>
                    <span className="font-mono text-sm" style={{color: 'var(--dao-foreground)'}}>
                      {(proposal.phase || 'commit') === 'commit' ? 'Commit' : 'Reveal'} #{i}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      hash_{Math.random().toString(36).substr(2, 8)}
                    </span>
                    {(proposal.phase || 'commit') === 'reveal' && (
                      <CheckCircle className="w-4 h-4" style={{color: 'var(--dao-success)'}} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Phase Status */}
          <div className="dao-card p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{phaseInfo.icon}</div>
              <h3 className="font-semibold text-lg" style={{color: phaseInfo.color}}>
                {phaseInfo.title}
              </h3>
              <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                {phaseInfo.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2" style={{color: 'var(--dao-foreground)'}}>
                <span>Commit</span>
                <span>Reveal</span>
                <span>Tally</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 h-2 rounded-full"
                     style={{backgroundColor: (proposal.phase || 'commit') === 'commit' ? phaseInfo.color : 'var(--dao-success)'}}></div>
                <div className="flex-1 h-2 rounded-full"
                     style={{backgroundColor: ['reveal', 'tally'].includes(proposal.phase || 'commit') ? phaseInfo.color : 'var(--dao-border)'}}></div>
                <div className="flex-1 h-2 rounded-full"
                     style={{backgroundColor: (proposal.phase || 'commit') === 'tally' ? phaseInfo.color : 'var(--dao-border)'}}></div>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center mb-6">
              <div className="text-2xl font-bold mb-1" style={{color: 'var(--dao-foreground)'}}>
                {getTimeRemaining(proposal.deadline)}
              </div>
              <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                {(proposal.phase || 'commit') === 'tally' ? 'Until results' : `Until ${(proposal.phase || 'commit') === 'commit' ? 'reveal' : 'tally'} phase`}
              </p>
            </div>

            {/* Vote Button */}
            {proposal.status === 'active' && (proposal.phase || 'commit') !== 'tally' && (
              <Button
                onClick={() => onVote(proposal.id)}
                className="w-full rounded-xl py-3 dao-gradient-blue text-white border-0"
              >
                {(proposal.phase || 'commit') === 'commit' ? '🔒 Cast Vote' : '🔓 Reveal Vote'}
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="dao-card p-6">
            <h3 className="font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
              Participation
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{color: 'var(--dao-foreground)'}}>Total Votes</span>
                <span className="font-bold" style={{color: 'var(--dao-foreground)'}}>
                  {proposal.voteCount.toLocaleString()}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span style={{color: 'var(--dao-foreground)'}}>Participation Rate</span>
                  <span className="font-bold" style={{color: 'var(--dao-accent-blue)'}}>
                    {proposal.participationRate}%
                  </span>
                </div>
                <Progress 
                  value={proposal.participationRate} 
                  className="h-2"
                />
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <span style={{color: 'var(--dao-foreground)'}}>Required Tokens</span>
                <span className="font-bold" style={{color: 'var(--dao-foreground)'}}>
                  {proposal.tokenType}
                </span>
              </div>
            </div>
          </div>

          {/* Results Preview (for reveal/tally phases) */}
          {((proposal.phase || 'commit') === 'reveal' || (proposal.phase || 'commit') === 'tally') && proposal.results && (
            <div className="dao-card p-6">
              <h3 className="font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                Current Results
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{color: 'var(--dao-success)'}}>Yes</span>
                  <span className="font-bold" style={{color: 'var(--dao-success)'}}>
                    {proposal.results.yes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{color: 'var(--dao-error)'}}>No</span>
                  <span className="font-bold" style={{color: 'var(--dao-error)'}}>
                    {proposal.results.no.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{color: 'var(--dao-foreground)'}}>Abstain</span>
                  <span className="font-bold opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    {proposal.results.abstain.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}