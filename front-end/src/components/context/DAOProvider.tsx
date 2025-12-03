import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Wallet {
  address: string;
  balance: number; // WADA balance
  nightBalance: number; // NIGHT token balance
  isConnected: boolean;
  network: 'mainnet' | 'testnet';
  type: 'midnight' | 'hydra' | 'lace';
  zkProofKey?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  deadline: Date;
  status: 'pending' | 'active' | 'closed';
  phase?: 'commit' | 'reveal' | 'tally';
  voteCount: number;
  participationRate: number;
  requiredTokens: {
    wada?: number;
    night?: number;
  };
  tokenType: 'WADA' | 'NIGHT' | 'BOTH';
  threshold: number; // Approval threshold percentage
  results?: {
    yes: number;
    no: number;
    abstain: number;
  };
  zkProof?: string;
}

export interface Vote {
  proposalId: string;
  voter: string;
  choice: 'yes' | 'no' | 'abstain';
  commitment: string;
  revealed: boolean;
  timestamp: Date;
  zkProof: string;
  tokenAmount: number;
  tokenType: 'WADA' | 'NIGHT';
}

export interface TempProject {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  type: 'public' | 'private';
  category: 'defi' | 'nft' | 'gaming' | 'dao' | 'infrastructure' | 'social';
  creator: string;
  createdAt: Date;
  memberCount: number;
  proposalCount: number;
  activeVotes: number;
  governanceToken: string;
  website?: string;
  discord?: string;
  twitter?: string;
  github?: string;
  logoUrl?: string;
  hasDetailedInfo: boolean;
}

interface DAOContextType {
  wallet: Wallet | null;
  isGuestMode: boolean;
  proposals: Proposal[];
  votes: Vote[];
  tempProjects: TempProject[];
  zkProofStatus: 'idle' | 'generating' | 'success' | 'error';
  setZkProofStatus: React.Dispatch<React.SetStateAction<'idle' | 'generating' | 'success' | 'error'>>;
  showWalletSelector: boolean;
  showConnectionPopup: boolean;
  connectionDetails: {
    walletType: 'midnight' | 'hydra' | 'lace' | null;
    connectionTime: Date | null;
    zkSessionHash: string | null;
  };
  connectWallet: (walletType: 'midnight' | 'hydra' | 'lace') => Promise<void>;
  disconnectWallet: () => void;
  enterGuestMode: () => void;
  setShowWalletSelector: (show: boolean) => void;
  setShowConnectionPopup: (show: boolean) => void;
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'voteCount' | 'status' | 'participationRate'>) => Promise<string>;
  createProject: (project: Omit<TempProject, 'id' | 'createdAt' | 'memberCount' | 'proposalCount' | 'activeVotes' | 'hasDetailedInfo'>) => Promise<string>;
  submitVote: (proposalId: string, choice: 'yes' | 'no' | 'abstain', secret: string) => Promise<void>;
  generateZKProof: (choice: 'yes' | 'no' | 'abstain') => Promise<void>;
  revealVote: (proposalId: string, choice: 'yes' | 'no' | 'abstain', secret: string) => Promise<void>;
  getProposal: (id: string) => Proposal | undefined;
  hasVoted: (proposalId: string) => boolean;
  getUserVote: (proposalId: string) => Vote | undefined;
}

const DAOContext = createContext<DAOContextType | undefined>(undefined);

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'NIGHT Token Integration for Privacy Staking',
    description: 'Proposal to integrate NIGHT tokens for enhanced privacy staking mechanisms.',
    creator: '0x742d35Cc6e7CB5f5D4C3F3E4d1F2A8B9C0D7E6F8',
    createdAt: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    status: 'active',
    phase: 'commit',
    voteCount: 342,
    participationRate: 68,
    requiredTokens: { night: 100 },
    tokenType: 'NIGHT',
    threshold: 60,
    results: { yes: 234, no: 87, abstain: 21 }
  },
  {
    id: '2',
    title: 'Treasury Management: WADA Allocation for Development',
    description: 'Allocate 50,000 WADA from the treasury for continued development.',
    creator: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
    createdAt: new Date('2024-01-10'),
    deadline: new Date('2024-02-10'),
    status: 'active',
    phase: 'reveal',
    voteCount: 187,
    participationRate: 45,
    requiredTokens: { wada: 1000 },
    tokenType: 'WADA',
    threshold: 50,
    results: { yes: 124, no: 43, abstain: 20 }
  }
];

