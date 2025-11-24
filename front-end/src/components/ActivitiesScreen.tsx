import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  Download,
  Clock,
  Users,
  Activity,
  PieChart,
  Lock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useDAO } from './DAOProvider';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

interface ActivitiesScreenProps {
  onBack: () => void;
}

export function ActivitiesScreen({ onBack }: ActivitiesScreenProps) {
  const { wallet, isGuestMode, proposals } = useDAO();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // If in guest mode or no wallet, show restricted access message
  if (isGuestMode || !wallet) {
    return (
      <div className="min-h-screen" style={{backgroundColor: 'var(--dao-background)'}}>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="p-2 rounded-xl"
                style={{color: 'var(--dao-foreground)'}}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold dao-text-gradient">Activities & History</h1>
                <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Your personal voting dashboard and analytics
                </p>
              </div>
            </div>
          </div>

          {/* Restricted Access Message */}
          <Card className="dao-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full dao-gradient-blue mx-auto mb-6 flex items-center justify-center opacity-20">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
                Connect Wallet to View Activities
              </h2>
              <p className="text-lg opacity-70 mb-6" style={{color: 'var(--dao-foreground)'}}>
                {isGuestMode 
                  ? 'Your voting history and personal analytics are only available with a connected wallet for privacy and security.'
                  : 'Connect your wallet to view your personal voting dashboard, activity timeline, and participation analytics.'
                }
              </p>
              <div className="space-y-3 text-sm opacity-60" style={{color: 'var(--dao-foreground)'}}>
                <p>• Personal voting history</p>
                <p>• Vote distribution analytics</p>
                <p>• Participation rate tracking</p>
                <p>• Activity timeline</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Mock user voting data - in real app this would come from backend
  const userVotingHistory = [
    {
      proposalId: '1',
      proposalTitle: 'Increase Validator Rewards',
      vote: 'Yes',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'Closed',
      result: 'Passed'
    },
    {
      proposalId: '2',
      proposalTitle: 'Treasury Fund Allocation for Development',
      vote: 'Yes',
      timestamp: '2024-01-10T14:20:00Z',
      status: 'Closed',
      result: 'Passed'
    },
    {
      proposalId: '3',
      proposalTitle: 'Protocol Upgrade v2.1',
      vote: 'No',
      timestamp: '2024-01-05T09:15:00Z',
      status: 'Closed',
      result: 'Failed'
    },
    {
      proposalId: '4',
      proposalTitle: 'Community Grant Program',
      vote: 'Yes',
      timestamp: '2024-01-20T16:45:00Z',
      status: 'Ongoing',
      result: 'Pending'
    },
    {
      proposalId: '5',
      proposalTitle: 'Staking Mechanism Update',
      vote: 'Abstain',
      timestamp: '2023-12-28T11:30:00Z',
      status: 'Closed',
      result: 'Passed'
    }
  ];

  // Calculate statistics
  const totalVotes = userVotingHistory.length;
  const totalProposals = proposals.length;
  const participationRate = totalProposals > 0 ? Math.round((totalVotes / totalProposals) * 100) : 0;

  const voteDistribution = {
    yes: userVotingHistory.filter(v => v.vote === 'Yes').length,
    no: userVotingHistory.filter(v => v.vote === 'No').length,
    abstain: userVotingHistory.filter(v => v.vote === 'Abstain').length
  };

  // Pie chart data
  const pieData = [
    { name: 'Yes', value: voteDistribution.yes, color: 'var(--dao-success)' },
    { name: 'No', value: voteDistribution.no, color: 'var(--dao-error)' },
    { name: 'Abstain', value: voteDistribution.abstain, color: 'var(--dao-warning)' }
  ].filter(item => item.value > 0);

  // Line chart data (mock monthly activity)
  const activityData = [
    { month: 'Oct', votes: 2 },
    { month: 'Nov', votes: 1 },
    { month: 'Dec', votes: 1 },
    { month: 'Jan', votes: 4 },
    { month: 'Feb', votes: 0 },
    { month: 'Mar', votes: 0 }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case 'Yes':
        return <CheckCircle className="w-4 h-4" style={{color: 'var(--dao-success)'}} />;
      case 'No':
        return <XCircle className="w-4 h-4" style={{color: 'var(--dao-error)'}} />;
      case 'Abstain':
        return <MinusCircle className="w-4 h-4" style={{color: 'var(--dao-warning)'}} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, result: string) => {
    if (status === 'Ongoing') {
      return (
        <Badge className="rounded-full" style={{backgroundColor: 'var(--dao-accent-blue)', color: 'white'}}>
          <Clock className="w-3 h-3 mr-1" />
          Ongoing
        </Badge>
      );
    }
    return (
      <Badge 
        className="rounded-full" 
        style={{
          backgroundColor: result === 'Passed' ? 'var(--dao-success)' : 'var(--dao-error)',
          color: 'white'
        }}
      >
        {result}
      </Badge>
    );
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Proposal,Vote,Date,Status,Result\n"
      + userVotingHistory.map(item => 
          `"${item.proposalTitle}","${item.vote}","${formatDate(item.timestamp)}","${item.status}","${item.result}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "voting_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--dao-background)'}}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="p-2 rounded-xl"
              style={{color: 'var(--dao-foreground)'}}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold dao-text-gradient">Activities & History</h1>
              <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Your personal voting dashboard and analytics
              </p>
            </div>
          </div>
          <Button 
            onClick={handleExport}
            className="rounded-xl dao-gradient-blue text-white border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dao-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Wallet Address
                </p>
                <p className="font-mono font-medium" style={{color: 'var(--dao-foreground)'}}>
                  {wallet ? formatAddress(wallet.address) : 'Not connected'}
                </p>
              </div>
              <Activity className="w-8 h-8 opacity-50" style={{color: 'var(--dao-accent-blue)'}} />
            </div>
          </Card>

          <Card className="dao-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Total Votes Cast
                </p>
                <p className="text-2xl font-bold" style={{color: 'var(--dao-foreground)'}}>
                  {totalVotes}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-50" style={{color: 'var(--dao-success)'}} />
            </div>
          </Card>

          <Card className="dao-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Proposals Participated
                </p>
                <p className="text-2xl font-bold" style={{color: 'var(--dao-foreground)'}}>
                  {totalVotes}/{totalProposals}
                </p>
              </div>
              <Users className="w-8 h-8 opacity-50" style={{color: 'var(--dao-accent-purple)'}} />
            </div>
          </Card>

          <Card className="dao-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  Participation Rate
                </p>
                <p className="text-2xl font-bold" style={{color: 'var(--dao-success)'}}>
                  {participationRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-50" style={{color: 'var(--dao-success)'}} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Vote Distribution Pie Chart */}
          <Card className="dao-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{color: 'var(--dao-foreground)'}}>
                Vote Distribution
              </h2>
              <PieChart className="w-5 h-5 opacity-50" style={{color: 'var(--dao-foreground)'}} />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
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
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Voting Activity Over Time */}
          <Card className="dao-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{color: 'var(--dao-foreground)'}}>
                Voting Activity
              </h2>
              <div className="flex items-center space-x-2">
                {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className="rounded-lg capitalize"
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--dao-foreground)"
                    opacity={0.7}
                  />
                  <YAxis 
                    stroke="var(--dao-foreground)"
                    opacity={0.7}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--dao-card)',
                      border: '1px solid var(--dao-border)',
                      borderRadius: '12px',
                      color: 'var(--dao-foreground)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="votes" 
                    stroke="var(--dao-accent-blue)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--dao-accent-blue)', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Activities Timeline */}
        <Card className="dao-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{color: 'var(--dao-foreground)'}}>
              Voting History
            </h2>
            <Calendar className="w-5 h-5 opacity-50" style={{color: 'var(--dao-foreground)'}} />
          </div>
          
          <div className="space-y-4">
            {userVotingHistory.map((activity, index) => (
              <div key={activity.proposalId}>
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-opacity-50"
                     style={{backgroundColor: 'var(--dao-card-secondary)'}}>
                  <div className="flex-shrink-0 mt-1">
                    {getVoteIcon(activity.vote)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium mb-1" style={{color: 'var(--dao-foreground)'}}>
                          {activity.proposalTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm opacity-70">
                          <span style={{color: 'var(--dao-foreground)'}}>
                            Vote: <span className="font-medium">{activity.vote}</span>
                          </span>
                          <span style={{color: 'var(--dao-foreground)'}}>
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(activity.status, activity.result)}
                      </div>
                    </div>
                  </div>
                </div>
                {index < userVotingHistory.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>

          {userVotingHistory.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" style={{color: 'var(--dao-foreground)'}} />
              <p className="text-lg opacity-70" style={{color: 'var(--dao-foreground)'}}>
                No voting history yet
              </p>
              <p className="text-sm opacity-50" style={{color: 'var(--dao-foreground)'}}>
                Start participating in DAO governance to see your activity here
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}