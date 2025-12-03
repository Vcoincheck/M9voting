import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, Vote, Eye, Calendar, Globe, Lock, ExternalLink, MessageCircle, Star, Share2, Bell, BarChart3, TrendingUp, Activity, FileText, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useDAO } from '../../components/context';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import vietCardanoLogo from '../../assets/vietCardanoLogo.png';
import vtechcomLogo from '../../assets/vtechcomLogo.png';
import { useAppNavigation } from '../../hooks';

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
        description: 'A comprehensive 8-week bootcamp program to train Vietnamese developers in Cardano blockchain development, smart contracts, and DApp creation. The program will include hands-on projects, mentorship, and job placement assistance.',
        status: 'active',
        endDate: '2024-03-25',
        yesVotes: 3456,
        noVotes: 234,
        totalVotes: 3690,
        fundingAmount: 45000,
        fundingCurrency: 'ADA',
        proposedBy: 'viet_cardano_team',
        category: 'Education',
        votingDeadline: '2024-03-25T23:59:59Z',
        executionPeriod: '12 weeks'
      },
      {
        id: 'vcc-002',
        title: 'Fund Vietnamese Cardano Documentation Project',
        description: 'Create comprehensive Vietnamese language documentation for Cardano development tools, including tutorials, API references, and best practices guides. This will make Cardano development more accessible to Vietnamese developers.',
        status: 'active',
        endDate: '2024-03-28',
        yesVotes: 4123,
        noVotes: 156,
        totalVotes: 4279,
        fundingAmount: 25000,
        fundingCurrency: 'ADA',
        proposedBy: 'doc_team_vn',
        category: 'Documentation',
        votingDeadline: '2024-03-28T23:59:59Z',
        executionPeriod: '16 weeks'
      },
      {
        id: 'vcc-003',
        title: 'Establish Cardano Research Lab in Vietnam',
        description: 'Set up a dedicated research facility in Vietnam focusing on blockchain scalability, privacy technologies, and DeFi innovations. The lab will collaborate with local universities and international research institutions.',
        status: 'completed',
        endDate: '2024-02-15',
        yesVotes: 5234,
        noVotes: 456,
        totalVotes: 5690,
        fundingAmount: 125000,
        fundingCurrency: 'ADA',
        proposedBy: 'research_collective',
        category: 'Research',
        votingDeadline: '2024-02-15T23:59:59Z',
        executionPeriod: '26 weeks',
        result: 'passed'
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
        description: 'Develop a cutting-edge Automated Market Maker (AMM) protocol that preserves user privacy through zero-knowledge proofs while maintaining high performance and capital efficiency.',
        status: 'active',
        endDate: '2024-03-30',
        yesVotes: 1456,
        noVotes: 123,
        totalVotes: 1579,
        fundingAmount: 180000,
        fundingCurrency: 'ADA',
        proposedBy: 'vtechcom_research',
        category: 'Protocol Development',
        votingDeadline: '2024-03-30T23:59:59Z',
        executionPeriod: '20 weeks'
      },
      {
        id: 'vtc-002',
        title: 'Zero-Knowledge Proof Library for Cardano',
        description: 'Create a comprehensive, optimized library of zero-knowledge proof implementations specifically designed for the Cardano ecosystem, including SNARK and STARK variants.',
        status: 'active',
        endDate: '2024-04-02',
        yesVotes: 1723,
        noVotes: 89,
        totalVotes: 1812,
        fundingAmount: 95000,
        fundingCurrency: 'ADA',
        proposedBy: 'zk_specialists',
        category: 'Infrastructure',
        votingDeadline: '2024-04-02T23:59:59Z',
        executionPeriod: '14 weeks'
      },
      {
        id: 'vtc-003',
        title: 'Privacy-First DeFi Analytics Platform',
        description: 'Build an analytics platform that provides insights into DeFi activities while preserving user privacy through advanced cryptographic techniques and selective disclosure.',
        status: 'completed',
        endDate: '2024-01-20',
        yesVotes: 1634,
        noVotes: 234,
        totalVotes: 1868,
        fundingAmount: 75000,
        fundingCurrency: 'ADA',
        proposedBy: 'analytics_team',
        category: 'Analytics',
        votingDeadline: '2024-01-20T23:59:59Z',
        executionPeriod: '18 weeks',
        result: 'passed'
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
        description: 'Propose to increase the base reward rate for all DeFi vaults by 15% to remain competitive with other protocols and attract more liquidity providers to the platform.',
        status: 'active',
        endDate: '2024-03-15',
        yesVotes: 845,
        noVotes: 123,
        totalVotes: 968,
        fundingAmount: 0,
        fundingCurrency: 'N/A',
        proposedBy: 'vault_dao_team',
        category: 'Protocol Parameter',
        votingDeadline: '2024-03-15T23:59:59Z',
        executionPeriod: 'Immediate'
      },
      {
        id: 'dvp-002',
        title: 'Add Support for New Token Pairs',
        description: 'Integrate support for 8 new high-volume token pairs including ADA/USDC, ADA/USDT, and emerging DeFi tokens to expand our liquidity options and attract more users.',
        status: 'active',
        endDate: '2024-03-18',
        yesVotes: 1205,
        noVotes: 89,
        totalVotes: 1294,
        fundingAmount: 35000,
        fundingCurrency: 'ADA',
        proposedBy: 'integration_team',
        category: 'Protocol Upgrade',
        votingDeadline: '2024-03-18T23:59:59Z',
        executionPeriod: '8 weeks'
      },
      {
        id: 'dvp-003',
        title: 'Treasury Allocation for Security Audit',
        description: 'Allocate treasury funds for a comprehensive security audit by a top-tier auditing firm to ensure the safety of user funds and protocol integrity before the next major upgrade.',
        status: 'active',
        endDate: '2024-03-20',
        yesVotes: 756,
        noVotes: 234,
        totalVotes: 990,
        fundingAmount: 85000,
        fundingCurrency: 'ADA',
        proposedBy: 'security_committee',
        category: 'Security',
        votingDeadline: '2024-03-20T23:59:59Z',
        executionPeriod: '6 weeks'
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
        description: 'Lower the marketplace transaction fee from 2.5% to 2% to attract more traders and increase trading volume while maintaining sustainable revenue for platform development.',
        status: 'active',
        endDate: '2024-03-16',
        yesVotes: 567,
        noVotes: 145,
        totalVotes: 712,
        fundingAmount: 0,
        fundingCurrency: 'N/A',
        proposedBy: 'nft_collective',
        category: 'Platform Parameter',
        votingDeadline: '2024-03-16T23:59:59Z',
        executionPeriod: 'Immediate'
      },
      {
        id: 'nch-002',
        title: 'Launch Creator Grant Program',
        description: 'Establish a monthly grant program to support emerging NFT artists with funding, mentorship, and marketing support to help them succeed on our platform.',
        status: 'active',
        endDate: '2024-03-19',
        yesVotes: 723,
        noVotes: 67,
        totalVotes: 790,
        fundingAmount: 50000,
        fundingCurrency: 'ADA',
        proposedBy: 'creator_advocates',
        category: 'Community Program',
        votingDeadline: '2024-03-19T23:59:59Z',
        executionPeriod: '4 weeks'
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
        description: 'Integrate CyberRealm into our guild alliance system, allowing members to participate in coordinated gameplay and earn rewards through our established distribution mechanisms.',
        status: 'active',
        endDate: '2024-03-17',
        yesVotes: 334,
        noVotes: 89,
        totalVotes: 423,
        fundingAmount: 15000,
        fundingCurrency: 'ADA',
        proposedBy: 'guild_masters',
        category: 'Game Integration',
        votingDeadline: '2024-03-17T23:59:59Z',
        executionPeriod: '6 weeks'
      },
      {
        id: 'gga-002',
        title: 'Increase Guild Tournament Prize Pool',
        description: 'Raise the monthly tournament prize pool by 40% to incentivize higher participation and attract top-tier players to our alliance events.',
        status: 'active',
        endDate: '2024-03-21',
        yesVotes: 445,
        noVotes: 67,
        totalVotes: 512,
        fundingAmount: 25000,
        fundingCurrency: 'ADA',
        proposedBy: 'tournament_committee',
        category: 'Prize Pool',
        votingDeadline: '2024-03-21T23:59:59Z',
        executionPeriod: '2 weeks'
      },
      {
        id: 'gga-003',
        title: 'New Reward Distribution Model',
        description: 'Implement a performance-based reward system that factors in individual contribution, team coordination, and strategic leadership to create fairer compensation.',
        status: 'active',
        endDate: '2024-03-22',
        yesVotes: 287,
        noVotes: 123,
        totalVotes: 410,
        fundingAmount: 0,
        fundingCurrency: 'N/A',
        proposedBy: 'rewards_council',
        category: 'Reward System',
        votingDeadline: '2024-03-22T23:59:59Z',
        executionPeriod: '8 weeks'
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
        description: 'Support advanced research into optimizing ZK-SNARK constructions for better performance and reduced verification costs in blockchain applications.',
        status: 'active',
        endDate: '2024-03-25',
        yesVotes: 1456,
        noVotes: 234,
        totalVotes: 1690,
        fundingAmount: 150000,
        fundingCurrency: 'ADA',
        proposedBy: 'research_committee',
        category: 'Research Grant',
        votingDeadline: '2024-03-25T23:59:59Z',
        executionPeriod: '24 weeks'
      },
      {
        id: 'prd-002',
        title: 'Establish University Partnership Program',
        description: 'Create formal partnerships with leading universities to fund privacy research initiatives and provide internship opportunities for students.',
        status: 'active',
        endDate: '2024-03-28',
        yesVotes: 1789,
        noVotes: 123,
        totalVotes: 1912,
        fundingAmount: 200000,
        fundingCurrency: 'ADA',
        proposedBy: 'education_council',
        category: 'Partnership',
        votingDeadline: '2024-03-28T23:59:59Z',
        executionPeriod: '52 weeks'
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
        description: 'Modernize our validator nodes with latest hardware and software optimizations to improve network performance and reduce operational costs.',
        status: 'active',
        endDate: '2024-03-30',
        yesVotes: 989,
        noVotes: 167,
        totalVotes: 1156,
        fundingAmount: 125000,
        fundingCurrency: 'ADA',
        proposedBy: 'infra_devs',
        category: 'Infrastructure',
        votingDeadline: '2024-03-30T23:59:59Z',
        executionPeriod: '12 weeks'
      },
      {
        id: 'ib-002',
        title: 'Launch Developer Grant Program',
        description: 'Establish a grant program to fund open-source infrastructure tools and libraries that benefit the broader decentralized ecosystem.',
        status: 'active',
        endDate: '2024-04-02',
        yesVotes: 1123,
        noVotes: 89,
        totalVotes: 1212,
        fundingAmount: 75000,
        fundingCurrency: 'ADA',
        proposedBy: 'dev_community',
        category: 'Grant Program',
        votingDeadline: '2024-04-02T23:59:59Z',
        executionPeriod: '16 weeks'
      }
    ]
  }
};

