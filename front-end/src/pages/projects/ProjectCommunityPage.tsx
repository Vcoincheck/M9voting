import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, Users, Lock, Globe, Calendar, Vote, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useDAO } from '../../components/context';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import vietCardanoLogo from '../../assets/vietCardanoLogo.png';
import vtechcomLogo from '../../assets/vtechcomLogo.png';
import { useAppNavigation } from '../../hooks';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  category: 'defi' | 'nft' | 'gaming' | 'dao' | 'infrastructure' | 'social';
  memberCount: number;
  proposalCount: number;
  activeVotes: number;
  createdAt: string;
  creator: string;
  hasDetailedInfo: boolean;
}

const mockProjects: Project[] = [
  {
    id: 'viet-cardano-community',
    name: 'Viet Cardano Community',
    description: 'The official Vietnamese Cardano community focused on education, development, and ecosystem growth in Vietnam.',
    type: 'public',
    category: 'social',
    memberCount: 5247,
    proposalCount: 42,
    activeVotes: 8,
    createdAt: '2023-06-15',
    creator: 'viet_cardano_team',
    hasDetailedInfo: true
  },
  {
    id: 'vtechcom-lab',
    name: 'Vtechcom Lab',
    description: 'Advanced blockchain research and development laboratory focusing on privacy technologies and DeFi innovation.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 1876,
    proposalCount: 28,
    activeVotes: 6,
    createdAt: '2023-08-20',
    creator: 'vtechcom_research',
    hasDetailedInfo: true
  },
  {
    id: 'defi-vault-protocol',
    name: 'DeFi Vault Protocol',
    description: 'A decentralized vault protocol for yield farming and liquidity provision with advanced privacy features.',
    type: 'public',
    category: 'defi',
    memberCount: 1247,
    proposalCount: 23,
    activeVotes: 3,
    createdAt: '2024-01-15',
    creator: 'vault_dao_team',
    hasDetailedInfo: true
  },
  {
    id: 'nft-community-hub',
    name: 'NFT Community Hub',
    description: 'Community-driven marketplace and governance for NFT creators and collectors.',
    type: 'public',
    category: 'nft',
    memberCount: 892,
    proposalCount: 18,
    activeVotes: 2,
    createdAt: '2024-02-03',
    creator: 'nft_collective',
    hasDetailedInfo: true
  },
  {
    id: 'gaming-guild-alliance',
    name: 'Gaming Guild Alliance',
    description: 'Cross-game guild coordination and reward distribution platform.',
    type: 'private',
    category: 'gaming',
    memberCount: 567,
    proposalCount: 31,
    activeVotes: 5,
    createdAt: '2024-01-28',
    creator: 'guild_masters',
    hasDetailedInfo: true
  },
  {
    id: 'privacy-research-dao',
    name: 'Privacy Research DAO',
    description: 'Research funding and coordination for privacy-preserving technologies.',
    type: 'public',
    category: 'dao',
    memberCount: 2134,
    proposalCount: 45,
    activeVotes: 7,
    createdAt: '2024-01-08',
    creator: 'privacy_advocates',
    hasDetailedInfo: true
  },
  {
    id: 'infrastructure-builders',
    name: 'Infrastructure Builders',
    description: 'Decentralized infrastructure development and maintenance collective.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 1456,
    proposalCount: 39,
    activeVotes: 4,
    createdAt: '2024-02-12',
    creator: 'infra_devs',
    hasDetailedInfo: true
  },
  {
    id: 'social-impact-network',
    name: 'Social Impact Network',
    description: 'Community-driven social impact initiatives and funding coordination.',
    type: 'public',
    category: 'social',
    memberCount: 3421,
    proposalCount: 67,
    activeVotes: 12,
    createdAt: '2024-01-22',
    creator: 'impact_collective',
    hasDetailedInfo: false
  },
  {
    id: 'yield-farmers-union',
    name: 'Yield Farmers Union',
    description: 'Collective yield farming strategies and risk management.',
    type: 'private',
    category: 'defi',
    memberCount: 789,
    proposalCount: 24,
    activeVotes: 3,
    createdAt: '2024-02-01',
    creator: 'farmer_collective',
    hasDetailedInfo: false
  },
  {
    id: 'art-creators-guild',
    name: 'Digital Art Creators Guild',
    description: 'Supporting digital artists with tools, funding, and community.',
    type: 'public',
    category: 'nft',
    memberCount: 1876,
    proposalCount: 34,
    activeVotes: 6,
    createdAt: '2024-01-30',
    creator: 'art_collective',
    hasDetailedInfo: false
  },
  {
    id: 'gaming-tournament-dao',
    name: 'Gaming Tournament DAO',
    description: 'Organizing and funding competitive gaming tournaments.',
    type: 'public',
    category: 'gaming',
    memberCount: 2567,
    proposalCount: 28,
    activeVotes: 4,
    createdAt: '2024-02-08',
    creator: 'tournament_organizers',
    hasDetailedInfo: false
  },
  {
    id: 'governance-research-lab',
    name: 'Governance Research Lab',
    description: 'Researching and developing new governance mechanisms.',
    type: 'private',
    category: 'dao',
    memberCount: 445,
    proposalCount: 52,
    activeVotes: 8,
    createdAt: '2024-01-12',
    creator: 'governance_researchers',
    hasDetailedInfo: false
  },
  {
    id: 'defi-insurance-pool',
    name: 'DeFi Insurance Pool',
    description: 'Community-managed insurance for DeFi protocols and users.',
    type: 'public',
    category: 'defi',
    memberCount: 1923,
    proposalCount: 19,
    activeVotes: 2,
    createdAt: '2024-02-05',
    creator: 'insurance_dao',
    hasDetailedInfo: false
  },
  {
    id: 'creator-economy-fund',
    name: 'Creator Economy Fund',
    description: 'Funding and supporting content creators and influencers.',
    type: 'public',
    category: 'social',
    memberCount: 2834,
    proposalCount: 41,
    activeVotes: 9,
    createdAt: '2024-01-25',
    creator: 'creator_fund',
    hasDetailedInfo: false
  },
  {
    id: 'cross-chain-alliance',
    name: 'Cross-Chain Alliance',
    description: 'Building bridges and tools for cross-chain interoperability.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 1234,
    proposalCount: 33,
    activeVotes: 5,
    createdAt: '2024-02-10',
    creator: 'bridge_builders',
    hasDetailedInfo: false
  },
  {
    id: 'metaverse-builders',
    name: 'Metaverse Builders',
    description: 'Creating shared virtual worlds and experiences.',
    type: 'private',
    category: 'gaming',
    memberCount: 1567,
    proposalCount: 26,
    activeVotes: 4,
    createdAt: '2024-01-18',
    creator: 'metaverse_devs',
    hasDetailedInfo: false
  },
  {
    id: 'education-dao',
    name: 'Decentralized Education DAO',
    description: 'Creating and funding decentralized education initiatives.',
    type: 'public',
    category: 'social',
    memberCount: 4567,
    proposalCount: 78,
    activeVotes: 15,
    createdAt: '2024-01-05',
    creator: 'edu_collective',
    hasDetailedInfo: false
  },
  {
    id: 'sustainability-network',
    name: 'Sustainability Network',
    description: 'Environmental sustainability projects and carbon offset coordination.',
    type: 'public',
    category: 'social',
    memberCount: 3892,
    proposalCount: 56,
    activeVotes: 11,
    createdAt: '2024-02-14',
    creator: 'green_collective',
    hasDetailedInfo: false
  },
  {
    id: 'liquidity-providers-guild',
    name: 'Liquidity Providers Guild',
    description: 'Coordinated liquidity provision and reward optimization.',
    type: 'private',
    category: 'defi',
    memberCount: 892,
    proposalCount: 21,
    activeVotes: 2,
    createdAt: '2024-01-20',
    creator: 'lp_guild',
    hasDetailedInfo: false
  },
  {
    id: 'music-nft-collective',
    name: 'Music NFT Collective',
    description: 'Supporting musicians and music NFT creators.',
    type: 'public',
    category: 'nft',
    memberCount: 1445,
    proposalCount: 29,
    activeVotes: 5,
    createdAt: '2024-02-02',
    creator: 'music_creators',
    hasDetailedInfo: false
  },
  {
    id: 'developer-funding-dao',
    name: 'Developer Funding DAO',
    description: 'Funding open-source development and developer tools.',
    type: 'public',
    category: 'infrastructure',
    memberCount: 2678,
    proposalCount: 47,
    activeVotes: 8,
    createdAt: '2024-01-28',
    creator: 'dev_supporters',
    hasDetailedInfo: false
  },
  {
    id: 'community-governance-lab',
    name: 'Community Governance Lab',
    description: 'Experimenting with new forms of community governance.',
    type: 'private',
    category: 'dao',
    memberCount: 673,
    proposalCount: 38,
    activeVotes: 6,
    createdAt: '2024-02-06',
    creator: 'governance_lab',
    hasDetailedInfo: false
  }
];

