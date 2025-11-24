import React, { useState } from 'react';
import { ArrowLeft, Lock, Unlock, BarChart3, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useDAO } from './DAOProvider';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface VotingScreenProps {
  proposalId: string;
  onBack: () => void;
  onComplete: () => void;
}

export function VotingScreen({ proposalId, onBack, onComplete }: VotingScreenProps) {
  const { proposals, submitVote, revealVote, generateZKProof, zkProofStatus } = useDAO();
  const proposal = proposals.find(p => p.id === proposalId);
  
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(null);
  const [secret, setSecret] = useState('');
  const [revealData, setRevealData] = useState({ vote: '', secret: '' });
  const [step, setStep] = useState<'select' | 'proof' | 'submit' | 'reveal'>('select');

  // Reset to selection step if user comes back to the voting screen
  React.useEffect(() => {
    setStep('select');
    setSelectedVote(null);
    setSecret('');
  }, [proposalId]);

  if (!proposal) return null;

  const isCommitPhase = proposal.phase === 'commit';
  const isRevealPhase = proposal.phase === 'reveal';

  const phases = [
    { key: 'commit', label: 'Commit', icon: Lock, active: isCommitPhase },
    { key: 'reveal', label: 'Reveal', icon: Unlock, active: isRevealPhase },
    { key: 'tally', label: 'Tally', icon: BarChart3, active: proposal.phase === 'tally' }
  ];

  const currentPhaseIndex = phases.findIndex(phase => phase.active);

  const handleVoteSelection = (vote: 'yes' | 'no' | 'abstain') => {
    setSelectedVote(vote);
    setSecret(Math.random().toString(36).substring(2, 15)); // Generate random secret
  };

  const handleGenerateProof = async () => {
    if (!selectedVote) return;
    setStep('proof');
    await generateZKProof(selectedVote);
    // The status will be automatically updated by the provider
    // After a short delay, move to submit step if successful
    setTimeout(() => {
      if (zkProofStatus === 'success') {
        setStep('submit');
      }
    }, 500);
  };

  const handleSubmitCommit = async () => {
    if (!selectedVote || !secret) return;
    try {
      await submitVote(proposalId, selectedVote, secret);
      
      // Show success notification
      toast.success('Vote Submitted Successfully!', {
        description: `Your ${selectedVote.toUpperCase()} vote has been committed with zero-knowledge privacy.`,
        duration: 5000,
        action: {
          label: 'View Details',
          onClick: () => onComplete()
        }
      });
      
      // Small delay to show toast then navigate
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      toast.error('Vote Submission Failed', {
        description: 'Please try again or contact support.',
        duration: 5000
      });
    }
  };

  const handleSubmitReveal = async () => {
    if (!revealData.vote || !revealData.secret) return;
    try {
      await revealVote(proposalId, revealData.vote as 'yes' | 'no' | 'abstain', revealData.secret);
      
      // Show success notification
      toast.success('Vote Revealed Successfully!', {
        description: `Your ${revealData.vote.toUpperCase()} vote has been revealed and counted.`,
        duration: 5000,
        action: {
          label: 'View Results',
          onClick: () => onComplete()
        }
      });
      
      // Small delay to show toast then navigate
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      toast.error('Vote Reveal Failed', {
        description: 'Please check your vote and secret key.',
        duration: 5000
      });
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'yes': return 'var(--dao-success)';
      case 'no': return 'var(--dao-error)';
      case 'abstain': return 'var(--dao-foreground)';
      default: return 'var(--dao-border)';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-xl"
          style={{
            borderColor: 'var(--dao-border)',
            color: 'var(--dao-foreground)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold dao-text-gradient">
            {isCommitPhase ? 'Cast Your Vote' : 'Reveal Your Vote'}
          </h1>
          <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
            {proposal.title}
          </p>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="dao-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = phase.active;
            const isPast = index < currentPhaseIndex;
            const isFuture = index > currentPhaseIndex;
            
            return (
              <React.Fragment key={phase.key}>
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive ? 'shadow-lg' : ''
                    }`}
                    style={{
                      backgroundColor: isActive 
                        ? (phase.key === 'commit' ? 'var(--dao-warning)' : 
                           phase.key === 'reveal' ? 'var(--dao-accent-blue)' : 'var(--dao-success)')
                        : isPast ? 'var(--dao-success)' : 'var(--dao-border)',
                      opacity: isFuture ? 0.5 : 1
                    }}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}
                        style={{color: isActive ? 'var(--dao-foreground)' : 'var(--dao-foreground)', opacity: isFuture ? 0.5 : 1}}>
                    {phase.label}
                  </span>
                </div>
                {index < phases.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 rounded-full"
                       style={{backgroundColor: index < currentPhaseIndex ? 'var(--dao-success)' : 'var(--dao-border)'}}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Commit Phase */}
        {isCommitPhase && (
          <div className="space-y-6">
            {/* Info Alert */}
            <Alert className="dao-card border-0">
              <Shield className="h-4 w-4" style={{color: 'var(--dao-accent-blue)'}} />
              <AlertDescription style={{color: 'var(--dao-foreground)'}}>
                Your vote is encrypted and cannot be linked to you. The ZK proof ensures vote validity without revealing your choice.
              </AlertDescription>
            </Alert>

            {/* Vote Selection */}
            {step === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--dao-foreground)'}}>
                  Select Your Vote
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['yes', 'no', 'abstain'] as const).map((vote) => (
                    <motion.button
                      key={vote}
                      onClick={() => handleVoteSelection(vote)}
                      className={`dao-card p-6 text-center transition-all duration-300 ${
                        selectedVote === vote ? 'ring-2 shadow-lg transform scale-105' : ''
                      }`}
                      style={{
                        ringColor: selectedVote === vote ? getVoteColor(vote) : 'transparent',
                        borderColor: selectedVote === vote ? getVoteColor(vote) : 'var(--dao-border)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-4xl mb-3">
                        {vote === 'yes' ? '✅' : vote === 'no' ? '❌' : '⚪'}
                      </div>
                      <h4 className="font-semibold text-lg mb-2" style={{color: getVoteColor(vote)}}>
                        {vote.charAt(0).toUpperCase() + vote.slice(1)}
                      </h4>
                      <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                        {vote === 'yes' ? 'Support the proposal' : 
                         vote === 'no' ? 'Oppose the proposal' : 'No preference'}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {selectedVote && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleGenerateProof}
                      disabled={!selectedVote}
                      className="w-full rounded-xl py-4 dao-gradient-blue text-white border-0"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Generate ZK Proof
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ZK Proof Generation */}
            {step === 'proof' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dao-card p-8 text-center"
              >
                <div className="mb-6">
                  {zkProofStatus === 'generating' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-16 h-16 mx-auto" style={{color: 'var(--dao-accent-blue)'}} />
                    </motion.div>
                  )}
                  {zkProofStatus === 'success' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle className="w-16 h-16 mx-auto" style={{color: 'var(--dao-success)'}} />
                    </motion.div>
                  )}
                  {zkProofStatus === 'error' && (
                    <AlertCircle className="w-16 h-16 mx-auto" style={{color: 'var(--dao-error)'}} />
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--dao-foreground)'}}>
                  {zkProofStatus === 'generating' ? 'Generating ZK Proof...' :
                   zkProofStatus === 'success' ? 'Proof Generation Success!' :
                   'Proof Generation Failed'}
                </h3>
                
                <p className="opacity-70 mb-6" style={{color: 'var(--dao-foreground)'}}>
                  {zkProofStatus === 'generating' ? 'Creating cryptographic proof of your vote validity...' :
                   zkProofStatus === 'success' ? 'Your vote is ready to be submitted anonymously with complete privacy.' :
                   'Please try again or contact support.'}
                </p>

                {zkProofStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => setStep('submit')}
                      className="dao-gradient-blue text-white rounded-xl px-8 py-3"
                    >
                      Continue to Submit
                    </Button>
                  </motion.div>
                )}

                {zkProofStatus === 'error' && (
                  <Button
                    onClick={() => {
                      setStep('select');
                      // Reset the zkProofStatus when trying again
                    }}
                    variant="outline"
                    className="rounded-xl"
                    style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
                  >
                    Try Again
                  </Button>
                )}
              </motion.div>
            )}

            {/* Submit Commit */}
            {step === 'submit' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="dao-card p-6">
                  <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--dao-foreground)'}}>
                    Submit Your Commit
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label style={{color: 'var(--dao-foreground)'}}>Selected Vote</Label>
                      <div className="mt-2 p-3 rounded-xl dao-card flex items-center space-x-3">
                        <span className="text-2xl">
                          {selectedVote === 'yes' ? '✅' : selectedVote === 'no' ? '❌' : '⚪'}
                        </span>
                        <span className="font-semibold" style={{color: getVoteColor(selectedVote!)}}>
                          {selectedVote?.charAt(0).toUpperCase() + selectedVote?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label style={{color: 'var(--dao-foreground)'}}>ZK Proof Hash</Label>
                      <Input
                        readOnly
                        value={`zk_${Math.random().toString(36).substring(2, 15)}`}
                        className="mt-2 font-mono rounded-xl"
                        style={{
                          backgroundColor: 'var(--dao-background)',
                          borderColor: 'var(--dao-border)',
                          color: 'var(--dao-foreground)'
                        }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitCommit}
                    className="w-full mt-6 rounded-xl py-3 dao-gradient-blue text-white border-0"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Submit Commit
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Reveal Phase */}
        {isRevealPhase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Alert className="dao-card border-0">
              <Unlock className="h-4 w-4" style={{color: 'var(--dao-accent-blue)'}} />
              <AlertDescription style={{color: 'var(--dao-foreground)'}}>
                Enter your original vote and secret key to reveal your commitment and contribute to the final tally.
              </AlertDescription>
            </Alert>

            <div className="dao-card p-6">
              <h3 className="text-xl font-semibold mb-6" style={{color: 'var(--dao-foreground)'}}>
                Reveal Your Vote
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="reveal-vote" style={{color: 'var(--dao-foreground)'}}>
                    Original Vote Value
                  </Label>
                  <Input
                    id="reveal-vote"
                    placeholder="yes, no, or abstain"
                    value={revealData.vote}
                    onChange={(e) => setRevealData(prev => ({ ...prev, vote: e.target.value }))}
                    className="mt-2 rounded-xl"
                    style={{
                      backgroundColor: 'var(--dao-card)',
                      borderColor: 'var(--dao-border)',
                      color: 'var(--dao-foreground)'
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="reveal-secret" style={{color: 'var(--dao-foreground)'}}>
                    Secret Key
                  </Label>
                  <Input
                    id="reveal-secret"
                    placeholder="Enter your secret key from the commit phase"
                    value={revealData.secret}
                    onChange={(e) => setRevealData(prev => ({ ...prev, secret: e.target.value }))}
                    className="mt-2 rounded-xl font-mono"
                    style={{
                      backgroundColor: 'var(--dao-card)',
                      borderColor: 'var(--dao-border)',
                      color: 'var(--dao-foreground)'
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmitReveal}
                disabled={!revealData.vote || !revealData.secret}
                className="w-full mt-6 rounded-xl py-3 dao-gradient-blue text-white border-0 disabled:opacity-50"
              >
                <Unlock className="w-5 h-5 mr-2" />
                Submit Reveal
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}