export function ProjectDetailsPage() {
  const nav = useAppNavigation();
  const { projectId } = useParams();
  const { isGuestMode, tempProjects } = useDAO();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if it's a temporary project first
  let project;
  if (projectId && projectId.startsWith('temp_')) {
    const tempProject = tempProjects.find(p => p.id === projectId);
    if (tempProject) {
      // Convert temporary project to the expected format
      project = {
        ...tempProject,
        longDescription: tempProject.longDescription || tempProject.description,
        createdAt: tempProject.createdAt instanceof Date 
          ? tempProject.createdAt.toISOString().split('T')[0] 
          : tempProject.createdAt,
        proposals: [], // Temporary projects start with no proposals
        github: tempProject.github // Add github property if present
      };
    }
  } else {
    project = projectDetails[projectId as keyof typeof projectDetails];
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dao-text-gradient">Project Not Found</h2>
          <p className="opacity-70 mb-6" style={{ color: 'var(--dao-foreground)' }}>
            This project doesn't have detailed information available yet.
          </p>
          <Button onClick={() => nav.goBack()} className="rounded-xl dao-gradient-blue text-white border-0">
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
              onClick={() => nav.goBack()}
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

        {/* Temporary Project Notice */}
        {projectId?.startsWith('temp_') && (
          <div className="mb-6 p-4 rounded-xl border" 
               style={{ 
                 backgroundColor: 'var(--dao-accent-blue)15', 
                 borderColor: 'var(--dao-accent-blue)' 
               }}>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 animate-pulse" 
                   style={{ backgroundColor: 'var(--dao-accent-blue)' }}></div>
              <div className="flex-1">
                <h3 className="font-medium mb-1" style={{ color: 'var(--dao-foreground)' }}>
                  ðŸ†• Newly Created Project
                </h3>
                <p className="text-sm opacity-80" style={{ color: 'var(--dao-foreground)' }}>
                  This project was just created and is still in setup phase. Complete project information 
                  and proposals will be available after the page is refreshed or when the project is fully deployed.
                </p>
              </div>
            </div>
          </div>
        )}

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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
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
                        {project.type !== 'public' ? (
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
                            Simple Majority (50%+)
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
              <p className="opacity-80 leading-relaxed mb-6" style={{ color: 'var(--dao-foreground)' }}>
                {project.longDescription}
              </p>
              
              {/* External Links */}
              <div className="border-t pt-6" style={{ borderColor: 'var(--dao-border)' }}>
                <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                  External Links
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 rounded-xl transition-colors hover:bg-opacity-10 hover:bg-blue-500"
                      style={{ backgroundColor: 'var(--dao-card-secondary)' }}
                    >
                      <Globe className="w-4 h-4" style={{ color: 'var(--dao-accent-blue)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>Website</span>
                      <ExternalLink className="w-3 h-3 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    </a>
                  )}
                  {project.discord && (
                    <a
                      href={project.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 rounded-xl transition-colors hover:bg-opacity-10 hover:bg-purple-500"
                      style={{ backgroundColor: 'var(--dao-card-secondary)' }}
                    >
                      <MessageCircle className="w-4 h-4" style={{ color: 'var(--dao-accent-purple)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>Discord</span>
                      <ExternalLink className="w-3 h-3 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    </a>
                  )}
                  {project.twitter && (
                    <a
                      href={project.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 rounded-xl transition-colors hover:bg-opacity-10 hover:bg-blue-400"
                      style={{ backgroundColor: 'var(--dao-card-secondary)' }}
                    >
                      <Activity className="w-4 h-4" style={{ color: 'var(--dao-accent-blue)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>Twitter</span>
                      <ExternalLink className="w-3 h-3 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 rounded-xl transition-colors hover:bg-opacity-10 hover:bg-gray-600"
                      style={{ backgroundColor: 'var(--dao-card-secondary)' }}
                    >
                      <FileText className="w-4 h-4" style={{ color: 'var(--dao-foreground)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>GitHub</span>
                      <ExternalLink className="w-3 h-3 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Activity Analytics
              </h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer>
                  <AreaChart data={generateActivityData(project.memberCount)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--dao-border)" />
                    <XAxis dataKey="date" stroke="var(--dao-foreground)" />
                    <YAxis stroke="var(--dao-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--dao-card)',
                        border: '1px solid var(--dao-border)',
                        borderRadius: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="members"
                      stackId="1"
                      stroke="var(--dao-accent-blue)"
                      fill="var(--dao-accent-blue)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="proposals"
                      stackId="1"
                      stroke="var(--dao-accent-purple)"
                      fill="var(--dao-accent-purple)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="votes"
                      stackId="1"
                      stroke="var(--dao-success)"
                      fill="var(--dao-success)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            {/* All Proposals */}
            <div className="dao-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                  All Proposals
                </h3>
                {!isGuestMode && (
                  <Button
                    onClick={() => onNavigate('create-proposal')}
                    className="rounded-xl dao-gradient-blue text-white border-0"
                  >
                    Create Proposal
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {project.proposals.map((proposal) => (
                  <div key={proposal.id} className="dao-card p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge
                          className="text-xs rounded-full px-3 py-1"
                          style={{
                            backgroundColor: proposal.status === 'active' ? 'var(--dao-success)' : 
                                           proposal.status === 'completed' ? 'var(--dao-accent-blue)' : 'var(--dao-warning)',
                            color: 'white'
                          }}
                        >
                          {proposal.status.toUpperCase()}
                        </Badge>
                        {(proposal as any).category && (
                          <Badge
                            variant="outline"
                            className="text-xs rounded-full px-2 py-1"
                            style={{ borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)' }}
                          >
                            {(proposal as any).category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('proposal-details', proposal.id)}
                        className="rounded-xl"
                      >
                        View Details
                      </Button>
                    </div>

                    <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--dao-foreground)' }}>
                      {proposal.title}
                    </h4>

                    {/* Proposal Description */}
                    {(proposal as any).description && (
                      <p className="text-sm opacity-80 leading-relaxed mb-4" style={{ color: 'var(--dao-foreground)' }}>
                        {(proposal as any).description}
                      </p>
                    )}

                    {/* Proposal Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl" 
                         style={{ backgroundColor: 'var(--dao-card-secondary)' }}>
                      <div className="space-y-2">
                        {(proposal as any).proposedBy && (
                          <div className="flex justify-between">
                            <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                              Proposed by:
                            </span>
                            <span className="text-sm font-medium font-mono" style={{ color: 'var(--dao-foreground)' }}>
                              {(proposal as any).proposedBy}
                            </span>
                          </div>
                        )}
                        {(proposal as any).fundingAmount !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                              Funding:
                            </span>
                            <span className="text-sm font-bold" style={{ color: 'var(--dao-accent-blue)' }}>
                              {(proposal as any).fundingAmount === 0 ? 'No funding required' : 
                               `${(proposal as any).fundingAmount.toLocaleString()} ${(proposal as any).fundingCurrency}`}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(proposal as any).executionPeriod && (
                          <div className="flex justify-between">
                            <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                              Execution:
                            </span>
                            <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>
                              {(proposal as any).executionPeriod}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                            Voting ends:
                          </span>
                          <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>
                            {new Date(proposal.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Voting Results */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--dao-success)15' }}>
                        <div className="text-xl font-bold" style={{ color: 'var(--dao-success)' }}>
                          {proposal.yesVotes.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium" style={{ color: 'var(--dao-success)' }}>
                          Yes ({((proposal.yesVotes / proposal.totalVotes) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--dao-error)15' }}>
                        <div className="text-xl font-bold" style={{ color: 'var(--dao-error)' }}>
                          {proposal.noVotes.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium" style={{ color: 'var(--dao-error)' }}>
                          No ({((proposal.noVotes / proposal.totalVotes) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-xl" style={{ backgroundColor: 'var(--dao-accent-blue)15' }}>
                        <div className="text-xl font-bold dao-text-gradient">
                          {proposal.totalVotes.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium" style={{ color: 'var(--dao-accent-blue)' }}>
                          Total Votes
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <Progress 
                        value={(proposal.yesVotes / proposal.totalVotes) * 100} 
                        className="h-3"
                      />
                    </div>

                    {/* Status Footer */}
                    <div className="flex items-center justify-between pt-4 border-t" 
                         style={{ borderColor: 'var(--dao-border)' }}>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                        <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                          ID: {proposal.id}
                        </span>
                      </div>
                      {proposal.status === 'completed' && (proposal as any).result && (
                        <Badge
                          className="text-xs rounded-full px-3 py-1"
                          style={{
                            backgroundColor: (proposal as any).result === 'passed' ? 'var(--dao-success)' : 'var(--dao-error)',
                            color: 'white'
                          }}
                        >
                          {(proposal as any).result.toUpperCase()}
                        </Badge>
                      )}
                      {proposal.status === 'active' && !isGuestMode && (
                        <Button
                          size="sm"
                          onClick={() => onNavigate('voting', proposal.id)}
                          className="rounded-xl dao-gradient-blue text-white border-0"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="dao-card p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--dao-success)' }} />
                  <span className="text-3xl font-bold dao-text-gradient">
                    {Math.floor(project.memberCount * 0.68)}
                  </span>
                </div>
                <div className="font-medium mb-1" style={{ color: 'var(--dao-foreground)' }}>
                  Active Members
                </div>
                <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                  Last 30 days
                </div>
              </div>

              <div className="dao-card p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <BarChart3 className="w-6 h-6" style={{ color: 'var(--dao-accent-purple)' }} />
                  <span className="text-3xl font-bold dao-text-gradient">
                    {Math.floor(project.memberCount * 0.42)}
                  </span>
                </div>
                <div className="font-medium mb-1" style={{ color: 'var(--dao-foreground)' }}>
                  Voters
                </div>
                <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                  Participated in voting
                </div>
              </div>

              <div className="dao-card p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Users className="w-6 h-6" style={{ color: 'var(--dao-accent-blue)' }} />
                  <span className="text-3xl font-bold dao-text-gradient">
                    {Math.floor(project.memberCount * 0.08)}
                  </span>
                </div>
                <div className="font-medium mb-1" style={{ color: 'var(--dao-foreground)' }}>
                  Contributors
                </div>
                <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                  Active contributors
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Recent Community Activity
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'New proposal created', user: 'alice_dev', time: '2 hours ago', type: 'proposal' },
                  { action: 'Voted on proposal', user: 'bob_validator', time: '4 hours ago', type: 'vote' },
                  { action: 'Joined the community', user: 'charlie_new', time: '6 hours ago', type: 'join' },
                  { action: 'Comment on proposal', user: 'diana_researcher', time: '8 hours ago', type: 'comment' },
                  { action: 'Proposal funded', user: 'system', time: '1 day ago', type: 'funding' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-xl" 
                       style={{ backgroundColor: 'var(--dao-card-secondary)' }}>
                    <div className="w-2 h-2 rounded-full" 
                         style={{ 
                           backgroundColor: activity.type === 'proposal' ? 'var(--dao-accent-blue)' :
                                          activity.type === 'vote' ? 'var(--dao-success)' :
                                          activity.type === 'join' ? 'var(--dao-accent-purple)' :
                                          activity.type === 'comment' ? 'var(--dao-warning)' :
                                          'var(--dao-foreground)'
                         }}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                          {activity.user}
                        </span>
                        <span className="opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                          {activity.action}
                        </span>
                      </div>
                      <div className="text-sm opacity-50" style={{ color: 'var(--dao-foreground)' }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance Participation */}
            <div className="dao-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Governance Participation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Voting Participation Rate
                    </span>
                    <span className="font-bold" style={{ color: 'var(--dao-accent-blue)' }}>
                      68.5%
                    </span>
                  </div>
                  <Progress value={68.5} className="mb-4" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Proposal Success Rate
                    </span>
                    <span className="font-bold" style={{ color: 'var(--dao-success)' }}>
                      84.2%
                    </span>
                  </div>
                  <Progress value={84.2} className="mb-4" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Average Voting Time
                    </span>
                    <span className="font-bold" style={{ color: 'var(--dao-accent-purple)' }}>
                      2.4 days
                    </span>
                  </div>
                  <Progress value={40} className="mb-4" />
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Community Engagement
                    </span>
                    <span className="font-bold" style={{ color: 'var(--dao-warning)' }}>
                      76.8%
                    </span>
                  </div>
                  <Progress value={76.8} className="mb-4" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}