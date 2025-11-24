import React from 'react';
import { SECURITY_TIPS } from '../utils/walletConstants';

export function SecurityTips() {
  return (
    <div className="dao-card p-6">
      <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
        Security Best Practices
      </h3>
      
      <ul className="space-y-2 text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
        {SECURITY_TIPS.map((tip, index) => (
          <li key={index}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}