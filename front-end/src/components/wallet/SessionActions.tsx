import React from 'react';
import { Trash2, Clock, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface SessionActionsProps {
  onDisconnect: () => void;
}

export function SessionActions({ onDisconnect }: SessionActionsProps) {
  return (
    <div className="dao-card p-6">
      <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--dao-foreground)'}}>
        Session Actions
      </h3>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full rounded-xl justify-start"
          style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Clear Session Data
        </Button>

        <Button
          variant="outline"
          className="w-full rounded-xl justify-start"
          style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
        >
          <Clock className="w-4 h-4 mr-3" />
          Extend Session
        </Button>

        <Separator />

        <Button
          onClick={onDisconnect}
          className="w-full rounded-xl justify-start bg-red-500 hover:bg-red-600 text-white border-0"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Disconnect Wallet
        </Button>
      </div>
    </div>
  );
}