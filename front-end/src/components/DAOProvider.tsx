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
    description: 'Proposal to integrate NIGHT tokens for enhanced privacy staking mechanisms. This proposal would allow users to stake their NIGHT tokens to participate in private governance while maintaining anonymity through zero-knowledge proofs. The staking mechanism would provide additional voting power and privacy features for M9 DAO participants.',
    creator: '0x742d35Cc6e7CB5f5D4C3F3E4d1F2A8B9C0D7E6F8',
    createdAt: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    status: 'active',
    phase: 'commit',
    voteCount: 342,
    participationRate: 68,
    requiredTokens: {
      night: 100
    },
    tokenType: 'NIGHT',
    threshold: 60,
    results: {
      yes: 234,
      no: 87,
      abstain: 21
    }
  },
  {
    id: '2',
    title: 'Treasury Management: WADA Allocation for Development',
    description: 'Allocate 50,000 WADA from the treasury for continued development of privacy features and ZK-SNARK implementations. This funding would support the development team in enhancing the privacy voting mechanisms and expanding the DAO\'s technical capabilities.',
    creator: '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
    createdAt: new Date('2024-01-10'),
    deadline: new Date('2024-02-10'),
    status: 'active',
    phase: 'reveal',
    voteCount: 187,
    participationRate: 45,
    requiredTokens: {
      wada: 1000
    },
    tokenType: 'WADA',
    threshold: 50,
    results: {
      yes: 124,
      no: 43,
      abstain: 20
    }
  },
  {
    id: '3',
    title: 'Governance Parameter Update: Voting Threshold',
    description: 'Update the minimum voting threshold from 5% to 3% of total token supply to increase participation in governance decisions.',
    creator: '0x9F8E7D6C5B4A3G2H1I0J9K8L7M6N5O4P3Q2R1S0T',
    createdAt: new Date('2024-01-08'),
    deadline: new Date('2024-02-08'),
    status: 'active',
    phase: 'tally',
    voteCount: 423,
    participationRate: 84,
    requiredTokens: {
      wada: 500,
      night: 50
    },
    tokenType: 'BOTH',
    threshold: 75
  },
  {
    id: '4',
    title: 'Partnership Proposal: Integration with Privacy Network',
    description: 'Establish a strategic partnership with leading privacy blockchain networks to enhance cross-chain privacy features.',
    creator: '0x5F4E3D2C1B0A9G8H7I6J5K4L3M2N1O0P9Q8R7S6T',
    createdAt: new Date('2024-01-05'),
    deadline: new Date('2024-01-20'),
    status: 'closed',
    voteCount: 298,
    participationRate: 59,
    requiredTokens: {
      wada: 2000
    },
    tokenType: 'WADA',
    threshold: 50,
    results: {
      yes: 201,
      no: 75,
      abstain: 22
    }
  },
  {
    id: '5',
    title: 'Enhanced ZK-SNARK Circuit Optimization',
    description: 'Upgrade the current ZK-SNARK implementation to use more efficient circuits, reducing proof generation time from 2 seconds to under 500ms while maintaining privacy guarantees.',
    creator: '0x8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B',
    createdAt: new Date('2024-01-20'),
    deadline: new Date('2024-02-20'),
    status: 'active',
    phase: 'commit',
    voteCount: 156,
    participationRate: 31,
    requiredTokens: {
      night: 150
    },
    tokenType: 'NIGHT',
    threshold: 65,
    results: {
      yes: 98,
      no: 45,
      abstain: 13
    }
  },
  {
    id: '6',
    title: 'Multi-Chain Bridge Implementation',
    description: 'Develop secure bridges to enable WADA and NIGHT token transfers across Ethereum, Polygon, and Avalanche networks with zero-knowledge privacy preservation.',
    creator: '0xF1E2D3C4B5A69788F9E0D1C2B3A4959687F8E9D0',
    createdAt: new Date('2024-01-18'),
    deadline: new Date('2024-02-18'),
    status: 'active',
    phase: 'reveal',
    voteCount: 289,
    participationRate: 58,
    requiredTokens: {
      wada: 2500,
      night: 200
    },
    tokenType: 'BOTH',
    threshold: 70,
    results: {
      yes: 189,
      no: 78,
      abstain: 22
    }
  },
  {
    id: '7',
    title: 'Community Incentive Program Launch',
    description: 'Establish a 100,000 NIGHT token reward pool for community contributions including bug bounties, documentation improvements, and educational content creation.',
    creator: '0x2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C',
    createdAt: new Date('2024-01-12'),
    deadline: new Date('2024-02-12'),
    status: 'pending',
    voteCount: 0,
    participationRate: 0,
    requiredTokens: {
      night: 75
    },
    tokenType: 'NIGHT',
    threshold: 55
  },
  {
    id: '8',
    title: 'DAO Constitution Amendment: Voting Period Extension',
    description: 'Extend minimum voting period from 7 days to 10 days to allow better participation from international community members across different time zones.',
    creator: '0x7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D',
    createdAt: new Date('2024-01-14'),
    deadline: new Date('2024-02-14'),
    status: 'active',
    phase: 'tally',
    voteCount: 512,
    participationRate: 91,
    requiredTokens: {
      wada: 250
    },
    tokenType: 'WADA',
    threshold: 80,
    results: {
      yes: 367,
      no: 121,
      abstain: 24
    }
  },
  {
    id: '9',
    title: 'Privacy-First Analytics Dashboard',
    description: 'Develop anonymous analytics dashboard for DAO metrics using differential privacy techniques to protect individual voting patterns while providing valuable insights.',
    creator: '0x3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E',
    createdAt: new Date('2024-01-16'),
    deadline: new Date('2024-02-16'),
    status: 'active',
    phase: 'commit',
    voteCount: 234,
    participationRate: 47,
    requiredTokens: {
      wada: 800,
      night: 100
    },
    tokenType: 'BOTH',
    threshold: 60,
    results: {
      yes: 156,
      no: 67,
      abstain: 11
    }
  },
  {
    id: '10',
    title: 'Emergency Protocol Upgrade Mechanism',
    description: 'Implement fast-track governance for critical security updates with reduced voting period but increased token requirements and higher approval threshold.',
    creator: '0x4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F',
    createdAt: new Date('2024-01-11'),
    deadline: new Date('2024-01-25'),
    status: 'closed',
    voteCount: 445,
    participationRate: 89,
    requiredTokens: {
      wada: 5000
    },
    tokenType: 'WADA',
    threshold: 85,
    results: {
      yes: 378,
      no: 56,
      abstain: 11
    }
  },
  {
    id: '11',
    title: 'Research Grant for Academic Partnerships',
    description: 'Allocate 25,000 WADA for research grants to universities studying privacy-preserving governance mechanisms and zero-knowledge voting systems.',
    creator: '0x5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A',
    createdAt: new Date('2024-01-09'),
    deadline: new Date('2024-02-09'),
    status: 'closed',
    voteCount: 187,
    participationRate: 37,
    requiredTokens: {
      wada: 1500
    },
    tokenType: 'WADA',
    threshold: 50,
    results: {
      yes: 134,
      no: 42,
      abstain: 11
    }
  },
  {
    id: '12',
    title: 'Mobile Wallet Integration Support',
    description: 'Add native support for mobile wallets including Trust Wallet and MetaMask Mobile to improve accessibility for mobile-first users in developing markets.',
    creator: '0x6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B',
    createdAt: new Date('2024-01-13'),
    deadline: new Date('2024-02-13'),
    status: 'active',
    phase: 'reveal',
    voteCount: 321,
    participationRate: 64,
    requiredTokens: {
      night: 80
    },
    tokenType: 'NIGHT',
    threshold: 55,
    results: {
      yes: 245,
      no: 61,
      abstain: 15
    }
  },
  {
    id: '13',
    title: 'Quadratic Voting Implementation',
    description: 'Introduce quadratic voting mechanism for certain proposal types to prevent whale dominance and improve democratic participation in governance decisions.',
    creator: '0x7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C',
    createdAt: new Date('2024-01-17'),
    deadline: new Date('2024-02-17'),
    status: 'active',
    phase: 'commit',
    voteCount: 198,
    participationRate: 40,
    requiredTokens: {
      wada: 1000,
      night: 125
    },
    tokenType: 'BOTH',
    threshold: 65,
    results: {
      yes: 123,
      no: 62,
      abstain: 13
    }
  },
  {
    id: '14',
    title: 'Liquidity Mining Program for NIGHT/WADA Pools',
    description: 'Launch liquidity mining rewards for providing liquidity to NIGHT/WADA trading pairs on decentralized exchanges to improve token accessibility.',
    creator: '0x8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D',
    createdAt: new Date('2024-01-06'),
    deadline: new Date('2024-01-30'),
    status: 'closed',
    voteCount: 367,
    participationRate: 73,
    requiredTokens: {
      night: 100
    },
    tokenType: 'NIGHT',
    threshold: 60,
    results: {
      yes: 267,
      no: 85,
      abstain: 15
    }
  },
  {
    id: '15',
    title: 'DAO Governance Token Split Proposal',
    description: 'Split governance tokens to reduce minimum participation thresholds and make governance more accessible to smaller token holders while maintaining security.',
    creator: '0x9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E',
    createdAt: new Date('2024-01-19'),
    deadline: new Date('2024-02-19'),
    status: 'active',
    phase: 'reveal',
    voteCount: 456,
    participationRate: 91,
    requiredTokens: {
      wada: 500
    },
    tokenType: 'WADA',
    threshold: 75,
    results: {
      yes: 298,
      no: 134,
      abstain: 24
    }
  },
  {
    id: '16',
    title: 'Privacy Education Initiative Funding',
    description: 'Allocate resources for privacy education workshops, webinars, and content creation to promote understanding of zero-knowledge technologies in the broader community.',
    creator: '0x0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F',
    createdAt: new Date('2024-01-21'),
    deadline: new Date('2024-02-21'),
    status: 'pending',
    voteCount: 0,
    participationRate: 0,
    requiredTokens: {
      night: 60
    },
    tokenType: 'NIGHT',
    threshold: 50
  },
  {
    id: '17',
    title: 'Cross-Protocol Privacy Standards Development',
    description: 'Collaborate with other privacy-focused protocols to develop industry standards for anonymous governance and voting systems interoperability.',
    creator: '0x1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A',
    createdAt: new Date('2024-01-07'),
    deadline: new Date('2024-02-07'),
    status: 'closed',
    voteCount: 289,
    participationRate: 58,
    requiredTokens: {
      wada: 2000,
      night: 150
    },
    tokenType: 'BOTH',
    threshold: 70,
    results: {
      yes: 201,
      no: 67,
      abstain: 21
    }
  },
  {
    id: '18',
    title: 'Automated Market Maker for NIGHT Token',
    description: 'Deploy an AMM specifically for NIGHT token trading with privacy-preserving order matching to maintain anonymity during token exchanges.',
    creator: '0x2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B',
    createdAt: new Date('2024-01-22'),
    deadline: new Date('2024-02-22'),
    status: 'active',
    phase: 'commit',
    voteCount: 178,
    participationRate: 36,
    requiredTokens: {
      night: 200
    },
    tokenType: 'NIGHT',
    threshold: 65,
    results: {
      yes: 112,
      no: 54,
      abstain: 12
    }
  },
  {
    id: '19',
    title: 'DAO Insurance Fund Establishment',
    description: 'Create an insurance fund using 5% of treasury to protect against smart contract vulnerabilities and potential governance attacks on the DAO infrastructure.',
    creator: '0x3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C',
    createdAt: new Date('2024-01-04'),
    deadline: new Date('2024-01-18'),
    status: 'closed',
    voteCount: 523,
    participationRate: 95,
    requiredTokens: {
      wada: 3000
    },
    tokenType: 'WADA',
    threshold: 80,
    results: {
      yes: 423,
      no: 78,
      abstain: 22
    }
  },
  {
    id: '20',
    title: 'Zero-Knowledge Identity Verification System',
    description: 'Implement optional identity verification using zero-knowledge proofs to enable compliance features while preserving privacy for users who choose to participate.',
    creator: '0x4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D',
    createdAt: new Date('2024-01-23'),
    deadline: new Date('2024-02-23'),
    status: 'active',
    phase: 'reveal',
    voteCount: 267,
    participationRate: 53,
    requiredTokens: {
      wada: 1200,
      night: 180
    },
    tokenType: 'BOTH',
    threshold: 70,
    results: {
      yes: 178,
      no: 71,
      abstain: 18
    }
  },
  {
    id: '21',
    title: 'Decentralized Content Moderation Framework',
    description: 'Develop privacy-preserving content moderation system for DAO communications using anonymous reporting and zero-knowledge reputation scoring.',
    creator: '0x5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E',
    createdAt: new Date('2024-01-24'),
    deadline: new Date('2024-02-24'),
    status: 'pending',
    voteCount: 0,
    participationRate: 0,
    requiredTokens: {
      night: 90
    },
    tokenType: 'NIGHT',
    threshold: 55
  },
  {
    id: '22',
    title: 'Privacy-Preserving Reputation System',
    description: 'Launch anonymous reputation tracking for DAO participants based on voting history and proposal quality without revealing individual identities.',
    creator: '0x6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F',
    createdAt: new Date('2024-01-25'),
    deadline: new Date('2024-02-25'),
    status: 'active',
    phase: 'commit',
    voteCount: 134,
    participationRate: 27,
    requiredTokens: {
      wada: 800
    },
    tokenType: 'WADA',
    threshold: 60,
    results: {
      yes: 89,
      no: 38,
      abstain: 7
    }
  },
  {
    id: '23',
    title: 'Open Source Development Bounty Program',
    description: 'Establish ongoing bounty program for open source contributions to M9 DAO infrastructure with rewards paid in NIGHT tokens for verified contributions.',
    creator: '0x7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A',
    createdAt: new Date('2024-01-03'),
    deadline: new Date('2024-01-17'),
    status: 'closed',
    voteCount: 398,
    participationRate: 80,
    requiredTokens: {
      night: 120
    },
    tokenType: 'NIGHT',
    threshold: 65,
    results: {
      yes: 312,
      no: 69,
      abstain: 17
    }
  },
  {
    id: '24',
    title: 'Layer 2 Scaling Solution Implementation',
    description: 'Deploy M9 DAO governance on a layer 2 solution to reduce transaction costs while maintaining zero-knowledge privacy guarantees for all voting activities.',
    creator: '0x8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B',
    createdAt: new Date('2024-01-26'),
    deadline: new Date('2024-02-26'),
    status: 'active',
    phase: 'reveal',
    voteCount: 445,
    participationRate: 89,
    requiredTokens: {
      wada: 2500,
      night: 250
    },
    tokenType: 'BOTH',
    threshold: 75,
    results: {
      yes: 334,
      no: 89,
      abstain: 22
    }
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
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const connectionTime = new Date();
    const zkSessionHash = 'zk_session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
    
    const mockWallet: Wallet = {
      address: walletType === 'midnight' 
        ? '0x742d35Cc6e7CB5f5D4C3F3E4d1F2A8B9C0D7E6F8'
        : walletType === 'lace'
        ? '0x5F4E3D2C1B0A9G8H7I6J5K4L3M2N1O0P9Q8R7S6T'
        : '0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T',
      balance: walletType === 'midnight' ? 15420 : walletType === 'lace' ? 12300 : 8750, // WADA balance
      nightBalance: walletType === 'midnight' ? 2314 : walletType === 'lace' ? 1845 : 1890, // NIGHT token balance
      isConnected: true,
      network: 'mainnet',
      type: walletType,
      zkProofKey: 'zk_proof_key_' + Math.random().toString(36).substr(2, 9)
    };
    
    setWallet(mockWallet);
    setIsGuestMode(false); // Exit guest mode when connecting wallet
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
    setVotes([]); // Clear votes when disconnecting
    setTempProjects([]); // Clear temporary projects when disconnecting
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
      memberCount: 1, // Creator is the first member
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
    
    // Simulate ZK proof generation - always succeed for demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Always set to success to match user's requirement
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
    
    // Update proposal vote count
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, voteCount: proposal.voteCount + 1 }
        : proposal
    ));
  };

  const revealVote = async (proposalId: string, choice: 'yes' | 'no' | 'abstain', secret: string): Promise<void> => {
    if (!wallet) throw new Error('Wallet not connected');
    
    // Find the user's vote and mark it as revealed
    setVotes(prev => prev.map(vote => 
      vote.proposalId === proposalId && vote.voter === wallet.address
        ? { ...vote, revealed: true }
        : vote
    ));
    
    // In a real implementation, this would verify the secret matches the commitment
    console.log('Vote revealed:', { proposalId, choice, secret });
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