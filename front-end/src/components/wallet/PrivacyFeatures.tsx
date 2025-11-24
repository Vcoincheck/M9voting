import React from 'react';
import { Shield } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { PRIVACY_FEATURES } from '../utils/walletConstants';

export function PrivacyFeatures() {
  return (
    <div className="dao-card p-6">
      <h3 className="text-xl font-semibold flex items-center mb-6" style={{color: 'var(--dao-foreground)'}}>
        <Shield className="w-6 h-6 mr-3" />
        Privacy Features
      </h3>

      <div className="space-y-4">
        {PRIVACY_FEATURES.map((feature, index) => (
          <React.Fragment key={feature.title}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium" style={{color: 'var(--dao-foreground)'}}>
                  {feature.title}
                </div>
                <div className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                  {feature.description}
                </div>
              </div>
              <Badge 
                className="rounded-lg"
                style={{backgroundColor: 'var(--dao-success)', color: 'white'}}
              >
                {feature.status}
              </Badge>
            </div>
            {index < PRIVACY_FEATURES.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}