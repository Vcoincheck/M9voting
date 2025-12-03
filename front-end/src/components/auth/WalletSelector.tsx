import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader2, Eye } from 'lucide-react';
import { Separator } from '../ui/separator';
import { motion } from 'motion/react';
import midnightLogo from '../../assets/m9Logo.png';
import laceLogo from '../../assets/laceLogo.png';
import hydraLogo from '../../assets/hydraLogo.png';

interface WalletSelectorProps {
  open: boolean;
  onClose: () => void;
  onConnect: (walletType: 'midnight' | 'hydra' | 'lace') => Promise<void>;
  onGuestAccess?: () => void;
}

export function WalletSelector({ open, onClose, onConnect, onGuestAccess }: WalletSelectorProps) {
  const [connecting, setConnecting] = useState<'midnight' | 'hydra' | 'lace' | null>(null);

  const handleConnect = async (walletType: 'midnight' | 'hydra' | 'lace') => {
    setConnecting(walletType);
    try {
      await onConnect(walletType);
    } finally {
      setConnecting(null);
    }
  };

  const handleGuestAccess = () => {
    if (onGuestAccess) {
      onGuestAccess();
    }
    onClose();
  };

  const wallets = [
    {
      type: 'midnight' as const,
      name: 'Midnight Wallet',
      description: 'Privacy-focused wallet with advanced ZK features',
      logo: midnightLogo,
      features: ['Zero-Knowledge Proofs', 'Private Transactions', 'Anonymous Voting'],
      color: 'var(--dao-accent-purple)'
    },
    {
      type: 'lace' as const,
      name: 'Lace-Midnight Wallet',
      description: 'A Lace wallet version built for Midnight',
      logo: laceLogo,
      features: ['Zero-Knowledge Proofs', 'Private Transactions', 'Anonymous Voting'],
      color: 'var(--dao-accent-purple)'
    },
    {
      type: 'hydra' as const,
      name: 'Hydra Wallet',
      description: 'High-performance multi-chain wallet solution',
      logo: hydraLogo,
      features: ['Multi-Chain Support', 'Fast Transactions', 'Cardano Assets Wrapped Portal'],
      color: 'var(--dao-success)'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl p-0 overflow-hidden"
        style={{
          backgroundColor: 'var(--dao-card)',
          borderColor: 'var(--dao-border)',
          borderRadius: 'var(--dao-radius)'
        }}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle 
            className="text-2xl text-center dao-text-gradient"
          >
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription 
            className="text-center opacity-70 mt-2"
            style={{color: 'var(--dao-foreground)'}}
          >
            Have to connect first to make everything privacy. Choose your preferred wallet to access M9 Privacy Voting features
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {wallets.map((wallet) => {
            const isConnecting = connecting === wallet.type;
            
            return (
              <motion.div
                key={wallet.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleConnect(wallet.type)}
                  disabled={connecting !== null}
                  className="w-full p-6 h-auto text-left rounded-xl border transition-all duration-300 hover:shadow-lg"
                  variant="outline"
                  style={{
                    backgroundColor: 'var(--dao-card)',
                    borderColor: 'var(--dao-border)',
                    color: 'var(--dao-foreground)'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center p-1"
                      style={{
                        backgroundColor: isConnecting ? 'transparent' : 'var(--dao-card-secondary)',
                        border: '1px solid var(--dao-border)'
                      }}
                    >
                      {isConnecting ? (
                        <Loader2 
                          className="w-6 h-6 animate-spin" 
                          style={{color: wallet.color}} 
                        />
                      ) : (
                        <img
                          src={wallet.logo}
                          alt={`${wallet.name} logo`}
                          className="w-10 h-10 object-contain rounded-lg"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {wallet.name}
                      </h3>
                      <p className="opacity-70 text-sm mb-3">
                        {wallet.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {wallet.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: wallet.color,
                              color: 'white',
                              opacity: 0.8
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isConnecting && (
                      <div className="text-sm opacity-70">
                        Connecting...
                      </div>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="px-6">
          <Separator />
        </div>

        <div className="p-6 pt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleGuestAccess}
              disabled={connecting !== null}
              variant="outline"
              className="w-full p-4 h-auto text-left rounded-xl border transition-all duration-300"
              style={{
                backgroundColor: 'var(--dao-card-secondary)',
                borderColor: 'var(--dao-border)',
                color: 'var(--dao-foreground)',
                borderStyle: 'dashed'
              }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--dao-warning)',
                    opacity: 0.1
                  }}
                >
                  <Eye 
                    className="w-5 h-5" 
                    style={{color: 'var(--dao-warning)'}}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium mb-1">
                    Access Without Wallet
                  </h3>
                  <p className="text-sm opacity-70">
                    You can explore the platform but only see something that are public
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
        </div>

        <div className="p-6 pt-0">
          <div 
            className="text-xs text-center opacity-60"
            style={{color: 'var(--dao-foreground)'}}
          >
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
