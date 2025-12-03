import React, { useState } from 'react';
import { ArrowLeft, FileText, Coins, Shield, Eye, Plus, Lock, Percent, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useDAO } from '../../components/context';
import m9Logo from '../../assets/m9Logo.png';
import { useAppNavigation } from '../../hooks';

type Step = 1 | 2 | 3 | 4;
type AnonymityLevel = 'public' | 'full-zk' | 'threshold';
type TokenType = 'WADA' | 'NIGHT' | 'BOTH';

interface FormData {
  projectId: string;
  title: string;
  description: string;
  deadline: string;
  tokenType: TokenType;
  wadaRequired: string;
  nightRequired: string;
  threshold: string;
  anonymityLevel: AnonymityLevel;
  revealThreshold: number;
  allowDiscussion: boolean;
  templateId?: string;
  voterType?: 'token' | 'whitelist' | 'group';
  voterThreshold?: string;
  whitelistAddresses?: string;
  groupId?: string;
  proposalType?: 'general' | 'funding' | 'technical' | 'other';
  treasuryAddress?: string;
}

const steps = [
  { id: 1, title: 'Basic Details', icon: FileText },
  { id: 2, title: 'Token Requirements', icon: Coins },
  { id: 3, title: 'Privacy Settings', icon: Shield },
  { id: 4, title: 'Review', icon: Eye },
];

const proposalTemplates = [
  {
    id: 'funding',
    category: 'Funding',
    title: 'Treasury Funding Request',
    description: 'Request funding from the DAO treasury for development, marketing, or operational expenses.',
    defaultValues: { tokenType: 'BOTH' as TokenType, wadaRequired: '1000', nightRequired: '500', threshold: '60' },
    color: 'var(--dao-success)'
  },
  {
    id: 'governance',
    category: 'Governance',
    title: 'Protocol Upgrade Proposal',
    description: 'Propose changes to governance parameters, voting mechanisms, or protocol upgrades.',
    defaultValues: { tokenType: 'NIGHT' as TokenType, nightRequired: '1000', threshold: '75' },
    color: 'var(--dao-accent-blue)'
  },
  {
    id: 'technical',
    category: 'Technical',
    title: 'Privacy Feature Enhancement',
    description: 'Propose new privacy features or improvements to existing zero-knowledge mechanisms.',
    defaultValues: { tokenType: 'NIGHT' as TokenType, nightRequired: '750', threshold: '50' },
    color: 'var(--dao-accent-purple)'
  },
  {
    id: 'community',
    category: 'Community',
    title: 'Community Initiative',
    description: 'Propose community events, partnerships, or educational initiatives.',
    defaultValues: { tokenType: 'WADA' as TokenType, wadaRequired: '500', threshold: '50' },
    color: 'var(--dao-warning)'
  }
];

