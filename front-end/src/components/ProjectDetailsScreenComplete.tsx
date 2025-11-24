import React, { useState } from 'react';
import { ArrowLeft, Users, Vote, Eye, Calendar, Globe, Lock, ExternalLink, MessageCircle, Star, Share2, Bell, BarChart3, TrendingUp, Activity, FileText, Coins } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Chart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDAO } from './DAOProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import vietCardanoLogo from '../assets/f9fb9d7e6a371661d7790f3c05ed29936615536c.png';
import vtechcomLogo from '../assets/19e3ee003cfb6111a0a470c6e8c25bdf3d23526d.png';

interface ProjectDetailsScreenProps {
  projectId: string;
  onBack: () => void;
  onNavigate: (screen: string, proposalId?: string) => void;
}

// Mock activity data for analytics
const generateActivityData = (memberCount: number) => {
  const data = [];
  const baseActivity = Math.floor(memberCount * 0.1);
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
    const activity = Math.floor(baseActivity * variation);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      members: activity,
      proposals: Math.floor(activity * 0.1),
      votes: Math.floor(activity * 0.8)
    });
  }
  return data;
};

const projectDetails = {
  'viet-cardano-community': {
    name: 'Viet Cardano Community',
    description: 'The official Vietnamese Cardano community focused on education, development, and ecosystem growth in Vietnam.',
    longDescription: 'Viet Cardano Community (VCC) is the leading Vietnamese community for Cardano blockchain enthusiasts. We focus on educating Vietnamese developers and users about Cardano technology, fostering local development projects, and building bridges between the Vietnamese tech community and the global Cardano ecosystem. Our mission is to accelerate Cardano adoption in Vietnam through education, community building, and innovative projects.',
    type: 'public',
    category: 'social',
    memberCount: 5247,
    proposalCount: 42,
    activeVotes: 8,
    createdAt: '2023-06-15',
    creator: 'viet_cardano_team',
    website: 'https://vietcardano.com',
    discord: 'https://discord.gg/vietcardano',
    twitter: 'https://twitter.com/vietcardano',
    github: 'https://github.com/vietcardano',
    logo: vietCardanoLogo,
    totalProjectsFunded: 15,
    communityMembers: '5,200+',
    proposals: [
      {
        id: 'vcc-001',
        title: 'Launch Cardano Developer Bootcamp in Ho Chi Minh City',
        status: 'active',
        endDate: '2024-03-25',
        yesVotes: 3456,
        noVotes: 234,
        totalVotes: 3690
      },
      {
        id: 'vcc-002',
        title: 'Fund Vietnamese Cardano Documentation Project',
        status: 'active',
        endDate: '2024-03-28',
        yesVotes: 4123,
        noVotes: 156,
        totalVotes: 4279
      }
    ]
  },
  'vtechcom-lab': {
    name: 'Vtechcom Lab',
    description: 'Advanced blockchain research and development laboratory focusing on privacy technologies and DeFi innovation.',
    longDescription: 'Vtechcom Lab is a cutting-edge blockchain research and development laboratory specializing in privacy-preserving technologies, DeFi protocols, and scalable blockchain solutions. Our team of researchers and developers work on innovative projects that push the boundaries of what\'s possible in decentralized finance and privacy technology. We collaborate with universities, open-source communities, and industry partners to advance blockchain technology.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 1876,
    proposalCount: 28,
    activeVotes: 6,
    createdAt: '2023-08-20',
    creator: 'vtechcom_research',
    website: 'https://vtechcom.io',
    discord: 'https://discord.gg/vtechcom',
    twitter: 'https://twitter.com/vtechcom',
    github: 'https://github.com/vtechcom',
    logo: vtechcomLogo,
    researchPapers: 12,
    protocolsBuilt: 8,
    proposals: [
      {
        id: 'vtc-001',
        title: 'Privacy-Preserving AMM Protocol Development',
        status: 'active',
        endDate: '2024-03-30',
        yesVotes: 1456,
        noVotes: 123,
        totalVotes: 1579
      },
      {
        id: 'vtc-002',
        title: 'Zero-Knowledge Proof Library for Cardano',
        status: 'active',
        endDate: '2024-04-02',
        yesVotes: 1723,
        noVotes: 89,
        totalVotes: 1812
      }
    ]
  },
  'defi-vault-protocol': {
    name: 'DeFi Vault Protocol',
    description: 'A decentralized vault protocol for yield farming and liquidity provision with advanced privacy features.',
    longDescription: 'DeFi Vault Protocol is a revolutionary decentralized finance platform that combines yield farming, liquidity provision, and advanced privacy features. Our protocol enables users to maximize their returns while maintaining complete anonymity through zero-knowledge proofs and privacy-preserving smart contracts.',
    type: 'public',
    category: 'defi',
    memberCount: 1247,
    proposalCount: 23,
    activeVotes: 3,
    createdAt: '2024-01-15',
    creator: 'vault_dao_team',
    website: 'https://defivault.protocol',
    discord: 'https://discord.gg/defivault',
    twitter: 'https://twitter.com/defivault',
    github: 'https://github.com/defivault',
    totalValueLocked: '$12.4M',
    averageApy: '24.5%',
    proposals: [
      {
        id: 'dvp-001',
        title: 'Increase Vault Rewards by 15%',
        status: 'active',
        endDate: '2024-03-15',
        yesVotes: 845,
        noVotes: 123,
        totalVotes: 968
      },
      {
        id: 'dvp-002',
        title: 'Add Support for New Token Pairs',
        status: 'active',
        endDate: '2024-03-18',
        yesVotes: 1205,
        noVotes: 89,
        totalVotes: 1294
      },
      {
        id: 'dvp-003',
        title: 'Treasury Allocation for Security Audit',
        status: 'active',
        endDate: '2024-03-20',
        yesVotes: 756,
        noVotes: 234,
        totalVotes: 990
      }
    ]
  },
  'nft-community-hub': {
    name: 'NFT Community Hub',
    description: 'Community-driven marketplace and governance for NFT creators and collectors.',
    longDescription: 'NFT Community Hub is a decentralized platform that empowers NFT creators and collectors through community governance. We provide tools for creation, trading, and community management while ensuring fair compensation for artists and transparent marketplace operations.',
    type: 'public',
    category: 'nft',
    memberCount: 892,
    proposalCount: 18,
    activeVotes: 2,
    createdAt: '2024-02-03',
    creator: 'nft_collective',
    website: 'https://nftcommunityhub.io',
    discord: 'https://discord.gg/nftcommunity',
    twitter: 'https://twitter.com/nftcommunity',
    github: 'https://github.com/nftcommunityhub',
    totalTradingVolume: '$2.8M',
    creatorRoyalties: '7.5%',
    proposals: [
      {
        id: 'nch-001',
        title: 'Reduce Marketplace Fees to 2%',
        status: 'active',
        endDate: '2024-03-16',
        yesVotes: 567,
        noVotes: 145,
        totalVotes: 712
      },
      {
        id: 'nch-002',
        title: 'Launch Creator Grant Program',
        status: 'active',
        endDate: '2024-03-19',
        yesVotes: 723,
        noVotes: 67,
        totalVotes: 790
      }
    ]
  },
  'gaming-guild-alliance': {
    name: 'Gaming Guild Alliance',
    description: 'Cross-game guild coordination and reward distribution platform.',
    longDescription: 'Gaming Guild Alliance brings together gaming guilds from multiple games to coordinate strategies, share resources, and distribute rewards fairly. Our platform enables seamless cross-game collaboration and transparent reward distribution through on-chain governance.',
    type: 'private',
    category: 'gaming',
    memberCount: 567,
    proposalCount: 31,
    activeVotes: 5,
    createdAt: '2024-01-28',
    creator: 'guild_masters',
    website: 'https://gamingguildalliance.gg',
    discord: 'https://discord.gg/gamealliance',
    twitter: 'https://twitter.com/gamealliance',
    totalRewardsDistributed: '$450K',
    activeGames: 12,
    proposals: [
      {
        id: 'gga-001',
        title: 'Add Support for New Game: CyberRealm',
        status: 'active',
        endDate: '2024-03-17',
        yesVotes: 334,
        noVotes: 89,
        totalVotes: 423
      },
      {
        id: 'gga-002',
        title: 'Increase Guild Tournament Prize Pool',
        status: 'active',
        endDate: '2024-03-21',
        yesVotes: 445,
        noVotes: 67,
        totalVotes: 512
      },
      {
        id: 'gga-003',
        title: 'New Reward Distribution Model',
        status: 'active',
        endDate: '2024-03-22',
        yesVotes: 287,
        noVotes: 123,
        totalVotes: 410
      }
    ]
  },
  'privacy-research-dao': {
    name: 'Privacy Research DAO',
    description: 'Research funding and coordination for privacy-preserving technologies.',
    longDescription: 'Privacy Research DAO is dedicated to advancing privacy-preserving technologies through community-funded research initiatives. We support researchers, developers, and academics working on zero-knowledge proofs, homomorphic encryption, and other privacy technologies.',
    type: 'public',
    category: 'dao',
    memberCount: 2134,
    proposalCount: 45,
    activeVotes: 7,
    createdAt: '2024-01-08',
    creator: 'privacy_advocates',
    website: 'https://privacyresearch.dao',
    discord: 'https://discord.gg/privacyresearch',
    twitter: 'https://twitter.com/privacyresearch',
    github: 'https://github.com/privacyresearchdao',
    totalFundingAllocated: '$1.2M',
    activeResearchProjects: 15,
    proposals: [
      {
        id: 'prd-001',
        title: 'Fund ZK-SNARK Optimization Research',
        status: 'active',
        endDate: '2024-03-25',
        yesVotes: 1456,
        noVotes: 234,
        totalVotes: 1690
      },
      {
        id: 'prd-002',
        title: 'Establish University Partnership Program',
        status: 'active',
        endDate: '2024-03-28',
        yesVotes: 1789,
        noVotes: 123,
        totalVotes: 1912
      }
    ]
  },
  'infrastructure-builders': {
    name: 'Infrastructure Builders',
    description: 'Decentralized infrastructure development and maintenance collective.',
    longDescription: 'Infrastructure Builders is a collective of developers and engineers focused on building and maintaining critical decentralized infrastructure. We work on protocols, tools, and services that power the decentralized web, ensuring reliability, security, and scalability.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 1456,
    proposalCount: 39,
    activeVotes: 4,
    createdAt: '2024-02-12',
    creator: 'infra_devs',
    website: 'https://infrabuilders.dev',
    discord: 'https://discord.gg/infrabuilders',
    twitter: 'https://twitter.com/infrabuilders',
    github: 'https://github.com/infrabuilders',
    nodesOperating: 156,
    uptimePercentage: '99.8%',
    proposals: [
      {
        id: 'ib-001',
        title: 'Upgrade Node Infrastructure',
        status: 'active',
        endDate: '2024-03-30',
        yesVotes: 989,
        noVotes: 167,
        totalVotes: 1156
      },
      {
        id: 'ib-002',
        title: 'Launch Developer Grant Program',
        status: 'active',
        endDate: '2024-04-02',
        yesVotes: 1123,
        noVotes: 89,
        totalVotes: 1212
      }
    ]
  }
};

