import React, { useState, useEffect } from 'react';
import { Vote, Zap, ArrowRight, ExternalLink, Lock, Users, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { AppHeader } from './AppHeader';
import { DemoNoticeModal } from './DemoNoticeModal';
import m9Logo from '../assets/f45b2fc73c3a8a5b34e9c23d1b875d47c63c77ca.png';

import { FeedbackButton } from './FeedbackButton';

interface LandingScreenProps {
  onGoToApp: () => void;
}

export function LandingScreen({ onGoToApp }: LandingScreenProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    // Show demo modal after a short delay when component mounts
    const timer = setTimeout(() => {
      setShowDemoModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTechDocs = () => {
    window.open('https://vcc.gitbook.io/m9dao-project/proposal/3rdstage-voting-app/proposal-draft', '_blank');
  };

  const handleDemoModalClose = () => {
    setShowDemoModal(false);
  };

  return (
    <div>
      <AppHeader onNavigateToApp={onGoToApp} />
  <main className="relative overflow-y-auto min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full dao-gradient-blue blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" 
               style={{background: 'linear-gradient(135deg, var(--dao-accent-purple), var(--dao-accent-blue))'}}></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="dao-text-gradient">M9 Privacy</span>
              {/* ...no misplaced return or div here... */}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl mb-12 opacity-80 max-w-3xl mx-auto leading-relaxed"
               style={{color: 'var(--dao-foreground)'}}>
              The next generation of DAO governance with{' '}
              <span className="dao-text-gradient font-semibold">Zero-Knowledge privacy</span>,{' '}
              anonymous voting, and cryptographic security
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">

              <Button
                onClick={onGoToApp}
                size="lg"
                className="text-lg px-12 py-6 rounded-2xl dao-gradient-blue text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                <ArrowRight className="w-6 h-6 mr-3" />
                Go to App
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleTechDocs}
                className="text-lg px-12 py-6 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: 'var(--dao-border)',
                  color: 'var(--dao-foreground)'
                }}
              >
                <ExternalLink className="w-6 h-6 mr-3" />
                Tech Docs
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" style={{color: 'var(--dao-foreground)'}}>
                Revolutionary Governance Features
              </h2>
              <p className="text-xl opacity-70 max-w-2xl mx-auto" style={{color: 'var(--dao-foreground)'}}>
                Built with cutting-edge cryptography and privacy-preserving technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ZK Privacy */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{backgroundColor: 'var(--dao-accent-blue)'}}>
                  <img src={m9Logo} alt="M9 Logo" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  Zero-Knowledge Privacy
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Cast votes anonymously with cryptographic proofs that ensure validity without revealing your identity or choice
                </p>
              </div>

              {/* Commit-Reveal */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{background: 'linear-gradient(135deg, var(--dao-accent-purple), var(--dao-accent-blue))'}}>
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  Commit-Reveal Protocol
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Two-phase voting process that prevents vote manipulation and ensures fair, transparent governance
                </p>
              </div>

              {/* NIGHT Token */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{backgroundColor: 'var(--dao-success)'}}>
                  <img src={m9Logo} alt="NIGHT Token" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  NIGHT Token Powered
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Native NIGHT token integration for governance, staking, and privacy-preserving transactions
                </p>
              </div>

              {/* Fast & Secure */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{backgroundColor: 'var(--dao-warning)'}}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  Fast & Secure
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Instant vote verification with military-grade cryptographic security and real-time result updates
                </p>
              </div>

              {/* Transparent Results */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{backgroundColor: 'var(--dao-accent-blue)'}}>
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  Transparent Results
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Publicly verifiable results with cryptographic proofs while maintaining complete voter anonymity
                </p>
              </div>

              {/* Easy to Use */}
              <div className="dao-card p-8 text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                     style={{backgroundColor: 'var(--dao-accent-purple)'}}>
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                  Intuitive Interface
                </h3>
                <p className="opacity-70 leading-relaxed" style={{color: 'var(--dao-foreground)'}}>
                  Complex cryptography made simple with an elegant, user-friendly interface that anyone can use
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="dao-card p-12">
              <h2 className="text-4xl font-bold mb-6" style={{color: 'var(--dao-foreground)'}}>
                Ready to Experience Private Governance?
              </h2>
              <p className="text-xl opacity-70 mb-8" style={{color: 'var(--dao-foreground)'}}>
                Join the future of decentralized decision making with cutting-edge privacy technology
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onGoToApp}
                  size="lg"
                  className="text-lg px-10 py-4 rounded-2xl dao-gradient-blue text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Launch M9 Privacy Voting
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleTechDocs}
                  className="text-lg px-10 py-4 rounded-2xl transition-all duration-300"
                  style={{
                    borderColor: 'var(--dao-border)',
                    color: 'var(--dao-foreground)'
                  }}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Read Technical Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-6 border-t" style={{borderColor: 'var(--dao-border)'}}>
          <div className="max-w-6xl mx-auto text-center">
            <p className="opacity-50" style={{color: 'var(--dao-foreground)'}}>
              M9 Privacy Voting â€¢ Secure â€¢ Anonymous â€¢ Decentralized
            </p>
          </div>
        </footer>
      </main>

      {/* Feedback Button fixed at bottom right */}
      <FeedbackButton />

      {/* Demo Notice Modal */}
      <DemoNoticeModal 
        isOpen={showDemoModal} 
        onClose={handleDemoModalClose} 
      />
    </div>
  );
}