export function CreateProposalPage() {
  const nav = useAppNavigation();
  const { createProposal, wallet, tempProjects, proposals } = useDAO();
  // Mocked list of available projects for search/suggestion
  const allProjects = [
    { id: 'night-privacy', name: 'NIGHT Token Integration for Privacy Staking' },
    { id: 'treasury-wada', name: 'Treasury Management: WADA Allocation for Development' },
    { id: 'governance-threshold', name: 'Governance Parameter Update: Voting Threshold' },
    { id: 'privacy-network', name: 'Partnership Proposal: Integration with Privacy Network' },
    { id: 'zk-snark', name: 'Enhanced ZK-SNARK Circuit Optimization' },
    { id: 'multi-chain', name: 'Multi-Chain Bridge Implementation' },
    { id: 'community-incentive', name: 'Community Incentive Program Launch' },
    { id: 'constitution-amendment', name: 'DAO Constitution Amendment: Voting Period Extension' },
    { id: 'privacy-analytics', name: 'Privacy-First Analytics Dashboard' },
    { id: 'emergency-upgrade', name: 'Emergency Protocol Upgrade Mechanism' },
    { id: 'research-grant', name: 'Research Grant for Academic Partnerships' },
    { id: 'wallet-integration', name: 'Mobile Wallet Integration Support' },
    { id: 'quadratic-voting', name: 'Quadratic Voting Implementation' },
    { id: 'liquidity-mining', name: 'Liquidity Mining Program for NIGHT/WADA Pools' },
    { id: 'token-split', name: 'DAO Governance Token Split Proposal' },
  ];

  // State for project name input and suggestions
  // State for project name input and suggestions
  const [projectInput, setProjectInput] = useState<string>('');
  const matchingProjects = allProjects.filter((p) => p.name.includes(projectInput) && projectInput.length > 0);
  const isProjectValid = allProjects.some((p) => p.name === projectInput);

  // State for ZK hash popup
  const [zkHash, setZkHash] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectId: '',
    title: '',
    description: '',
    deadline: '',
    tokenType: 'WADA',
    wadaRequired: '',
    nightRequired: '',
    threshold: '50',
    anonymityLevel: 'public',
    revealThreshold: 75,
    allowDiscussion: true,
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev: Step) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev: Step) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!wallet) return;

    setIsLoading(true);
    try {
      const proposalData = {
        title: formData.title,
        description: formData.description,
        creator: wallet.address,
        deadline: new Date(formData.deadline),
        tokenType: formData.tokenType,
        requiredTokens: {
          ...(formData.tokenType === 'WADA' || formData.tokenType === 'BOTH' ? 
            { wada: parseInt(formData.wadaRequired) || 0 } : {}),
          ...(formData.tokenType === 'NIGHT' || formData.tokenType === 'BOTH' ? 
            { night: parseInt(formData.nightRequired) || 0 } : {})
        },
        threshold: parseInt(formData.threshold) || 50,
        anonymityLevel: formData.anonymityLevel,
        revealThreshold: formData.revealThreshold,
        allowDiscussion: formData.allowDiscussion
      };

      // Fake ZK hash proof (in thực tế lấy từ backend hoặc ZK service)
      const fakeZkHash = 'zk_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      setZkHash(fakeZkHash);

      await createProposal(proposalData);
      // onSuccess(); // Không gọi ngay để giữ popup
    } catch (error) {
      console.error('Failed to create proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = (step: Step): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.deadline);
      case 2:
        return !!(formData.threshold &&
          ((formData.tokenType === 'WADA' && formData.wadaRequired) ||
           (formData.tokenType === 'NIGHT' && formData.nightRequired) ||
           (formData.tokenType === 'BOTH' && formData.wadaRequired && formData.nightRequired)));
      case 3:
        return true; // Privacy settings always valid (has defaults)
      case 4:
        return isStepValid(1) && isStepValid(2) && isStepValid(3);
      default:
        return false;
    }
  };

  const loadTemplate = (template: typeof proposalTemplates[0]) => {
    setFormData({
      ...formData,
      ...template.defaultValues,
      templateId: template.id,
    });
  };

  return (
    <TooltipProvider>
      {/* ZK Hash Proof Popup */}
      {zkHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center justify-center p-10" style={{minWidth: 340, position: 'relative'}}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full bg-transparent"
                onClick={() => { setZkHash(null); onSuccess(); }}
                aria-label="Close"
                style={{lineHeight: 1, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <span aria-hidden="true">×</span>
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">Proposal ZK Hash Proof</h2>
              <div className="break-all text-blue-700 dark:text-blue-300 text-lg font-mono mb-6 px-2 py-3 rounded-lg bg-blue-50 dark:bg-gray-800 w-full text-center" style={{wordBreak: 'break-all'}}>{zkHash}</div>
              <div className="text-xs opacity-70 text-center">Save this hash to verify the proposal on the ZK system.</div>
            </div>
          </div>
        </div>
      )}
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav.goBack()}
            className="rounded-xl"
            style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold dao-text-gradient">Create New Proposal</h1>
            <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
              Submit a privacy-first proposal for community voting
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator currentStep={currentStep} steps={steps} isStepValid={isStepValid} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="dao-card p-6 mb-6">
              {currentStep === 1 && (
                <BasicDetailsStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  allProjects={allProjects}
                />
              )}
              {currentStep === 2 && (
                <TokenRequirementsStep 
                  formData={formData} 
                  setFormData={setFormData} 
                  wallet={wallet}
                />
              )}
              {currentStep === 3 && (
                <PrivacySettingsStep formData={formData} setFormData={setFormData} />
              )}
              {currentStep === 4 && (
                <ReviewStep formData={formData} />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="rounded-xl"
                style={{borderColor: 'var(--dao-border)', color: 'var(--dao-foreground)'}}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="rounded-xl dao-gradient-blue text-white border-0"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isLoading}
                  className="rounded-xl dao-gradient-blue text-white border-0"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Proposal
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Templates */}
            {currentStep === 1 && (
              <TemplateCards templates={proposalTemplates} onSelectTemplate={loadTemplate} selectedId={formData.templateId} />
            )}
            
            {/* Token Balance */}
            {currentStep === 2 && (
              <TokenBalanceCard wallet={wallet} />
            )}

            {/* Privacy Guide */}
            {currentStep === 3 && (
              <PrivacyGuideCard />
            )}

            {/* Live Preview */}
            <LivePreviewCard formData={formData} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Progress Indicator Component
function ProgressIndicator({ currentStep, steps, isStepValid }: {
  currentStep: Step;
  steps: Array<{ id: number; title: string; icon: any }>;
  isStepValid: (step: Step) => boolean;
}) {
  return (
    <div className="dao-card p-6">
      <div className="flex items-center justify-between">
  {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id && isStepValid(step.id as Step);
          const isValid = isStepValid(step.id as Step);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'dao-gradient-blue text-white' 
                    : isActive 
                      ? 'border-2 text-white dao-gradient-blue'
                      : 'border-2 text-gray-400'
                  }
                `} style={{
                  borderColor: isActive || isCompleted ? 'transparent' : 'var(--dao-border)'
                }}>
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${isActive ? 'dao-text-gradient' : ''}`} 
                       style={!isActive ? {color: 'var(--dao-foreground)'} : {}}>
                    {step.title}
                  </div>
                  <div className="text-xs opacity-60" style={{color: 'var(--dao-foreground)'}}>
                    Step {step.id}/4
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-20 h-0.5 mx-4 transition-all duration-300
                  ${isCompleted || (currentStep > step.id) ? 'dao-gradient-blue' : ''}
                `} style={{
                  backgroundColor: isCompleted || (currentStep > step.id) ? 'transparent' : 'var(--dao-border)'
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step 1: Basic Details
function BasicDetailsStep({ formData, setFormData, allProjects }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  allProjects: any[];
}) {
  const charCount = formData.description.length;
  const maxChars = 1000;
  // State for project name input and suggestions
  const [projectInput, setProjectInput] = useState<string>('');
  const matchingProjects = allProjects.filter((p: {name: string}) => p.name.includes(projectInput) && projectInput.length > 0);
  const isProjectValid = allProjects.some((p: {name: string}) => p.name === projectInput);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 dao-text-gradient">Basic Details</h2>
        <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Provide clear and comprehensive information about your proposal
        </p>
      </div>

      {/* Project Name Input & Suggestions */}
      <div style={{position: 'relative'}}>
        <Label htmlFor="project-input">Project Name</Label>
        <Input
          id="project-input"
          placeholder="Enter project name..."
          value={projectInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setProjectInput(e.target.value);
            setFormData({ ...formData, projectId: e.target.value });
          }}
          className="rounded-xl mb-2"
        />
        {/* Suggestions dropdown */}
        {matchingProjects.length > 0 && (
          <div
            className="max-h-40 overflow-y-auto border rounded-xl bg-white dark:bg-black shadow-xl"
            style={{
              position: 'absolute',
              zIndex: 50,
              width: '100%',
              background: 'rgba(221, 214, 214, 0.98)',
              top: 'calc(100% + 4px)',
              left: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              border: '1px solid var(--dao-border)',
            }}
          >
            {matchingProjects.map((project: {id: string, name: string}) => (
              <div
                key={project.id}
                className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800"
                onClick={() => {
                  setProjectInput(project.name);
                  setFormData({ ...formData, projectId: project.name });
                }}
              >
                {project.name}
              </div>
            ))}
          </div>
        )}
        {/* Warning if project name does not match */}
        {projectInput && !isProjectValid && (
          <div className="text-xs mt-1 text-red-500">You must create the project first.</div>
        )}
      </div>

      {/* Ai Có Thể Vote */}
      <div>
        <Label>Who can vote</Label>
  <Select value={formData.voterType || ''} onValueChange={(voterType: string) => setFormData({ ...formData, voterType: voterType as any })}>
          <SelectTrigger className="w-full rounded-xl mt-1">
            <SelectValue placeholder="Select the object that can vote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="token">Token Holders</SelectItem>
            <SelectItem value="whitelist">Whitelist</SelectItem>
            <SelectItem value="group">Specific Group</SelectItem>
          </SelectContent>
        </Select>
        {/* Token Holders threshold */}
        {formData.voterType === 'token' && (
          <div className="mt-2">
            <Label>Threshold (%)</Label>
            <Input
              type="number"
              min="1"
              max="100"
              placeholder="Input threshold (%)"
              value={formData.voterThreshold || ''}
              onChange={e => setFormData({ ...formData, voterThreshold: e.target.value })}
              className="rounded-xl"
            />
          </div>
        )}
        {/* Whitelist addresses */}
        {formData.voterType === 'whitelist' && (
          <div className="mt-2">
            <Label>Whitelist Addresses (1 address per line)</Label>
            <Textarea
              placeholder="0x123...\n0x456..."
              value={formData.whitelistAddresses || ''}
              onChange={e => setFormData({ ...formData, whitelistAddresses: e.target.value })}
              rows={3}
              className="rounded-xl"
            />
          </div>
        )}
        {/* Specific Group */}
        {formData.voterType === 'group' && (
          <div className="mt-2">
            <Label>Chọn nhóm</Label>
            <Select value={formData.groupId || ''} onValueChange={(groupId: string) => setFormData({ ...formData, groupId })}>
              <SelectTrigger className="w-full rounded-xl mt-1">
                <SelectValue placeholder="Choose group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group1">Group 1</SelectItem>
                <SelectItem value="group2">Group 2</SelectItem>
                <SelectItem value="group3">Group 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Loại Proposal */}
      <div>
        <Label>Proposal type</Label>
  <Select value={formData.proposalType || ''} onValueChange={(proposalType: string) => setFormData({ ...formData, proposalType: proposalType as any })}>
          <SelectTrigger className="w-full rounded-xl mt-1">
            <SelectValue placeholder="Choose proposal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="funding">Funding Request</SelectItem>
            <SelectItem value="technical">Technical Proposal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {formData.proposalType === 'funding' && (
          <div className="mt-2">
            <Label>Treasury Address</Label>
            <Input
              placeholder="Input treasury address..."
              value={formData.treasuryAddress || ''}
              onChange={e => setFormData({ ...formData, treasuryAddress: e.target.value })}
              className="rounded-xl"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="w-4 h-4 opacity-60" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Use a clear, descriptive title that summarizes your proposal</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="title"
            placeholder="e.g., Implement Cross-Chain Privacy Bridge"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="rounded-xl"
            maxLength={100}
          />
          <div className="text-xs opacity-60 mt-1" style={{color: 'var(--dao-foreground)'}}>
            {formData.title.length}/100 characters
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="description">Description</Label>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="w-4 h-4 opacity-60" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Provide detailed information including rationale, implementation, and expected outcomes</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="description"
            placeholder="Provide a comprehensive description of your proposal, including:
• Background and rationale
• Implementation details
• Expected benefits and outcomes
• Timeline and milestones
• Risk considerations"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={8}
            className="rounded-xl"
            maxLength={maxChars}
          />
          <div className={`text-xs mt-1 flex justify-between ${
            charCount > maxChars * 0.9 ? 'text-orange-500' : 'opacity-60'
          }`} style={{color: charCount > maxChars * 0.9 ? 'var(--dao-warning)' : 'var(--dao-foreground)'}}>
            <span>{charCount}/{maxChars} characters</span>
            {charCount > maxChars * 0.9 && <span>Approaching limit</span>}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="deadline">Voting Deadline</Label>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="w-4 h-4 opacity-60" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Set a reasonable deadline allowing adequate time for community discussion</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            className="rounded-xl"
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
          />
          <div className="text-xs opacity-60 mt-1" style={{color: 'var(--dao-foreground)'}}>
            Minimum 24 hours from now recommended
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Token Requirements  
function TokenRequirementsStep({ formData, setFormData, wallet }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  wallet: any;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 dao-text-gradient">Token Requirements</h2>
        <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Configure voting tokens and approval thresholds
        </p>
      </div>

      {/* Token Selection Cards */}
      <div className="space-y-4">
        <Label>Required Token Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['WADA', 'NIGHT', 'BOTH'] as TokenType[]).map((tokenType) => (
            <TokenCard
              key={tokenType}
              tokenType={tokenType}
              selected={formData.tokenType === tokenType}
              onSelect={() => setFormData({...formData, tokenType})}
              wallet={wallet}
            />
          ))}
        </div>
      </div>

      {/* Token Amount Requirements */}
      <div className="space-y-4">
        {(formData.tokenType === 'WADA' || formData.tokenType === 'BOTH') && (
          <div>
            <Label htmlFor="wadaRequired">Minimum WADA Required to Vote</Label>
            <Input
              id="wadaRequired"
              type="number"
              placeholder="0"
              value={formData.wadaRequired}
              onChange={(e) => setFormData({...formData, wadaRequired: e.target.value})}
              className="rounded-xl"
              min="1"
            />
            <div className="text-xs opacity-60 mt-1" style={{color: 'var(--dao-foreground)'}}>
              {wallet && `Your balance: ${wallet.balance.toLocaleString()} WADA`}
            </div>
          </div>
        )}

        {(formData.tokenType === 'NIGHT' || formData.tokenType === 'BOTH') && (
          <div>
            <Label htmlFor="nightRequired">Minimum NIGHT Required to Vote</Label>
            <Input
              id="nightRequired"
              type="number"
              placeholder="0"
              value={formData.nightRequired}
              onChange={(e) => setFormData({...formData, nightRequired: e.target.value})}
              className="rounded-xl"
              min="1"
            />
            <div className="text-xs opacity-60 mt-1" style={{color: 'var(--dao-foreground)'}}>
              {wallet && `Your balance: ${wallet.nightBalance.toLocaleString()} NIGHT`}
            </div>
          </div>
        )}
      </div>

      {/* Approval Threshold */}
      <div>
        <Label>Approval Threshold</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {[
            { value: '30', label: 'Low (30%)', desc: 'Quick decisions', color: 'var(--dao-success)' },
            { value: '50', label: 'Standard (50%)', desc: 'Balanced approach', color: 'var(--dao-warning)' },
            { value: '60', label: 'High (60%)', desc: 'Conservative', color: 'var(--dao-accent-blue)' },
            { value: '75', label: 'Super (75%)', desc: 'Critical decisions', color: 'var(--dao-error)' }
          ].map((threshold) => (
            <button
              key={threshold.value}
              onClick={() => setFormData({...formData, threshold: threshold.value})}
              className={`
                p-3 rounded-xl border-2 transition-all text-left
                ${formData.threshold === threshold.value 
                  ? 'border-blue-500 dao-gradient-blue text-white' 
                  : 'border-opacity-20 hover:border-opacity-40'
                }
              `}
              style={{
                borderColor: formData.threshold === threshold.value ? 'var(--dao-accent-blue)' : 'var(--dao-border)',
                backgroundColor: formData.threshold === threshold.value ? 'transparent' : 'var(--dao-card)'
              }}
            >
              <div className="font-medium text-sm">{threshold.label}</div>
              <div className="text-xs opacity-70">{threshold.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 3: Privacy Settings
function PrivacySettingsStep({ formData, setFormData }: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 dao-text-gradient">Privacy Settings</h2>
        <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Configure anonymity levels and privacy features for voting
        </p>
      </div>

      {/* Anonymity Level Selection */}
      <div className="space-y-4">
        <Label>Voter Anonymity Level</Label>
        <RadioGroup 
          value={formData.anonymityLevel} 
          onValueChange={(value: AnonymityLevel) => setFormData({...formData, anonymityLevel: value})}
          className="space-y-4"
        >
          {/* Public Option */}
          <div className="dao-card p-4 border-2" style={{
            borderColor: formData.anonymityLevel === 'public' ? 'var(--dao-accent-blue)' : 'var(--dao-border)'
          }}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="public" id="public" className="mt-1" />
              <div className="flex-1">
                <label htmlFor="public" className="flex items-center space-x-2 cursor-pointer">
                  <Eye className="w-5 h-5" style={{color: 'var(--dao-accent-blue)'}} />
                  <span className="font-medium">Public Voting</span>
                </label>
                <p className="text-sm opacity-70 mt-1" style={{color: 'var(--dao-foreground)'}}>
                  Voter identities are visible to all participants
                </p>
              </div>
            </div>
          </div>

          {/* Full ZK Option */}
          <div className="dao-card p-4 border-2" style={{
            borderColor: formData.anonymityLevel === 'full-zk' ? 'var(--dao-accent-purple)' : 'var(--dao-border)'
          }}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="full-zk" id="full-zk" className="mt-1" />
              <div className="flex-1">
                <label htmlFor="full-zk" className="flex items-center space-x-2 cursor-pointer">
                  <Lock className="w-5 h-5" style={{color: 'var(--dao-accent-purple)'}} />
                  <span className="font-medium">Full ZK Anonymity</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </label>
                <p className="text-sm opacity-70 mt-1" style={{color: 'var(--dao-foreground)'}}>
                  Complete privacy with zero-knowledge proofs - identities never revealed
                </p>
              </div>
            </div>
          </div>

          {/* Threshold-based Option */}
          <div className="dao-card p-4 border-2" style={{
            borderColor: formData.anonymityLevel === 'threshold' ? 'var(--dao-warning)' : 'var(--dao-border)'
          }}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="threshold" id="threshold" className="mt-1" />
              <div className="flex-1">
                <label htmlFor="threshold" className="flex items-center space-x-2 cursor-pointer">
                  <Percent className="w-5 h-5" style={{color: 'var(--dao-warning)'}} />
                  <span className="font-medium">Threshold-Based Reveal</span>
                </label>
                <p className="text-sm opacity-70 mt-1" style={{color: 'var(--dao-foreground)'}}>
                  Reveal voter identities after reaching participation threshold
                </p>
                
                {formData.anonymityLevel === 'threshold' && (
                  <div className="mt-3 space-y-2">
                    <Label className="text-sm">Reveal Threshold: {formData.revealThreshold}%</Label>
                    <Slider
                      value={[formData.revealThreshold]}
                      onValueChange={([value]: [number]) => setFormData({...formData, revealThreshold: value})}
                      max={100}
                      min={25}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-60" style={{color: 'var(--dao-foreground)'}}>
                      <span>25%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Additional Privacy Options */}
      <div className="space-y-4">
        <Label>Additional Options</Label>
        
        <div className="dao-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Allow Public Discussion</div>
              <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
                Enable community comments and discussion on this proposal
              </p>
            </div>
            <Switch
              checked={formData.allowDiscussion}
              onCheckedChange={(checked: boolean) => setFormData({...formData, allowDiscussion: checked})}
            />
          </div>
        </div>
      </div>

      {/* Privacy Explanation */}
      <div className="dao-card p-4" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
        <h3 className="font-medium mb-2 flex items-center space-x-2">
          <Shield className="w-4 h-4" style={{color: 'var(--dao-accent-purple)'}} />
          <span>Privacy Protection</span>
        </h3>
        <div className="text-sm space-y-1 opacity-80" style={{color: 'var(--dao-foreground)'}}>
          {formData.anonymityLevel === 'public' && (
            <p>• All votes and voter identities will be publicly visible</p>
          )}
          {formData.anonymityLevel === 'full-zk' && (
            <>
              <p>• Zero-knowledge proofs ensure complete voter privacy</p>
              <p>• Only vote counts are revealed, never individual choices</p>
              <p>• No possibility of voter coercion or retaliation</p>
            </>
          )}
          {formData.anonymityLevel === 'threshold' && (
            <>
              <p>• Voter identities hidden until {formData.revealThreshold}% participation</p>
              <p>• Provides initial privacy while ensuring transparency</p>
              <p>• Balances privacy with accountability</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 4: Review
function ReviewStep({ formData }: { formData: FormData }) {
  const getAnonymityLabel = (level: AnonymityLevel) => {
    switch (level) {
      case 'public': return 'Public Voting';
      case 'full-zk': return 'Full ZK Anonymity';
      case 'threshold': return `Threshold-Based (${formData.revealThreshold}%)`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 dao-text-gradient">Review Proposal</h2>
        <p className="opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Review all details before submitting your proposal
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Details */}
        <div className="dao-card p-4">
          <h3 className="font-medium mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Basic Details</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="opacity-70">Title: </span>
              <span className="font-medium">{formData.title}</span>
            </div>
            <div>
              <span className="opacity-70">Description: </span>
              <p className="mt-1 opacity-90">{formData.description}</p>
            </div>
            <div>
              <span className="opacity-70">Deadline: </span>
              <span className="font-medium">
                {formData.deadline ? new Date(formData.deadline).toLocaleString() : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Token Requirements */}
        <div className="dao-card p-4">
          <h3 className="font-medium mb-3 flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>Token Requirements</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="opacity-70">Token Type: </span>
              <span className="font-medium">{formData.tokenType}</span>
            </div>
            {(formData.tokenType === 'WADA' || formData.tokenType === 'BOTH') && (
              <div>
                <span className="opacity-70">WADA Required: </span>
                <span className="font-medium">{formData.wadaRequired || '0'} WADA</span>
              </div>
            )}
            {(formData.tokenType === 'NIGHT' || formData.tokenType === 'BOTH') && (
              <div>
                <span className="opacity-70">NIGHT Required: </span>
                <span className="font-medium">{formData.nightRequired || '0'} NIGHT</span>
              </div>
            )}
            <div>
              <span className="opacity-70">Approval Threshold: </span>
              <span className="font-medium">{formData.threshold}%</span>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="dao-card p-4">
          <h3 className="font-medium mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy Settings</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="opacity-70">Anonymity Level: </span>
              <span className="font-medium">{getAnonymityLabel(formData.anonymityLevel)}</span>
            </div>
            <div>
              <span className="opacity-70">Public Discussion: </span>
              <span className="font-medium">{formData.allowDiscussion ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Token Selection Card Component
function TokenCard({ tokenType, selected, onSelect, wallet }: {
  tokenType: TokenType;
  selected: boolean;
  onSelect: () => void;
  wallet: any;
}) {
  const getTokenInfo = () => {
    switch (tokenType) {
      case 'WADA':
        return {
          name: 'WADA Only',
          description: 'Standard governance token',
          balance: wallet?.balance || 0,
          icon: (
            <div className="w-8 h-8 rounded-full dao-gradient-blue flex items-center justify-center">
              <span className="font-bold text-white">W</span>
            </div>
          )
        };
      case 'NIGHT':
        return {
          name: 'NIGHT Only',
          description: 'Privacy-enhanced governance',
          balance: wallet?.nightBalance || 0,
          icon: <img src={m9Logo} alt="NIGHT" className="w-8 h-8 rounded-full" />
        };
      case 'BOTH':
        return {
          name: 'WADA + NIGHT',
          description: 'Dual token requirement',
          balance: Math.min(wallet?.balance || 0, wallet?.nightBalance || 0),
          icon: (
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full dao-gradient-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">W</span>
              </div>
              <img src={m9Logo} alt="NIGHT" className="w-8 h-8 rounded-full" />
            </div>
          )
        };
    }
  };

  const tokenInfo = getTokenInfo();

  return (
    <button
      onClick={onSelect}
      className={`
        p-4 rounded-xl border-2 transition-all text-left w-full
        ${selected ? 'dao-gradient-blue text-white border-transparent' : 'border-opacity-20 hover:border-opacity-40'}
      `}
      style={{
        borderColor: selected ? 'transparent' : 'var(--dao-border)',
        backgroundColor: selected ? 'transparent' : 'var(--dao-card)'
      }}
    >
      <div className="flex items-center space-x-3 mb-3">
        {tokenInfo.icon}
        <div>
          <div className="font-medium">{tokenInfo.name}</div>
          <div className={`text-sm ${selected ? 'opacity-90' : 'opacity-70'}`}>
            {tokenInfo.description}
          </div>
        </div>
      </div>
      
      {wallet && (
        <div className={`text-sm ${selected ? 'opacity-90' : 'opacity-60'}`}>
          Balance: {tokenInfo.balance.toLocaleString()}
        </div>
      )}
      
      {selected && (
        <div className="mt-2 flex items-center space-x-1 text-sm">
          <Check className="w-4 h-4" />
          <span>Selected</span>
        </div>
      )}
    </button>
  );
}

// Template Cards Component
function TemplateCards({ templates, onSelectTemplate, selectedId }: {
  templates: typeof proposalTemplates;
  onSelectTemplate: (template: typeof proposalTemplates[0]) => void;
  selectedId?: string;
}) {
  return (
    <div className="dao-card p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{color: 'var(--dao-foreground)'}}>
        <FileText className="w-5 h-5" />
        <span>Proposal Templates</span>
      </h3>
      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`
              w-full text-left p-3 rounded-xl border transition-all
              ${selectedId === template.id ? 'border-blue-500' : 'border-opacity-20 hover:border-opacity-40'}
            `}
            style={{
              borderColor: selectedId === template.id ? 'var(--dao-accent-blue)' : 'var(--dao-border)',
              backgroundColor: selectedId === template.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--dao-card-secondary)'
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{color: template.color, borderColor: template.color}}
              >
                {template.category}
              </Badge>
              {selectedId === template.id && (
                <Check className="w-4 h-4" style={{color: 'var(--dao-accent-blue)'}} />
              )}
            </div>
            <div className="font-medium text-sm mb-1" style={{color: 'var(--dao-foreground)'}}>
              {template.title}
            </div>
            <div className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
              {template.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Token Balance Card Component
function TokenBalanceCard({ wallet }: { wallet: any }) {
  return (
    <div className="dao-card p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{color: 'var(--dao-foreground)'}}>
        <Coins className="w-5 h-5" />
        <span>Your Token Balance</span>
      </h3>
      {wallet ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full dao-gradient-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">W</span>
              </div>
              <span className="font-medium">WADA</span>
            </div>
            <span className="font-mono">{wallet.balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
            <div className="flex items-center space-x-2">
              <img src={m9Logo} alt="NIGHT" className="w-6 h-6 rounded-full" />
              <span className="font-medium">NIGHT</span>
            </div>
            <span className="font-mono">{wallet.nightBalance.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm opacity-70" style={{color: 'var(--dao-foreground)'}}>
          Connect wallet to view balances
        </p>
      )}
    </div>
  );
}

// Privacy Guide Card Component
function PrivacyGuideCard() {
  return (
    <div className="dao-card p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{color: 'var(--dao-foreground)'}}>
        <Shield className="w-5 h-5" />
        <span>Privacy Guide</span>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
          <div className="font-medium mb-1 flex items-center space-x-2">
            <Eye className="w-4 h-4" style={{color: 'var(--dao-accent-blue)'}} />
            <span>Public</span>
          </div>
          <p className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
            Best for: Transparent community decisions
          </p>
        </div>
        
        <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
          <div className="font-medium mb-1 flex items-center space-x-2">
            <Lock className="w-4 h-4" style={{color: 'var(--dao-accent-purple)'}} />
            <span>Full ZK</span>
          </div>
          <p className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
            Best for: Sensitive governance matters
          </p>
        </div>
        
        <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
          <div className="font-medium mb-1 flex items-center space-x-2">
            <Percent className="w-4 h-4" style={{color: 'var(--dao-warning)'}} />
            <span>Threshold</span>
          </div>
          <p className="text-xs opacity-70" style={{color: 'var(--dao-foreground)'}}>
            Best for: Balanced privacy + accountability
          </p>
        </div>
      </div>
    </div>
  );
}

// Live Preview Card Component
function LivePreviewCard({ formData }: { formData: FormData }) {
  const hasBasicInfo = formData.title && formData.description;
  
  return (
    <div className="dao-card p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{color: 'var(--dao-foreground)'}}>
        <Eye className="w-5 h-5" />
        <span>Live Preview</span>
      </h3>
      
      {hasBasicInfo ? (
        <div className="dao-card p-4 space-y-3" style={{backgroundColor: 'var(--dao-card-secondary)'}}>
          <h4 className="font-medium truncate">{formData.title}</h4>
          <p className="text-sm opacity-80 line-clamp-3">{formData.description}</p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              {formData.anonymityLevel === 'full-zk' && (
                <Lock className="w-3 h-3" style={{color: 'var(--dao-accent-purple)'}} />
              )}
              <span className="opacity-60">
                {formData.tokenType} • {formData.threshold}% threshold
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">Draft</Badge>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 opacity-60">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Preview will appear as you fill out the form</p>
        </div>
      )}
    </div>
  );
}