export function DAOProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [tempProjects, setTempProjects] = useState<TempProject[]>([]);
  const [zkProofStatus, setZkProofStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<{
    walletType: 'midnight' | 'hydra' | 'lace' | null;
    connectionTime: Date | null;
    zkSessionHash: string | null;
  }>({
    walletType: null,
    connectionTime: null,
    zkSessionHash: null
  });

  const connectWallet = async (walletType: 'midnight' | 'hydra' | 'lace'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const connectionTime = new Date();
    const zkSessionHash = 'zk_session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    
    const mockWallet: Wallet = {
      address: walletType === 'midnight' 
        ? '0x742d35Cc6e7CB5f5D4C3F3E4d1F2A8B9C0D7E6F8'
        : walletType === 'lace'
        ? '0x5F4E3D2C1B0A9G8H7I6J5K4L3M2N1O0P9Q8R7S6T'
        : '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
      balance: walletType === 'midnight' ? 15420 : walletType === 'lace' ? 12300 : 8750,
      nightBalance: walletType === 'midnight' ? 2314 : walletType === 'lace' ? 1845 : 1890,
      isConnected: true,
      network: 'mainnet',
      type: walletType,
      zkProofKey: 'zk_proof_key_' + Math.random().toString(36).substr(2, 9)
    };
    
    setWallet(mockWallet);
    setIsGuestMode(false);
    setConnectionDetails({
      walletType,
      connectionTime,
      zkSessionHash
    });
    setShowWalletSelector(false);
    setShowConnectionPopup(true);
  };

  const disconnectWallet = (): void => {
    setWallet(null);
    setIsGuestMode(false);
    setVotes([]);
    setTempProjects([]);
    setConnectionDetails({
      walletType: null,
      connectionTime: null,
      zkSessionHash: null
    });
  };

  const enterGuestMode = (): void => {
    setIsGuestMode(true);
    setWallet(null);
    setShowWalletSelector(false);
  };

  const createProposal = async (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'voteCount' | 'status' | 'participationRate'>): Promise<string> => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      voteCount: 0,
      participationRate: 0,
      status: 'pending'
    };
    
    setProposals(prev => [newProposal, ...prev]);
    return newProposal.id;
  };

  const createProject = async (projectData: Omit<TempProject, 'id' | 'createdAt' | 'memberCount' | 'proposalCount' | 'activeVotes' | 'hasDetailedInfo'>): Promise<string> => {
    const newProject: TempProject = {
      ...projectData,
      id: 'temp_' + Date.now().toString(),
      createdAt: new Date(),
      memberCount: 1,
      proposalCount: 0,
      activeVotes: 0,
      hasDetailedInfo: false
    };
    
    setTempProjects(prev => [newProject, ...prev]);
    return newProject.id;
  };

  const generateZKProof = async (choice: 'yes' | 'no' | 'abstain'): Promise<void> => {
    if (!wallet) throw new Error('Wallet not connected');
    
    setZkProofStatus('generating');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setZkProofStatus('success');
  };

  const submitVote = async (proposalId: string, choice: 'yes' | 'no' | 'abstain', secret: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not connected');
    
    const newVote: Vote = {
      proposalId,
      voter: wallet.address,
      choice,
      commitment: `commit_${Math.random().toString(36).substr(2, 9)}`,
      revealed: false,
      timestamp: new Date(),
      zkProof: 'zk_proof_' + Math.random().toString(36).substr(2, 9),
      tokenAmount: 100,
      tokenType: 'WADA'
    };
    
    setVotes(prev => [...prev, newVote]);
    
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, voteCount: proposal.voteCount + 1 }
        : proposal
    ));
  };

  const revealVote = async (proposalId: string, choice: 'yes' | 'no' | 'abstain', secret: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not connected');
    
    setVotes(prev => prev.map(vote => 
      vote.proposalId === proposalId && vote.voter === wallet.address
        ? { ...vote, revealed: true }
        : vote
    ));
  };

  const getProposal = (id: string): Proposal | undefined => {
    return proposals.find(p => p.id === id);
  };

  const hasVoted = (proposalId: string): boolean => {
    return votes.some(vote => vote.proposalId === proposalId && vote.voter === wallet?.address);
  };

  const getUserVote = (proposalId: string): Vote | undefined => {
    return votes.find(vote => vote.proposalId === proposalId && vote.voter === wallet?.address);
  };

  return (
    <DAOContext.Provider value={{
      wallet,
      isGuestMode,
      proposals,
      votes,
      tempProjects,
      zkProofStatus,
      setZkProofStatus,
      showWalletSelector,
      showConnectionPopup,
      connectionDetails,
      connectWallet,
      disconnectWallet,
      enterGuestMode,
      setShowWalletSelector,
      setShowConnectionPopup,
      createProposal,
      createProject,
      submitVote,
      generateZKProof,
      revealVote,
      getProposal,
      hasVoted,
      getUserVote
    }}>
      {children}
    </DAOContext.Provider>
  );
}

export function useDAO() {
  const context = useContext(DAOContext);
  if (context === undefined) {
    throw new Error('useDAO must be used within a DAOProvider');
  }
  return context;
}
