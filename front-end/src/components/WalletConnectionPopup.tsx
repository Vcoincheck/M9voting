import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, Clock, Shield, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useResponsiveSize, getHalfScreenDimensions } from './ui/use-responsive-size';

interface WalletConnectionPopupProps {
  open: boolean;
  onClose: () => void;
  walletAddress: string;
  walletType: 'midnight' | 'hydra' | 'lace';
  zkSessionHash: string;
  onAccessWithoutWallet?: () => void;
}

export function WalletConnectionPopup({ 
  open, 
  onClose, 
  walletAddress, 
  walletType, 
  zkSessionHash,
  onAccessWithoutWallet
}: WalletConnectionPopupProps) {
  const [connectionTime] = useState(new Date());
  const [countdown, setCountdown] = useState(5);
  const { width: screenWidth, height: screenHeight, isMobile } = useResponsiveSize();

  // Calculate half screen dimensions
  const { width: popupWidth, height: popupHeight } = getHalfScreenDimensions(screenWidth, screenHeight);

  useEffect(() => {
    if (open) {
      setCountdown(5);
    }
  }, [open]);

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (open && countdown === 0) {
      onClose();
    }
  }, [open, countdown, onClose]);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return isMobile ? `${address.slice(0, 4)}...${address.slice(-4)}` : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatZkHash = (hash: string) => {
    if (!hash) return '';
    return isMobile ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success(`${label} copied to clipboard!`);
      }
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getWalletDisplayName = (type: string) => {
    switch (type) {
      case 'midnight':
        return isMobile ? 'Midnight' : 'Midnight Wallet';
      case 'lace':
        return isMobile ? 'Lace-Midnight' : 'Lace-Midnight Wallet';
      case 'hydra':
        return isMobile ? 'Hydra' : 'Hydra Wallet';
      default:
        return 'Wallet';
    }
  };

  // Dynamic styling based on screen size
  const popupStyles = {
    width: `${popupWidth}px`,
    height: `${popupHeight}px`,
    maxWidth: `${popupWidth}px`,
    maxHeight: `${popupHeight}px`,
    backgroundColor: 'var(--dao-card)',
    borderColor: 'var(--dao-border)',
  };

  const contentPadding = isMobile ? 'p-3' : 'p-4';
  const iconSize = isMobile ? 'w-4 h-4' : 'w-5 h-5';
  const headerSize = isMobile ? 'text-base' : 'text-lg';
  const textSize = isMobile ? 'text-xs' : 'text-sm';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent 
        className="p-0 gap-0 overflow-hidden"
        style={popupStyles}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Wallet Connection Successful</DialogTitle>
          <DialogDescription>
            Your wallet has been successfully connected to M9 Privacy Voting with ZK privacy features enabled.
          </DialogDescription>
        </DialogHeader>

        <div 
          className={`${contentPadding} text-center h-full flex flex-col justify-between`}
          style={{ minHeight: '100%' }}
        >
          {/* Top Section */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div 
                className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} mx-auto rounded-full flex items-center justify-center`}
                style={{backgroundColor: 'var(--dao-success)', opacity: 0.1}}
              >
                <CheckCircle 
                  className={iconSize}
                  style={{color: 'var(--dao-success)'}} 
                />
              </div>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`${headerSize} font-bold dao-text-gradient mb-1`}>
                Hello, Privacy Warrior!
              </h2>
              <p className={`${textSize} opacity-70`} style={{color: 'var(--dao-foreground)'}}>
                Wallet connected with ZK privacy.
              </p>
            </motion.div>

            {/* Connection Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              {/* Wallet Address */}
              <div 
                className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl border`}
                style={{
                  backgroundColor: 'var(--dao-card-secondary)',
                  borderColor: 'var(--dao-border)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Shield className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} style={{color: 'var(--dao-accent-blue)'}} />
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-medium`} style={{color: 'var(--dao-foreground)'}}>
                      {getWalletDisplayName(walletType)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                    className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} p-0`}
                  >
                    <Copy className={`${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
                  </Button>
                </div>
                <p className={`font-mono ${isMobile ? 'text-xs' : 'text-xs'} text-left`} style={{color: 'var(--dao-foreground)'}}>
                  {formatAddress(walletAddress)}
                </p>
              </div>

              {/* ZK Session Hash */}
              <div 
                className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-xl border`}
                style={{
                  backgroundColor: 'var(--dao-card-secondary)',
                  borderColor: 'var(--dao-border)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Shield className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} style={{color: 'var(--dao-accent-purple)'}} />
                    <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-medium`} style={{color: 'var(--dao-foreground)'}}>
                      {isMobile ? 'ZK Hash' : 'ZK Session Hash'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(zkSessionHash, 'ZK session hash')}
                    className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} p-0`}
                  >
                    <Copy className={`${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
                  </Button>
                </div>
                <p className={`font-mono ${isMobile ? 'text-xs' : 'text-xs'} text-left`} style={{color: 'var(--dao-foreground)'}}>
                  {formatZkHash(zkSessionHash)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-2">
            {/* Auto-redirect notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className={`flex items-center justify-center space-x-2 ${textSize} opacity-70`} style={{color: 'var(--dao-foreground)'}}>
                <span>Redirecting in</span>
                <span 
                  className={`font-bold px-1.5 py-0.5 rounded-md ${textSize}`}
                  style={{backgroundColor: 'var(--dao-accent-blue)', color: 'white'}}
                >
                  {countdown}s
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-2"
            >
              <Button
                onClick={onClose}
                className={`flex-1 rounded-xl dao-gradient-blue text-white border-0 ${textSize} ${isMobile ? 'py-1.5 h-auto' : 'py-2 h-auto'}`}
              >
                Continue
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://vcc.gitbook.io/m9dao-project/proposal/3rdstage-voting-app/proposal-draft', '_blank')}
                className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} p-0 rounded-xl`}
                style={{borderColor: 'var(--dao-border)'}}
              >
                <ExternalLink className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </Button>
            </motion.div>

            {/* Access Without Wallet */}
            {onAccessWithoutWallet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Button
                  variant="ghost"
                  className={`${textSize} opacity-60 h-auto ${isMobile ? 'py-1' : 'py-1'}`}
                  style={{color: 'var(--dao-foreground)'}}
                  onClick={() => {
                    onAccessWithoutWallet();
                    onClose();
                  }}
                >
                  Access Without Wallet
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}