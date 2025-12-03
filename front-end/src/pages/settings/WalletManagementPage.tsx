import React from 'react';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useDAO } from '../../components/context';
import { WalletInfo } from '../../components/wallet/WalletInfo';
import { SessionInfo } from '../../components/wallet/SessionInfo';
import { PrivacyFeatures } from '../../components/wallet/PrivacyFeatures';
import { SessionActions } from '../../components/wallet/SessionActions';
import { SecurityTips } from '../../components/wallet/SecurityTips';
import { isSessionExpiring } from '../../components/utils/walletUtils';
import { useAppNavigation } from '../../hooks';

export function WalletManagementPage() {
  const nav = useAppNavigation();
  const { wallet, disconnectWallet } = useDAO();

  if (!wallet) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--dao-foreground)'}}>
            No Wallet Connected
          </h2>
          <Button onClick={() => nav.goBack()} className="dao-gradient-blue text-white rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const sessionExpiring = isSessionExpiring(wallet.sessionExpiry);

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => nav.goBack()}
          className="rounded-xl"
          style={{
            borderColor: 'var(--dao-border)',
            color: 'var(--dao-foreground)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold dao-text-gradient">Wallet & Session</h1>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            Manage your wallet connection and session security
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Security Warning */}
        <Alert className="dao-card border-0">
          <Shield className="h-4 w-4" style={{color: 'var(--dao-accent-blue)'}} />
          <AlertDescription style={{color: 'var(--dao-foreground)'}}>
            Always disconnect your wallet when finished to protect your privacy and prevent unauthorized access.
          </AlertDescription>
        </Alert>

        {/* Session Expiry Warning */}
        {sessionExpiring && (
          <Alert className="dao-card border-0" style={{borderColor: 'var(--dao-warning)'}}>
            <AlertTriangle className="h-4 w-4" style={{color: 'var(--dao-warning)'}} />
            <AlertDescription style={{color: 'var(--dao-foreground)'}}>
              Your session will expire soon. Please save any work and reconnect if needed.
            </AlertDescription>
          </Alert>
        )}

        <WalletInfo address={wallet.address} />
        <SessionInfo sessionExpiry={wallet.sessionExpiry} isSessionExpiring={sessionExpiring} />
        <PrivacyFeatures />
        <SessionActions onDisconnect={disconnectWallet} />
        <SecurityTips />
      </div>
    </div>
  );
}