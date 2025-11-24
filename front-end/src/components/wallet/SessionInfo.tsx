import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getTimeRemaining } from '../utils/walletUtils';

interface SessionInfoProps {
  sessionExpiry?: Date;
  isSessionExpiring: boolean;
}

export function SessionInfo({ sessionExpiry, isSessionExpiring }: SessionInfoProps) {
  return (
    <div className="dao-card p-6">
      <h3 className="text-xl font-semibold flex items-center mb-6" style={{color: 'var(--dao-foreground)'}}>
        <Clock className="w-6 h-6 mr-3" />
        Session Details
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span style={{color: 'var(--dao-foreground)'}}>Connection Status</span>
          <Badge 
            className="rounded-lg"
            style={{backgroundColor: 'var(--dao-success)', color: 'white'}}
          >
            Active
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span style={{color: 'var(--dao-foreground)'}}>Session Started</span>
          <span className="font-mono text-sm" style={{color: 'var(--dao-foreground)'}}>
            {new Date(Date.now() - 1800000).toLocaleTimeString()}
          </span>
        </div>

        {sessionExpiry && (
          <div className="flex items-center justify-between">
            <span style={{color: 'var(--dao-foreground)'}}>Session Expires</span>
            <span 
              className="font-mono text-sm"
              style={{color: isSessionExpiring ? 'var(--dao-warning)' : 'var(--dao-foreground)'}}
            >
              {getTimeRemaining(sessionExpiry)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span style={{color: 'var(--dao-foreground)'}}>Auto-lock</span>
          <Badge 
            variant="outline"
            className="rounded-lg"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            Enabled
          </Badge>
        </div>
      </div>
    </div>
  );
}