const getProjectLogo = (projectId: string) => {
  switch (projectId) {
    case 'viet-cardano-community':
      return vietCardanoLogo;
    case 'vtechcom-lab':
      return vtechcomLogo;
    default:
      return null;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'defi': return '💰';
    case 'nft': return '🎨';
    case 'gaming': return '🎮';
    case 'dao': return '🏛️';
    case 'infrastructure': return '⚡';
    case 'social': return '🌍';
    default: return '📋';
  }
};

export function ProjectCommunityPage() {
  const nav = useAppNavigation();
  const { isGuestMode, tempProjects } = useDAO();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Combine temporary projects with mock projects, converting temp project dates
  const allProjects = [
    ...tempProjects.map(project => ({
      ...project,
      createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString().split('T')[0] : project.createdAt
    })),
    ...mockProjects
  ];

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

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
            <div>
              <h1 className="text-3xl font-bold dao-text-gradient">Projects & Community</h1>
              <p className="opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                Discover and join community projects creating voting activities
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => nav.toCreateProject()}
            className="rounded-xl dao-gradient-blue text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
        </div>

        {/* New Projects Notification */}
        {tempProjects.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border" 
               style={{ 
                 backgroundColor: 'var(--dao-accent-blue)15', 
                 borderColor: 'var(--dao-accent-blue)' 
               }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" 
                   style={{ backgroundColor: 'var(--dao-accent-blue)' }}></div>
              <span className="text-sm font-medium" style={{ color: 'var(--dao-foreground)' }}>
                {tempProjects.length} new project{tempProjects.length > 1 ? 's' : ''} created! 
                They will appear in the permanent list after refresh.
              </span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" 
                     style={{ color: 'var(--dao-foreground)' }} />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl dao-card border-0"
                style={{
                  backgroundColor: 'var(--dao-card)',
                  color: 'var(--dao-foreground)'
                }}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 rounded-xl dao-card border-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
                <SelectItem value="nft">NFT</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="dao">DAO</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48 rounded-xl dao-card border-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`dao-card p-6 group transition-all duration-300 hover:scale-[1.02] ${
                project.hasDetailedInfo || project.id.startsWith('temp_') ? 'cursor-pointer' : 'cursor-default'
              } ${project.id.startsWith('temp_') ? 'ring-2 ring-blue-500 ring-opacity-30' : ''}`}
              onClick={() => {
                if (project.hasDetailedInfo) {
                  nav.toProjectDetails(project.id);
                } else if (project.id.startsWith('temp_')) {
                  // Allow viewing temporary project details
                  nav.toProjectDetails(project.id);
                } else {
                  toast.info('This project doesn\'t have detailed information available yet.');
                }
              }}
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getProjectLogo(project.id) ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center"
                         style={{ backgroundColor: `${getCategoryColor(project.category)}15` }}>
                      <ImageWithFallback
                        src={getProjectLogo(project.id)}
                        alt={`${project.name} logo`}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${getCategoryColor(project.category)}15` }}
                    >
                      {getCategoryIcon(project.category)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg group-hover:dao-text-gradient transition-all"
                        style={{ color: 'var(--dao-foreground)' }}>
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className="text-xs rounded-full px-2 py-0"
                        style={{
                          backgroundColor: getCategoryColor(project.category),
                          color: 'white'
                        }}
                      >
                        {project.category.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {project.type === 'private' ? (
                          <Lock className="w-3 h-3" style={{ color: 'var(--dao-warning)' }} />
                        ) : (
                          <Globe className="w-3 h-3" style={{ color: 'var(--dao-success)' }} />
                        )}
                        <span className="text-xs opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                          {project.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-sm opacity-80 mb-4 line-clamp-3" style={{ color: 'var(--dao-foreground)' }}>
                {project.description}
              </p>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="w-3 h-3" style={{ color: 'var(--dao-accent-blue)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--dao-foreground)' }}>
                      {project.memberCount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                    Members
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Vote className="w-3 h-3" style={{ color: 'var(--dao-accent-purple)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--dao-foreground)' }}>
                      {project.proposalCount}
                    </span>
                  </div>
                  <span className="text-xs opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                    Proposals
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Eye className="w-3 h-3" style={{ color: 'var(--dao-success)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--dao-foreground)' }}>
                      {project.activeVotes}
                    </span>
                  </div>
                  <span className="text-xs opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                    Active
                  </span>
                </div>
              </div>

              {/* Project Footer */}
              <div className="flex items-center justify-between pt-4 border-t" 
                   style={{ borderColor: 'var(--dao-border)' }}>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                  <span className="text-xs opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {project.id.startsWith('temp_') && (
                    <Badge className="text-xs px-2 py-0 rounded-full animate-pulse" 
                           style={{ backgroundColor: 'var(--dao-accent-blue)', color: 'white' }}>
                      NEW
                    </Badge>
                  )}
                  {project.hasDetailedInfo && (
                    <Badge className="text-xs px-2 py-0 rounded-full" 
                           style={{ backgroundColor: 'var(--dao-success)', color: 'white' }}>
                      Detailed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--dao-foreground)' }}>
              No projects found
            </h3>
            <p className="opacity-70 mb-6" style={{ color: 'var(--dao-foreground)' }}>
              Try adjusting your search criteria or create a new project.
            </p>
            <Button
              onClick={() => nav.toCreateProject()}
              className="rounded-xl dao-gradient-blue text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="dao-card p-4 text-center">
            <div className="text-2xl font-bold dao-text-gradient mb-1">
              {allProjects.length}
              {tempProjects.length > 0 && (
                <span className="text-sm ml-1" style={{ color: 'var(--dao-success)' }}>
                  (+{tempProjects.length})
                </span>
              )}
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Total Projects
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="text-2xl font-bold dao-text-gradient mb-1">
              {allProjects.filter(p => p.type === 'public').length}
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Public Projects
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="text-2xl font-bold dao-text-gradient mb-1">
              {allProjects.reduce((sum, p) => sum + p.memberCount, 0).toLocaleString()}
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Total Members
            </div>
          </div>
          <div className="dao-card p-4 text-center">
            <div className="text-2xl font-bold dao-text-gradient mb-1">
              {allProjects.reduce((sum, p) => sum + p.activeVotes, 0)}
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Active Votes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
