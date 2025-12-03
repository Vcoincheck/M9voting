import React from 'react';
import { Wallet, Copy, ExternalLink, Coins } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useDAO } from '../DAOProvider';
import m9Logo from '../assets/m9Logo.png';

export function WalletInfo() {
  const { wallet } = useDAO();

  if (!wallet) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
  };

  const openExplorer = () => {
    window.open(`https://explorer.midnight.network/address/${wallet.address}`, '_blank');
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(balance);
  };

  return (
    <div className="dao-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-2xl dao-gradient-blue flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold" style={{color: 'var(--dao-foreground)'}}>
            Wallet Information
          </h3>
          <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
            Connected to Midnight Network
          </p>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="mb-6">
        <label className="text-sm font-medium opacity-70 block mb-2" style={{color: 'var(--dao-foreground)'}}>
          Wallet Address
        </label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 dao-card p-3 font-mono text-sm" style={{color: 'var(--dao-foreground)'}}>
            {wallet.address}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAddress}
            className="rounded-xl"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openExplorer}
            className="rounded-xl"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{color: 'var(--dao-foreground)'}}>Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'var(--dao-success)'}}></div>
            <Badge style={{backgroundColor: 'var(--dao-success)', color: 'white'}}>
              Connected
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium" style={{color: 'var(--dao-foreground)'}}>Network</span>
          <Badge variant="outline" style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}>
            {wallet.network.charAt(0).toUpperCase() + wallet.network.slice(1)}
          </Badge>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Token Balances */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Coins className="w-5 h-5" style={{color: 'var(--dao-foreground)'}} />
          <h4 className="font-semibold" style={{color: 'var(--dao-foreground)'}}>Token Balances</h4>
        </div>

        <div className="space-y-4">
          {/* WADA Balance */}
          <div className="dao-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full dao-gradient-blue flex items-center justify-center">
                  <span className="text-xs font-bold text-white">W</span>
                </div>
                <div>
                  <div className="font-semibold" style={{color: 'var(--dao-foreground)'}}>WADA</div>
                  <div className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    Wrapped ADA
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold" style={{color: 'var(--dao-foreground)'}}>
                  {formatBalance(wallet.balance)}
                </div>
                <div className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  ~${(wallet.balance * 0.45).toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>

          {/* NIGHT Balance */}
          <div className="dao-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                     style={{backgroundColor: 'var(--dao-accent-purple)'}}>
                  <img src={m9Logo} alt="NIGHT" className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold" style={{color: 'var(--dao-foreground)'}}>NIGHT</div>
                  <div className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                    Native Privacy Token
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold" style={{color: 'var(--dao-foreground)'}}>
                  {formatBalance(wallet.nightBalance)}
                </div>
                <div className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  ~${(wallet.nightBalance * 1.23).toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Information */}
        <div className="mt-4 p-4 rounded-xl" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
          <h5 className="font-medium mb-2" style={{color: 'var(--dao-foreground)'}}>Token Information</h5>
          <div className="text-sm space-y-1 opacity-70" style={{color: 'var(--dao-foreground)'}}>
            <p>â€¢ WADA: Wrapped ADA token for cross-chain compatibility</p>
            <p>â€¢ NIGHT: Native privacy token for enhanced governance features</p>
            <p>â€¢ Both tokens can be used for voting and staking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
