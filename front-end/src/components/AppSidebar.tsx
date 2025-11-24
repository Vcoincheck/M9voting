import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Plus, 
  Activity, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  Book,
  Users,
  ChevronLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useDAO } from './DAOProvider';
import { useIsMobile } from './ui/use-mobile';
import m9Logo from '../assets/9b8c955de5c9045c5e793f1895c5b670b83c42ab.png';

interface AppSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string, proposalId?: string, projectId?: string) => void;
}

export function AppSidebar({ currentScreen, onNavigate }: AppSidebarProps) {
  const { proposals } = useDAO();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const activeProposals = proposals.filter(p => p.status === 'active').length;

  const mainMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & stats'
    },
    {
      id: 'proposal-list',
      label: 'All Proposals',
      icon: FileText,
      description: 'Browse & create proposals',
      badge: activeProposals > 0 ? activeProposals : undefined
    },
    {
      id: 'projects-community',
      label: 'Projects & Community',
      icon: Users,
      description: 'Community projects & voting'
    },
    {
      id: 'activities',
      label: 'Activities / History',
      icon: Activity,
      description: 'Your voting history'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App preferences'
    }
  ];

  const bottomMenuItems = [
    {
      id: 'documents',
      label: 'Documentation',
      icon: Book,
      description: 'Guides & resources'
    }
  ];

  const handleNavigate = (screen: string, proposalId?: string, projectId?: string) => {
    onNavigate(screen, proposalId, projectId);
    // Auto-collapse on mobile after navigation
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  // Mobile hamburger button
  const MobileToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-4 left-4 z-50 md:hidden dao-glass p-2"
      onClick={() => setIsCollapsed(!isCollapsed)}
      style={{
        backgroundColor: 'var(--dao-card)',
        color: 'var(--dao-foreground)',
        border: '1px solid var(--dao-border)'
      }}
    >
      {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
    </Button>
  );

  // Desktop sidebar (collapsible)
  if (!isMobile) {
    return (
      <div className={`${isDesktopCollapsed ? 'w-20' : 'w-80'} h-screen dao-glass border-r border-l-0 border-t-0 border-b-0 flex flex-col transition-all duration-300 ease-in-out`}>
        <SidebarContent 
          mainMenuItems={mainMenuItems}
          bottomMenuItems={bottomMenuItems}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          isDesktopCollapsed={isDesktopCollapsed}
          setIsDesktopCollapsed={setIsDesktopCollapsed}
        />
      </div>
    );
  }

  // Mobile implementation with overlay
  return (
    <>
      <MobileToggle />
      
      {/* Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen w-80 dao-glass border-r border-l-0 border-t-0 border-b-0 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <SidebarContent 
          mainMenuItems={mainMenuItems}
          bottomMenuItems={bottomMenuItems}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          isMobile={true}
        />
      </div>
    </>
  );
}

// Extracted sidebar content component for reuse
function SidebarContent({ 
  mainMenuItems,
  bottomMenuItems, 
  currentScreen, 
  onNavigate,
  isMobile = false,
  isDesktopCollapsed = false,
  setIsDesktopCollapsed
}: {
  mainMenuItems: any[];
  bottomMenuItems: any[];
  currentScreen: string;
  onNavigate: (screen: string, proposalId?: string, projectId?: string) => void;
  isMobile?: boolean;
  isDesktopCollapsed?: boolean;
  setIsDesktopCollapsed?: (collapsed: boolean) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className={`${isDesktopCollapsed && !isMobile ? 'p-3' : 'p-6'} border-b ${isMobile ? 'pt-16' : ''}`} style={{borderColor: 'var(--dao-border)'}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('homepage')}>
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center">
              <img src={m9Logo} alt="M9 Logo" className="w-full h-full object-contain" />
            </div>
            {(!isDesktopCollapsed || isMobile) && (
              <div>
                <h2 className="font-bold dao-text-gradient">M9 Privacy Voting</h2>
                <p className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  ZK-enabled DAO
                </p>
              </div>
            )}
          </div>
          
          {/* Desktop Collapse Button */}
          {!isMobile && setIsDesktopCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg"
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--dao-foreground)',
              }}
            >
              {isDesktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className={`${isDesktopCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
          {(!isDesktopCollapsed || isMobile) && (
            <div className="text-xs font-medium opacity-70 mb-3 uppercase tracking-wide" 
                 style={{color: 'var(--dao-foreground)'}}>
              Navigation
            </div>
          )}
          
          <div className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full ${isDesktopCollapsed && !isMobile ? 'justify-center p-3' : 'justify-start'} h-auto p-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'dao-gradient-blue text-white' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? undefined : 'transparent',
                    color: isActive ? 'white' : 'var(--dao-foreground)'
                  }}
                  onClick={() => onNavigate(item.id)}
                  title={isDesktopCollapsed && !isMobile ? item.label : undefined}
                >
                  <div className={`flex items-center ${isDesktopCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} w-full`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {(!isDesktopCollapsed || isMobile) && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className={`text-xs opacity-70 ${isActive ? 'text-white' : ''}`}>
                            {item.description}
                          </div>
                        </div>
                        {item.badge && (
                          <Badge 
                            className="text-xs px-2 py-0 rounded-full"
                            style={{
                              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--dao-accent-blue)',
                              color: 'white'
                            }}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {!isActive && (
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        )}
                      </>
                    )}
                    {isDesktopCollapsed && !isMobile && item.badge && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bottom Menu Items */}
        <div className={`mt-auto ${isDesktopCollapsed && !isMobile ? 'p-2' : 'p-4'} border-t`} style={{borderColor: 'var(--dao-border)'}}>
          {(!isDesktopCollapsed || isMobile) && (
            <div className="text-xs font-medium opacity-70 mb-3 uppercase tracking-wide" 
                 style={{color: 'var(--dao-foreground)'}}>
              Resources
            </div>
          )}
          
          <div className="space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full ${isDesktopCollapsed && !isMobile ? 'justify-center p-3' : 'justify-start'} h-auto p-3 rounded-xl transition-all duration-200 ${
                    isActive ? 'dao-gradient-blue text-white' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? undefined : 'transparent',
                    color: isActive ? 'white' : 'var(--dao-foreground)'
                  }}
                  onClick={() => onNavigate(item.id)}
                  title={isDesktopCollapsed && !isMobile ? item.label : undefined}
                >
                  <div className={`flex items-center ${isDesktopCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} w-full`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {(!isDesktopCollapsed || isMobile) && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className={`text-xs opacity-70 ${isActive ? 'text-white' : ''}`}>
                            {item.description}
                          </div>
                        </div>
                        {!isActive && (
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        )}
                      </>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`${isDesktopCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
        <div className="flex flex-col items-center space-y-2">
          {(!isDesktopCollapsed || isMobile) && (
            <div className="text-xs opacity-50 text-center" style={{color: 'var(--dao-foreground)'}}>
              Secure â€¢ Private â€¢ Decentralized
            </div>
          )}
        </div>
      </div>
    </>
  );
}
