import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Wallet, 
  Shield, 
  Bell, 
  Palette, 
  Download,
  LogOut,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useDAO } from '../../components/context';
import { ThemeToggle } from '../../components/context';
import { toast } from 'sonner@2.0.3';
import { useAppNavigation } from '../../hooks';

export function SettingsPage() {
  const nav = useAppNavigation();
  const { wallet, isGuestMode, disconnectWallet, connectionDetails } = useDAO();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [notifications, setNotifications] = useState({
    proposals: true,
    votes: true,
    results: false,
    system: true
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
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

  const handleExportData = () => {
    // Mock export functionality
    const data = {
      walletAddress: wallet?.address,
      exportDate: new Date().toISOString(),
      settings: notifications
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dao_settings_export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported successfully');
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--dao-background)'}}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => nav.goBack()}
              className="p-2 rounded-xl"
              style={{color: 'var(--dao-foreground)'}}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold dao-text-gradient">Settings</h1>
              <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Manage your app preferences and wallet settings
              </p>
            </div>
          </div>
          {!isGuestMode && (
            <Button 
              onClick={handleExportData}
              className="rounded-xl dao-gradient-blue text-white border-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>

        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            {/* Wallet Information */}
            <Card className="dao-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{color: 'var(--dao-foreground)'}}>
                  Wallet Connection
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: wallet ? 'var(--dao-success)' : 'var(--dao-error)'}}></div>
                  <Badge style={{
                    backgroundColor: wallet ? 'var(--dao-success)' : isGuestMode ? 'var(--dao-warning)' : 'var(--dao-error)',
                    color: 'white'
                  }}>
                    {wallet ? 'Connected' : isGuestMode ? 'Guest Mode' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              
              {wallet && !isGuestMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                        Wallet Address
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={wallet.address}
                          readOnly
                          className="font-mono text-sm"
                          style={{
                            backgroundColor: 'var(--dao-background)',
                            borderColor: 'var(--dao-border)',
                            color: 'var(--dao-foreground)'
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(wallet.address, 'Address')}
                          className="rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                        Wallet Type
                      </Label>
                      <div className="mt-1">
                        <Badge className="capitalize" style={{backgroundColor: 'var(--dao-accent-blue)', color: 'white'}}>
                          {connectionDetails.walletType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Token Balances */}
                  <div>
                    <Label className="text-sm opacity-70 mb-3 block" style={{color: 'var(--dao-foreground)'}}>
                      Token Balances
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="dao-card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>WADA</p>
                            <p className="text-lg font-bold" style={{color: 'var(--dao-foreground)'}}>
                              {wallet.balance.toLocaleString()}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full dao-gradient-blue flex items-center justify-center">
                            <span className="text-white text-xs font-bold">W</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="dao-card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>NIGHT</p>
                            <p className="text-lg font-bold" style={{color: 'var(--dao-foreground)'}}>
                              {(wallet.balance * 0.15).toLocaleString()}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full dao-gradient-blue flex items-center justify-center">
                            <span className="text-white text-xs font-bold">N</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Disconnect Wallet */}
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
                    <div>
                      <h3 className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                        Disconnect Wallet
                      </h3>
                      <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                        This will log you out and clear your session
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDisconnectWallet}
                      className="rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto mb-4 opacity-30" style={{color: 'var(--dao-foreground)'}} />
                  <p className="text-lg opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    {isGuestMode ? 'Guest Mode - Limited Access' : 'No wallet connected'}
                  </p>
                  <p className="text-sm opacity-50" style={{color: 'var(--dao-foreground)'}}>
                    {isGuestMode 
                      ? 'Connect your wallet to access full features and settings'
                      : 'Connect your wallet to manage settings'
                    }
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
                Privacy & Security
              </h2>
              
              {wallet && !isGuestMode && connectionDetails.zkSessionHash ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      ZK Session Hash
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={connectionDetails.zkSessionHash}
                        readOnly
                        className="font-mono text-sm"
                        style={{
                          backgroundColor: 'var(--dao-background)',
                          borderColor: 'var(--dao-border)',
                          color: 'var(--dao-foreground)'
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(connectionDetails.zkSessionHash, 'ZK Session Hash')}
                        className="rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                          Anonymous Voting
                        </h3>
                        <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                          Use zero-knowledge proofs for private voting
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" style={{color: 'var(--dao-success)'}} />
                        <Badge style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
                          Enabled
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                          Commit-Reveal Scheme
                        </h3>
                        <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                          Two-phase voting for enhanced privacy
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" style={{color: 'var(--dao-success)'}} />
                        <Badge style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                          Data Encryption
                        </h3>
                        <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                          All sensitive data is encrypted end-to-end
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" style={{color: 'var(--dao-success)'}} />
                        <Badge style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
                          Protected
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" style={{color: 'var(--dao-foreground)'}} />
                  <p className="text-lg opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    {isGuestMode ? 'Privacy Features Unavailable in Guest Mode' : 'Connect wallet to view privacy settings'}
                  </p>
                  <p className="text-sm opacity-50" style={{color: 'var(--dao-foreground)'}}>
                    {isGuestMode 
                      ? 'Connect your wallet to access zero-knowledge privacy features'
                      : 'Zero-knowledge features require wallet connection'
                    }
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
                Notification Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                      New Proposals
                    </Label>
                    <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      Get notified when new proposals are created
                    </p>
                  </div>
                  <Switch
                    checked={notifications.proposals}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, proposals: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                      Voting Reminders
                    </Label>
                    <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      Remind me to vote on active proposals
                    </p>
                  </div>
                  <Switch
                    checked={notifications.votes}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, votes: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                      Voting Results
                    </Label>
                    <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      Get notified when voting results are published
                    </p>
                  </div>
                  <Switch
                    checked={notifications.results}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, results: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                      System Updates
                    </Label>
                    <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      Important system notifications and updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.system}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, system: checked }))
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="dao-card p-6">
              <h2 className="text-xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
                Appearance Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                      Theme
                    </Label>
                    <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                      Choose between light and dark mode
                    </p>
                  </div>
                  <ThemeToggle />
                </div>

                <Separator />

                <div>
                  <Label className="font-medium mb-3 block" style={{color: 'var(--dao-foreground)'}}>
                    Color Scheme Preview
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="dao-card p-3 text-center">
                      <div className="w-8 h-8 rounded-full dao-gradient-blue mx-auto mb-2"></div>
                      <span className="text-xs" style={{color: 'var(--dao-foreground)'}}>Primary</span>
                    </div>
                    <div className="dao-card p-3 text-center">
                      <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{backgroundColor: 'var(--dao-success)'}}></div>
                      <span className="text-xs" style={{color: 'var(--dao-foreground)'}}>Success</span>
                    </div>
                    <div className="dao-card p-3 text-center">
                      <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{backgroundColor: 'var(--dao-warning)'}}></div>
                      <span className="text-xs" style={{color: 'var(--dao-foreground)'}}>Warning</span>
                    </div>
                    <div className="dao-card p-3 text-center">
                      <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{backgroundColor: 'var(--dao-error)'}}></div>
                      <span className="text-xs" style={{color: 'var(--dao-foreground)'}}>Error</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}