import React, { useState } from 'react';
import { ArrowLeft, Users, Vote, Eye, Calendar, Globe, Lock, ExternalLink, MessageCircle, Star, Share2, Bell, FileText, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useDAO } from '../../components/context';
import { useAppNavigation } from '../../hooks';

export function TempProjectDetailsPage() {
  const nav = useAppNavigation();
  const { isGuestMode, tempProjects } = useDAO();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  // Find the temporary project
  const tempProject = tempProjects.find(p => p.id === projectId);
  
  if (!tempProject) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dao-text-gradient">Project Not Found</h2>
          <p className="opacity-70 mb-6" style={{ color: 'var(--dao-foreground)' }}>
            This temporary project is no longer available.
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
      case 'defi': return '💰';
      case 'nft': return '🎨';
      case 'gaming': return '🎮';
      case 'dao': return '🏛️';
      case 'infrastructure': return '⚡';
      case 'social': return '🌍';
      default: return '📋';
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
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${getCategoryColor(tempProject.category)}15` }}
              >
                {getCategoryIcon(tempProject.category)}
              </div>
              <div>
                <h1 className="text-3xl font-bold dao-text-gradient">{tempProject.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge
                    className="text-sm rounded-full px-3 py-1"
                    style={{
                      backgroundColor: getCategoryColor(tempProject.category),
                      color: 'white'
                    }}
                  >
                    {tempProject.category.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {tempProject.type === 'private' ? (
                      <Lock className="w-4 h-4" style={{ color: 'var(--dao-warning)' }} />
                    ) : (
                      <Globe className="w-4 h-4" style={{ color: 'var(--dao-success)' }} />
                    )}
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      {tempProject.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    <span className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Created {tempProject.createdAt instanceof Date 
                        ? tempProject.createdAt.toLocaleDateString() 
                        : new Date(tempProject.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge className="text-xs px-2 py-0 rounded-full animate-pulse" 
                         style={{ backgroundColor: 'var(--dao-accent-blue)', color: 'white' }}>
                    NEW
                  </Badge>
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
                🆕 Newly Created Project
              </h3>
              <p className="text-sm opacity-80" style={{ color: 'var(--dao-foreground)' }}>
                This project was just created and is still in setup phase. Complete project information 
                and proposals will be available after the page is refreshed or when the project is fully deployed.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="dao-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
              <span className="text-2xl font-bold dao-text-gradient">
                {tempProject.memberCount.toLocaleString()}
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
                {tempProject.proposalCount}
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
                {tempProject.activeVotes}
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
                Setup
              </span>
            </div>
            <div className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Status
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals (0)</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Project Description
              </h2>
              <p className="opacity-80 mb-4" style={{ color: 'var(--dao-foreground)' }}>
                {tempProject.description}
              </p>
              {tempProject.longDescription && tempProject.longDescription !== tempProject.description && (
                <>
                  <h3 className="font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                    Detailed Information
                  </h3>
                  <p className="opacity-80" style={{ color: 'var(--dao-foreground)' }}>
                    {tempProject.longDescription}
                  </p>
                </>
              )}
            </div>

            {/* Project Information */}
            <div className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Project Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Creator</p>
                  <p className="font-medium font-mono text-sm" style={{ color: 'var(--dao-foreground)' }}>
                    {tempProject.creator}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Governance Token</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                    {tempProject.governanceToken}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Project Type</p>
                  <p className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>
                    {tempProject.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Category</p>
                  <p className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>
                    {tempProject.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(tempProject.website || tempProject.discord || tempProject.twitter || tempProject.github) && (
              <div className="dao-card p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                  Social Links & Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tempProject.website && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="w-4 h-4" style={{ color: 'var(--dao-accent-blue)' }} />
                      <div>
                        <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Website</p>
                        <a href={tempProject.website} target="_blank" rel="noopener noreferrer"
                           className="text-sm hover:underline" style={{ color: 'var(--dao-accent-blue)' }}>
                          {tempProject.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {tempProject.discord && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-4 h-4" style={{ color: 'var(--dao-accent-purple)' }} />
                      <div>
                        <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Discord</p>
                        <a href={tempProject.discord} target="_blank" rel="noopener noreferrer"
                           className="text-sm hover:underline" style={{ color: 'var(--dao-accent-blue)' }}>
                          Join Discord
                        </a>
                      </div>
                    </div>
                  )}
                  {tempProject.twitter && (
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 text-sm">🐦</span>
                      <div>
                        <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Twitter</p>
                        <a href={tempProject.twitter} target="_blank" rel="noopener noreferrer"
                           className="text-sm hover:underline" style={{ color: 'var(--dao-accent-blue)' }}>
                          Follow on Twitter
                        </a>
                      </div>
                    </div>
                  )}
                  {tempProject.github && (
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 text-sm">⚡</span>
                      <div>
                        <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>GitHub</p>
                        <a href={tempProject.github} target="_blank" rel="noopener noreferrer"
                           className="text-sm hover:underline" style={{ color: 'var(--dao-accent-blue)' }}>
                          View Repository
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <div className="dao-card p-6 text-center">
              <Vote className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--dao-foreground)' }}>
                No Proposals Yet
              </h3>
              <p className="opacity-70 mb-6" style={{ color: 'var(--dao-foreground)' }}>
                This newly created project doesn't have any proposals yet. Proposals will appear here once they are created and the project is fully deployed.
              </p>
              <div className="p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--dao-border)' }}>
                <p className="text-sm opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                  💡 After refreshing the page, this project will be able to have proposals created for it by community members.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <div className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                Governance Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--dao-card-secondary)' }}>
                  <div className="flex items-center space-x-3">
                    <Coins className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>Governance Token</p>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                        Token used for voting and proposals
                      </p>
                    </div>
                  </div>
                  <Badge className="px-3 py-1" style={{ backgroundColor: 'var(--dao-accent-blue)', color: 'white' }}>
                    {tempProject.governanceToken}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--dao-card-secondary)' }}>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5" style={{ color: tempProject.type === 'public' ? 'var(--dao-success)' : 'var(--dao-warning)' }} />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>Project Visibility</p>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                        {tempProject.type === 'public' ? 'Open to everyone' : 'Restricted access'}
                      </p>
                    </div>
                  </div>
                  <Badge className="px-3 py-1 capitalize" 
                         style={{ 
                           backgroundColor: tempProject.type === 'public' ? 'var(--dao-success)' : 'var(--dao-warning)', 
                           color: 'white' 
                         }}>
                    {tempProject.type}
                  </Badge>
                </div>

                <div className="p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--dao-border)' }}>
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5" style={{ color: 'var(--dao-accent-purple)' }} />
                    <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>Setup in Progress</p>
                  </div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                    Additional governance settings including voting mechanisms, proposal thresholds, and member permissions 
                    will be configured during the project deployment process.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}