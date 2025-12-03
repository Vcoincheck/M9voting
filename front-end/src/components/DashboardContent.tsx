import React from 'react';
import { Plus, FileText, CheckCircle, Users, TrendingUp, Book, FolderPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useDAO } from './context';

interface DashboardContentProps {
  onCreateProposal: () => void;
  onViewProposals: () => void;
  onViewProposal: (id: string) => void;
  onNavigate?: (screen: string) => void;
}

export function DashboardContent({ onCreateProposal, onViewProposals, onViewProposal, onNavigate }: DashboardContentProps) {
  const { proposals } = useDAO();

  const activeProposals = proposals.filter(p => p.status === 'active');
  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const closedProposals = proposals.filter(p => p.status === 'closed');

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Ending soon';
  };

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold dao-text-gradient mb-2">Welcome to M9 DAO</h1>
        <p className="text-xl opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Participate in decentralized governance with Zero-Knowledge privacy
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dao-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                   style={{backgroundColor: 'var(--dao-success)', opacity: 0.1}}>
                <TrendingUp className="w-6 h-6" style={{color: 'var(--dao-success)'}} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: 'var(--dao-foreground)'}}>Active</h3>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Currently voting
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold" style={{color: 'var(--dao-success)'}}>
              {activeProposals.length}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={onViewProposals}
            style={{borderColor: 'var(--dao-success)', color: 'var(--dao-success)'}}
          >
            View Active Proposals
          </Button>
        </div>

        <div className="dao-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                   style={{backgroundColor: 'var(--dao-warning)', opacity: 0.1}}>
                <FileText className="w-6 h-6" style={{color: 'var(--dao-warning)'}} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: 'var(--dao-foreground)'}}>Pending</h3>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Awaiting approval
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold" style={{color: 'var(--dao-warning)'}}>
              {pendingProposals.length}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={onCreateProposal}
            style={{borderColor: 'var(--dao-warning)', color: 'var(--dao-warning)'}}
          >
            Create New Proposal
          </Button>
        </div>

        <div className="dao-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                   style={{backgroundColor: 'var(--dao-accent-blue)', opacity: 0.1}}>
                <CheckCircle className="w-6 h-6" style={{color: 'var(--dao-accent-blue)'}} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: 'var(--dao-foreground)'}}>Completed</h3>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Voting closed
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold" style={{color: 'var(--dao-accent-blue)'}}>
              {closedProposals.length}
            </span>
          </div>
          <Button 
            variant="outline" 
            className="w-full rounded-xl"
            onClick={onViewProposals}
            style={{borderColor: 'var(--dao-accent-blue)', color: 'var(--dao-accent-blue)'}}
          >
            View Results
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dao-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            onClick={onCreateProposal}
            className="rounded-xl p-6 h-auto dao-gradient-blue text-white border-0 justify-start"
          >
            <div className="flex items-center space-x-4">
              <Plus className="w-8 h-8" />
              <div className="text-left">
                <div className="font-semibold text-lg">Create Proposal</div>
                <div className="text-sm opacity-90">Submit a new governance proposal</div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate?.('create-project')}
            className="rounded-xl p-6 h-auto justify-start"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            <div className="flex items-center space-x-4">
              <FolderPlus className="w-8 h-8" />
              <div className="text-left">
                <div className="font-semibold text-lg">Create Project</div>
                <div className="text-sm opacity-70">Start a new community project</div>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate?.('documents')}
            className="rounded-xl p-6 h-auto justify-start"
            style={{borderColor: 'var(--dao-accent-purple)', color: 'var(--dao-accent-purple)'}}
          >
            <div className="flex items-center space-x-4">
              <Book className="w-8 h-8" />
              <div className="text-left">
                <div className="font-semibold text-lg">Documentation</div>
                <div className="text-sm opacity-70">Guides and technical docs</div>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Recent Proposals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{color: 'var(--dao-foreground)'}}>
            Recent Proposals
          </h2>
          <Button
            variant="outline"
            onClick={onViewProposals}
            className="rounded-xl"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {proposals.slice(0, 6).map((proposal) => (
            <div key={proposal.id} className="dao-card p-6 cursor-pointer"
                 onClick={() => onViewProposal(proposal.id)}>
              <div className="flex items-start justify-between mb-4">
                <Badge 
                  variant={proposal.status === 'active' ? 'default' : 'secondary'}
                  className="rounded-lg"
                  style={{
                    backgroundColor: proposal.status === 'active' ? 'var(--dao-success)' : 
                                   proposal.status === 'pending' ? 'var(--dao-warning)' : 'var(--dao-accent-blue)',
                    color: 'white'
                  }}
                >
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
                <span className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {getTimeRemaining(proposal.deadline)}
                </span>
              </div>

              <h3 className="font-semibold mb-2 line-clamp-2" style={{color: 'var(--dao-foreground)'}}>
                {proposal.title}
              </h3>
              
              <p className="text-sm opacity-70 mb-4 line-clamp-3" style={{color: 'var(--dao-foreground)'}}>
                {proposal.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 opacity-70" style={{color: 'var(--dao-foreground)'}} />
                  <span className="text-sm" style={{color: 'var(--dao-foreground)'}}>
                    {proposal.voteCount} votes
                  </span>
                </div>
                <span className="text-sm font-mono opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {proposal.creator.slice(0, 8)}...{proposal.creator.slice(-6)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}