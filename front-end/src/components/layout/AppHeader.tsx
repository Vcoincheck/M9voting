import React from 'react';
import { Wallet, ExternalLink, ChevronDown, Copy, LogOut, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ThemeToggle } from '../context/ThemeProvider';
import { useDAO } from '../context/DAOProvider';
import { toast } from 'sonner@2.0.3';
import m9Logo from '../../assets/m9Logo-1.png';

interface AppHeaderProps {
  pageTitle?: string;
  showWalletConnect?: boolean;
  onWalletConnect?: () => void;
  onNavigateToApp?: () => void;
  onNavigateHome?: () => void;
}

export function AppHeader({ 
  pageTitle, 
  showWalletConnect = false, 
  onWalletConnect, 
  onNavigateToApp,
  onNavigateHome 
}: AppHeaderProps) {
  const { wallet, isGuestMode, connectionDetails, setShowWalletSelector, disconnectWallet } = useDAO();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatZkHash = (hash: string) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const handleWalletConnect = () => {
    setShowWalletSelector(true);
    if (onWalletConnect) {
      onWalletConnect();
    }
  };

  const handleTechDocs = () => {
    window.open('https://vcc.gitbook.io/m9dao-project/proposal/3rdstage-voting-app/proposal-draft', '_blank');
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error(`Failed to copy ${label}`);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    toast.success('Wallet disconnected successfully');
    // Navigate to homepage after disconnect
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const getWalletDisplayName = (type: string | null) => {
    switch (type) {
      case 'midnight':
        return 'Midnight Wallet';
      case 'lace':
        return 'Lace-Midnight Wallet';
      case 'hydra':
        return 'Hydra Wallet';
      default:
        return 'Wallet';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b dao-glass"
            style={{
              borderColor: 'var(--dao-border)'
            }}>
  <div className="container mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Left: Logo + App name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center">
          <img src={m9Logo} alt="M9 Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-xl dao-text-gradient">M9 Privacy Voting</h1>
          <p
            className="text-xs opacity-70"
            style={{ color: 'var(--dao-foreground)' }}
          >
            Zero-Knowledge DAO Governance
          </p>
        </div>
      </div>

      {/* Center: Catalyst proposal support */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 w-fit animate-pulse hover:scale-105 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-yellow-400 drop-shadow animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xxs font-semibold px-2 py-1 rounded inline-block shadow-md" style={{textShadow: '0 0 8px rgba(255,255,255,0.4)'}}>
            <span style={{color: '#ff6a00'}}>Support us by voting</span>
            <span style={{color: '#ffd700'}}> our Catalyst proposal</span>
            <span style={{color: '#00c3ff'}}> in Fund14</span>
            <span style={{color: '#ff00c8'}}> (Key: VCC)</span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-yellow-400 drop-shadow animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Right: Theme toggle + Wallet button */}
      <div className="flex items-center space-x-4">
        {!wallet && (
          <>
            {isGuestMode ? (
              <Button
                onClick={handleWalletConnect}
                className="rounded-xl dao-gradient-blue text-white border-0 hidden md:flex"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleTechDocs}
                className="rounded-xl hidden md:flex"
                style={{
                  borderColor: 'var(--dao-border)',
                  color: 'var(--dao-foreground)',
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Tech Docs
              </Button>
            )}


                {onNavigateToApp && (
                  <Button
                    onClick={onNavigateToApp}
                    className="rounded-xl dao-gradient-blue text-white border-0"
                  >
                    Go to App
                  </Button>
                )}
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Additional Wallet Connect Button (for non-guest mode users) */}
            {showWalletConnect && !wallet && !isGuestMode && (
              <Button
                onClick={handleWalletConnect}
                className="rounded-xl dao-gradient-blue text-white border-0"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {/* Connected Wallet Display with Dropdown */}
            {wallet && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="dao-card px-4 py-2 h-auto border-0 hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--dao-card)',
                      borderColor: 'var(--dao-border)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
                        <Wallet className="w-4 h-4" style={{color: 'var(--dao-foreground)'}} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-mono" style={{color: 'var(--dao-foreground)'}}>
                          {formatAddress(wallet.address)}
                        </span>
                        <span className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                          {getWalletDisplayName(connectionDetails.walletType)}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 opacity-50" style={{color: 'var(--dao-foreground)'}} />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  align="end" 
                  className="w-72 p-0"
                  style={{
                    backgroundColor: 'var(--dao-card)',
                    borderColor: 'var(--dao-border)',
                    borderRadius: 'var(--dao-radius)'
                  }}
                >
                  {/* Wallet Info Section */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
                      <span className="text-sm font-medium" style={{color: 'var(--dao-foreground)'}}>
                        Connected to {getWalletDisplayName(connectionDetails.walletType)}
                      </span>
                    </div>
                    
                    {/* Wallet Address */}
                    <div className="mb-3">
                      <label className="text-xs opacity-70 block mb-1" style={{color: 'var(--dao-foreground)'}}>
                        Wallet Address
                      </label>
                      <div className="flex items-center justify-between p-2 rounded-lg border" 
                           style={{backgroundColor: 'var(--dao-card-secondary)', borderColor: 'var(--dao-border)'}}>
                        <span className="text-sm font-mono" style={{color: 'var(--dao-foreground)'}}>
                          {formatAddress(wallet.address)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* ZK Session Hash */}
                    {connectionDetails.zkSessionHash && (
                      <div className="mb-3">
                        <label className="text-xs opacity-70 block mb-1" style={{color: 'var(--dao-foreground)'}}>
                          ZK Session Hash
                        </label>
                        <div className="flex items-center justify-between p-2 rounded-lg border" 
                             style={{backgroundColor: 'var(--dao-card-secondary)', borderColor: 'var(--dao-border)'}}>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-3 h-3" style={{color: 'var(--dao-accent-purple)'}} />
                            <span className="text-sm font-mono" style={{color: 'var(--dao-foreground)'}}>
                              {formatZkHash(connectionDetails.zkSessionHash)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(connectionDetails.zkSessionHash || '', 'ZK session hash')}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  {/* Disconnect Option */}
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={handleDisconnectWallet}
                      className="w-full text-left p-3 rounded-lg cursor-pointer flex items-center space-x-2"
                      style={{
                        color: 'var(--dao-error)',
                        backgroundColor: 'transparent'
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
