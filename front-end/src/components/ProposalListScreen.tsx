import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Users, Clock, Grid3X3, List, Plus, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDAO } from './DAOProvider';

interface ProposalListScreenProps {
  onBack: () => void;
  onViewProposal: (id: string) => void;
  onCreateProposal?: () => void;
}

export function ProposalListScreen({ onBack, onViewProposal, onCreateProposal }: ProposalListScreenProps) {
  const { proposals, isGuestMode } = useDAO();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diff < 0) return 'Ended';
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Ending soon';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'commit': return 'var(--dao-warning)';
      case 'reveal': return 'var(--dao-accent-blue)';
      case 'tally': return 'var(--dao-success)';
      default: return 'var(--dao-foreground)';
    }
  };

  // Filter proposals based on guest mode
  const availableProposals = isGuestMode 
    ? proposals.filter(p => p.status === 'closed') // Only show completed proposals in guest mode
    : proposals; // Show all proposals when wallet is connected

  const filteredAndSortedProposals = availableProposals
    .filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.deadline.getTime() - b.deadline.getTime();
        case 'votes':
          return b.voteCount - a.voteCount;
        case 'created':
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
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
            <h1 className="text-3xl font-bold dao-text-gradient">
              {isGuestMode ? 'Completed Proposals' : 'All Proposals'}
            </h1>
            <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
              {isGuestMode 
                ? `${filteredAndSortedProposals.length} completed proposals (public view)`
                : `${filteredAndSortedProposals.length} proposals found`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* New Proposal Button - Hidden in guest mode */}
          {!isGuestMode && (
            <Button
              onClick={onCreateProposal}
              className="rounded-xl dao-gradient-blue text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          )}

          {/* Guest mode indicator */}
          {isGuestMode && (
            <div className="flex items-center space-x-2 dao-card px-3 py-2 rounded-xl">
              <Lock className="w-4 h-4 opacity-50" style={{color: 'var(--dao-warning)'}} />
              <span className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Public View Only
              </span>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 dao-card p-2 rounded-xl">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg ${viewMode === 'grid' ? 'dao-gradient-blue text-white' : ''}`}
              style={{
                color: viewMode === 'grid' ? 'white' : 'var(--dao-foreground)'
              }}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-lg ${viewMode === 'list' ? 'dao-gradient-blue text-white' : ''}`}
              style={{
                color: viewMode === 'list' ? 'white' : 'var(--dao-foreground)'
              }}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Guest Mode Notice */}
      {isGuestMode && (
        <div className="dao-card p-4 mb-6 border border-dashed" style={{borderColor: 'var(--dao-warning)'}}>
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 mt-0.5" style={{color: 'var(--dao-warning)'}} />
            <div>
              <h3 className="font-medium mb-1" style={{color: 'var(--dao-foreground)'}}>
                Limited Access - Guest Mode
              </h3>
              <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                You're viewing in guest mode. Only completed proposals are visible. Connect your wallet to see all active proposals, create new proposals, and participate in voting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="dao-card p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50"
                   style={{color: 'var(--dao-foreground)'}} />
            <Input
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
              style={{
                backgroundColor: 'var(--dao-background)',
                borderColor: 'var(--dao-border)',
                color: 'var(--dao-foreground)'
              }}
            />
          </div>

          {/* Status Filter - Modified for guest mode */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 rounded-xl"
                         style={{
                           backgroundColor: 'var(--dao-background)',
                           borderColor: 'var(--dao-border)',
                           color: 'var(--dao-foreground)'
                         }}>
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {isGuestMode ? 'All Completed' : 'All Status'}
              </SelectItem>
              {!isGuestMode && (
                <>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </>
              )}
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 rounded-xl"
                         style={{
                           backgroundColor: 'var(--dao-background)',
                           borderColor: 'var(--dao-border)',
                           color: 'var(--dao-foreground)'
                         }}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="votes">Vote Count</SelectItem>
              <SelectItem value="created">Recently Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Proposals Display */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="dao-card p-6 cursor-pointer transition-all duration-300"
              onClick={() => onViewProposal(proposal.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
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
                  {proposal.status === 'active' && proposal.phase && (
                    <Badge 
                      variant="outline"
                      className="rounded-lg text-xs"
                      style={{
                        borderColor: getPhaseColor(proposal.phase),
                        color: getPhaseColor(proposal.phase)
                      }}
                    >
                      {proposal.phase.charAt(0).toUpperCase() + proposal.phase.slice(1)}
                    </Badge>
                  )}
                </div>
                {/* Guest mode lock indicator for completed proposals */}
                {isGuestMode && (
                  <Lock className="w-4 h-4 opacity-30" style={{color: 'var(--dao-foreground)'}} />
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold mb-2 line-clamp-2" style={{color: 'var(--dao-foreground)'}}>
                {proposal.title}
              </h3>

              {/* Description */}
              <p className="text-sm opacity-70 mb-4 line-clamp-3" style={{color: 'var(--dao-foreground)'}}>
                {proposal.description}
              </p>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 opacity-70" style={{color: 'var(--dao-foreground)'}} />
                    <span className="text-sm" style={{color: 'var(--dao-foreground)'}}>
                      {proposal.voteCount} votes
                    </span>
                  </div>
                  <span className="text-sm font-medium" style={{color: 'var(--dao-accent-blue)'}}>
                    {proposal.participationRate}% participation
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 opacity-70" style={{color: 'var(--dao-foreground)'}} />
                    <span className="text-sm" style={{color: 'var(--dao-foreground)'}}>
                      {getTimeRemaining(proposal.deadline)}
                    </span>
                  </div>
                  <span className="text-sm font-mono opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    {formatAddress(proposal.creator)}
                  </span>
                </div>
              </div>

              {/* Progress Bar for Active Proposals */}
              {proposal.status === 'active' && (
                <div className="mt-4">
                  <div className="w-full bg-opacity-20 rounded-full h-2"
                       style={{backgroundColor: 'var(--dao-border)'}}>
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: 'var(--dao-accent-blue)',
                        width: `${Math.min(proposal.participationRate, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredAndSortedProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="dao-card p-6 cursor-pointer transition-all duration-300"
              onClick={() => onViewProposal(proposal.id)}
            >
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
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
                    {proposal.status === 'active' && proposal.phase && (
                      <Badge 
                        variant="outline"
                        className="rounded-lg text-xs"
                        style={{
                          borderColor: getPhaseColor(proposal.phase),
                          color: getPhaseColor(proposal.phase)
                        }}
                      >
                        {proposal.phase.charAt(0).toUpperCase() + proposal.phase.slice(1)}
                      </Badge>
                    )}
                    {isGuestMode && (
                      <Badge variant="outline" className="rounded-lg text-xs" style={{color: 'var(--dao-warning)', borderColor: 'var(--dao-warning)'}}>
                        Public View
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--dao-foreground)'}}>
                    {proposal.title}
                  </h3>

                  <p className="text-sm opacity-70 mb-4 line-clamp-2" style={{color: 'var(--dao-foreground)'}}>
                    {proposal.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 opacity-70" style={{color: 'var(--dao-foreground)'}} />
                      <span style={{color: 'var(--dao-foreground)'}}>
                        {proposal.voteCount} votes
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 opacity-70" style={{color: 'var(--dao-foreground)'}} />
                      <span style={{color: 'var(--dao-foreground)'}}>
                        {getTimeRemaining(proposal.deadline)}
                      </span>
                    </div>
                    <span className="font-mono opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      {formatAddress(proposal.creator)}
                    </span>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-end space-y-3 ml-6">
                  <span className="text-sm font-medium" style={{color: 'var(--dao-accent-blue)'}}>
                    {proposal.participationRate}% participation
                  </span>
                  
                  {/* Progress Bar for Active Proposals */}
                  {proposal.status === 'active' && (
                    <div className="w-32">
                      <div className="w-full bg-opacity-20 rounded-full h-2"
                           style={{backgroundColor: 'var(--dao-border)'}}>
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: 'var(--dao-accent-blue)',
                            width: `${Math.min(proposal.participationRate, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedProposals.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl dao-gradient-blue flex items-center justify-center opacity-50">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--dao-foreground)'}}>
            {isGuestMode ? 'No completed proposals found' : 'No proposals found'}
          </h3>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            {isGuestMode 
              ? 'No completed proposals match your search criteria'
              : 'Try adjusting your search terms or filters'
            }
          </p>
        </div>
      )}
    </div>
  );
}