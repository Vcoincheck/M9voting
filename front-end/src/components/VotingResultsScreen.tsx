import React, { useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, CheckCircle, BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useDAO } from './DAOProvider';

interface VotingResultsScreenProps {
  proposalId: string;
  onBack: () => void;
}

export function VotingResultsScreen({ proposalId, onBack }: VotingResultsScreenProps) {
  const { proposals } = useDAO();
  const proposal = proposals.find(p => p.id === proposalId);
  const [copied, setCopied] = useState(false);

  if (!proposal) return null;

  const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain;
  const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (proposal.votes.no / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (proposal.votes.abstain / totalVotes) * 100 : 0;

  const pieData = [
    { name: 'Yes', value: proposal.votes.yes, color: 'var(--dao-success)' },
    { name: 'No', value: proposal.votes.no, color: 'var(--dao-error)' },
    { name: 'Abstain', value: proposal.votes.abstain, color: 'var(--dao-foreground)' }
  ];

  const barData = [
    { name: 'Yes', votes: proposal.votes.yes, percentage: yesPercentage },
    { name: 'No', votes: proposal.votes.no, percentage: noPercentage },
    { name: 'Abstain', votes: proposal.votes.abstain, percentage: abstainPercentage }
  ];

  const quorumReached = proposal.participationRate >= 60; // Assuming 60% quorum threshold
  const proposalPassed = yesPercentage > 50 && quorumReached;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold dao-text-gradient">Voting Results</h1>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            {proposal.title}
          </p>
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Result Status */}
        <div className="dao-card p-6 text-center">
          <div className="text-6xl mb-4">
            {proposalPassed ? '✅' : '❌'}
          </div>
          <h3 className="text-2xl font-bold mb-2" 
              style={{color: proposalPassed ? 'var(--dao-success)' : 'var(--dao-error)'}}>
            {proposalPassed ? 'PASSED' : 'FAILED'}
          </h3>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            {proposalPassed ? 
              'Proposal approved by the community' : 
              quorumReached ? 'Proposal rejected by majority vote' : 'Quorum not reached'}
          </p>
        </div>

        {/* Vote Breakdown */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--dao-foreground)'}}>
            <BarChart3 className="w-5 h-5 mr-2" />
            Vote Breakdown
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
                <span style={{color: 'var(--dao-foreground)'}}>Yes</span>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{color: 'var(--dao-success)'}}>
                  {proposal.votes.yes.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {yesPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-error)'}}></div>
                <span style={{color: 'var(--dao-foreground)'}}>No</span>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{color: 'var(--dao-error)'}}>
                  {proposal.votes.no.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {noPercentage.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full opacity-50" style={{backgroundColor: 'var(--dao-foreground)'}}></div>
                <span style={{color: 'var(--dao-foreground)'}}>Abstain</span>
              </div>
              <div className="text-right">
                <div className="font-bold opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {proposal.votes.abstain.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {abstainPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participation Stats */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--dao-foreground)'}}>
            <Users className="w-5 h-5 mr-2" />
            Participation
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{color: 'var(--dao-foreground)'}}>Total Votes</span>
                <span className="font-bold" style={{color: 'var(--dao-foreground)'}}>
                  {totalVotes.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span style={{color: 'var(--dao-foreground)'}}>Participation Rate</span>
                <span className="font-bold" style={{color: quorumReached ? 'var(--dao-success)' : 'var(--dao-warning)'}}>
                  {proposal.participationRate}%
                </span>
              </div>
              <Progress 
                value={proposal.participationRate} 
                className="h-2"
              />
              <div className="text-xs mt-1 opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Quorum: 60% {quorumReached ? '✓' : '✗'}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span style={{color: 'var(--dao-foreground)'}}>Voting Period</span>
              <span className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                7 days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-6" style={{color: 'var(--dao-foreground)'}}>
            Vote Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--dao-card)',
                    borderColor: 'var(--dao-border)',
                    borderRadius: '12px',
                    color: 'var(--dao-foreground)'
                  }}
                />
                <Legend 
                  wrapperStyle={{color: 'var(--dao-foreground)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-6" style={{color: 'var(--dao-foreground)'}}>
            Vote Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--dao-border)" />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: 'var(--dao-foreground)'}}
                  axisLine={{stroke: 'var(--dao-border)'}}
                />
                <YAxis 
                  tick={{fill: 'var(--dao-foreground)'}}
                  axisLine={{stroke: 'var(--dao-border)'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--dao-card)',
                    borderColor: 'var(--dao-border)',
                    borderRadius: '12px',
                    color: 'var(--dao-foreground)'
                  }}
                />
                <Bar dataKey="votes" fill="var(--dao-accent-blue)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Merkle Root */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--dao-foreground)'}}>
            <CheckCircle className="w-5 h-5 mr-2" />
            Verification Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Merkle Root
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 p-3 rounded-lg text-xs font-mono break-all"
                      style={{backgroundColor: 'var(--dao-background)', color: 'var(--dao-foreground)'}}>
                  {proposal.merkleRoot || '0x4f8b2a7c3d9e1f6a8b5c2d7e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f6g7h8'}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(proposal.merkleRoot || '0x4f8b2a7c3d9e1f...')}
                  className="rounded-lg shrink-0"
                  style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span style={{color: 'var(--dao-foreground)'}}>ZK Proofs Verified</span>
              <Badge className="rounded-lg" style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
                {totalVotes.toLocaleString()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span style={{color: 'var(--dao-foreground)'}}>Privacy Preserved</span>
              <Badge className="rounded-lg" style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
                100%
              </Badge>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full mt-4 rounded-xl"
                style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View ZK Proof Details
              </Button>
            </DialogTrigger>
            <DialogContent className="dao-card border-0 max-w-2xl">
              <DialogHeader>
                <DialogTitle style={{color: 'var(--dao-foreground)'}}>
                  Zero-Knowledge Proof Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{color: 'var(--dao-foreground)'}}>
                    Proof Verification
                  </h4>
                  <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    All votes were verified using ZK-SNARKs to ensure validity without revealing voter identity or choice during the commit phase.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{color: 'var(--dao-foreground)'}}>
                    Privacy Guarantees
                  </h4>
                  <ul className="text-sm opacity-70 space-y-1" style={{color: 'var(--dao-foreground)'}}>
                    <li>• Vote secrecy maintained during commit phase</li>
                    <li>• Voter anonymity preserved in final tally</li>
                    <li>• No correlation between voter identity and vote choice</li>
                    <li>• Cryptographic proof of vote validity</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Timeline */}
        <div className="dao-card p-6">
          <h3 className="font-semibold mb-4 flex items-center" style={{color: 'var(--dao-foreground)'}}>
            <Calendar className="w-5 h-5 mr-2" />
            Voting Timeline
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
              <div className="flex-1">
                <div className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                  Proposal Created
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {formatDate(new Date(proposal.deadline.getTime() - 7 * 24 * 60 * 60 * 1000))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
              <div className="flex-1">
                <div className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                  Commit Phase Started
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {formatDate(new Date(proposal.deadline.getTime() - 5 * 24 * 60 * 60 * 1000))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
              <div className="flex-1">
                <div className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                  Reveal Phase Started
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {formatDate(new Date(proposal.deadline.getTime() - 2 * 24 * 60 * 60 * 1000))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
              <div className="flex-1">
                <div className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                  Voting Ended
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {formatDate(proposal.deadline)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Execute Proposal */}
      {proposalPassed && (
        <div className="dao-card p-6 text-center">
          <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
            Proposal Ready for Execution
          </h3>
          <p className="opacity-70 mb-6" style={{color: 'var(--dao-foreground)'}}>
            The proposal has passed and can now be executed to implement the changes.
          </p>
          <Button className="dao-gradient-blue text-white rounded-xl px-8 py-3">
            <TrendingUp className="w-5 h-5 mr-2" />
            Execute Proposal
          </Button>
        </div>
      )}
    </div>
  );
}