export function ProjectDetailsScreen({ projectId, onBack, onNavigate }: ProjectDetailsScreenProps) {
  const { isGuestMode } = useDAO();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  const project = projectDetails[projectId as keyof typeof projectDetails];

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dao-text-gradient">Project Not Found</h2>
          <p className="opacity-70 mb-6" style={{ color: 'var(--dao-foreground)' }}>
            This project doesn't have detailed information available yet.
          </p>
          <Button onClick={onBack} className="rounded-xl dao-gradient-blue text-white border-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'defi': return 'ðŸ’°';
      case 'nft': return 'ðŸŽ¨';
      case 'gaming': return 'ðŸŽ®';
      case 'dao': return 'ðŸ›ï¸';
      case 'infrastructure': return 'âš¡';
      case 'social': return 'ðŸŒ';
      default: return 'ðŸ“‹';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'defi': return 'var(--dao-accent-blue)';
      case 'nft': return 'var(--dao-accent-purple)';
      case 'gaming': return 'var(--dao-success)';
      case 'dao': return 'var(--dao-warning)';
      case 'infrastructure': return 'var(--dao-error)';
      case 'social': return 'var(--dao-accent-blue)';
      default: return 'var(--dao-foreground)';
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 rounded-xl"
              style={{ color: 'var(--dao-foreground)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-3xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: `${getCategoryColor(project.category)}15` }}
              >
                {(project as any).logo ? (
                  <ImageWithFallback
                    src={(project as any).logo}
                    alt={`${project.name} logo`}
                    className="w-14 h-14 object-contain"
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${getCategoryColor(project.category)}15` }}
                  >
                    {getCategoryIcon(project.category)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold dao-text-gradient">{project.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge
                    className="text-sm rounded-full px-3 py-1"
                    style={{
                      backgroundColor: getCategoryColor(project.category),
                      color: 'white'
                    }}
                  >
                    {project.category.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {project.type === 'private' ? (
                      <Lock className="w-4 h-4" style={{ color: 'var(--dao-warning)' }} />
                    ) : (
                      <Globe className="w-4 h-4" style={{ color: 'var(--dao-success)' }} />
                    )}
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      {project.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isGuestMode && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsFollowing(!isFollowing)}
                className="rounded-xl"
                style={{
                  borderColor: isFollowing ? 'var(--dao-success)' : 'var(--dao-border)',
                  backgroundColor: isFollowing ? 'var(--dao-success)' : 'transparent',
                  color: isFollowing ? 'white' : 'var(--dao-foreground)'
                }}
              >
                {isFollowing ? (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button variant="outline" className="rounded-xl p-2">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="dao-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
              <span className="text-2xl font-bold dao-text-gradient">
                {project.memberCount.toLocaleString()}
              </span>
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Members
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Vote className="w-5 h-5" style={{ color: 'var(--dao-accent-purple)' }} />
              <span className="text-2xl font-bold dao-text-gradient">
                {project.proposalCount}
              </span>
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Proposals
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Eye className="w-5 h-5" style={{ color: 'var(--dao-success)' }} />
              <span className="text-2xl font-bold dao-text-gradient">
                {project.activeVotes}
              </span>
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Active Votes
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5" style={{ color: 'var(--dao-warning)' }} />
              <span className="text-2xl font-bold dao-text-gradient">
                {Math.floor(project.memberCount * 0.15)}
              </span>
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Active Today
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Basic Information */}
            {project.type === 'public' && (
              <div className="dao-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                    Project Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Project Name
                      </label>
                      <div className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                        {project.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Category
                      </label>
                      <div className="flex items-center space-x-2">
                        <span>{getCategoryIcon(project.category)}</span>
                        <span className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>
                          {project.category}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Project Type
                      </label>
                      <div className="flex items-center space-x-2">
                        {project.type === 'private' ? (
                          <Lock className="w-4 h-4" style={{ color: 'var(--dao-warning)' }} />
                        ) : (
                          <Globe className="w-4 h-4" style={{ color: 'var(--dao-success)' }} />
                        )}
                        <span className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>
                          {project.type}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Created By
                      </label>
                      <div className="font-medium font-mono text-sm" style={{ color: 'var(--dao-foreground)' }}>
                        {project.creator}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Created Date
                      </label>
                      <div className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                        {new Date(project.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Governance Token
                      </label>
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4" style={{ color: 'var(--dao-accent-blue)' }} />
                        <span className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                          WADA
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Who can create proposals
                      </label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dao-accent-blue)' }}></div>
                          <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>
                            Governance Token Holders
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dao-accent-purple)' }}></div>
                          <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>
                            Whitelist
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium opacity-70 mb-1" style={{ color: 'var(--dao-foreground)' }}>
                        Voting Types
                      </label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dao-success)' }}></div>
                          <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>
                            Simple Majority (>50%)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dao-warning)' }}></div>
                          <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>
                            Token-Weighted Voting
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                About {project.name}
              </h3>
              <p className="opacity-80 leading-relaxed" style={{ color: 'var(--dao-foreground)' }}>
                {project.longDescription}
              </p>
            </div>

            {/* Additional content would continue here */}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Active Proposals
              </h3>
              <p style={{ color: 'var(--dao-foreground)' }}>
                Proposal details would be displayed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Community
              </h3>
              <p style={{ color: 'var(--dao-foreground)' }}>
                Community details would be displayed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Links & Resources
              </h3>
              <div className="space-y-4">
                {project.website && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                    <a href={project.website} target="_blank" rel="noopener noreferrer" 
                       className="hover:underline" style={{ color: 'var(--dao-foreground)' }}>
                      Website
                    </a>
                  </div>
                )}
                {project.discord && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5" style={{ color: 'var(--dao-accent-purple)' }} />
                    <a href={project.discord} target="_blank" rel="noopener noreferrer" 
                       className="hover:underline" style={{ color: 'var(--dao-foreground)' }}>
                      Discord
                    </a>
                  </div>
                )}
                {project.twitter && (
                  <div className="flex items-center space-x-3">
                    <Share2 className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                    <a href={project.twitter} target="_blank" rel="noopener noreferrer" 
                       className="hover:underline" style={{ color: 'var(--dao-foreground)' }}>
                      Twitter
                    </a>
                  </div>
                )}
                {project.github && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" style={{ color: 'var(--dao-foreground)' }} />
                    <a href={project.github} target="_blank" rel="noopener noreferrer" 
                       className="hover:underline" style={{ color: 'var(--dao-foreground)' }}>
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
