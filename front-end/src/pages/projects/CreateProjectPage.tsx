import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle, Users, Lock, Percent, FileText, Eye, Image, Upload, Coins, Vote, Code } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useDAO } from '../../components/DAOProvider';
import { toast } from 'sonner@2.0.3';
import m9Logo from '../../assets/m9Logo-1.png';
import { useAppNavigation } from '../../hooks';

export function CreateProjectPage() {
  const nav = useAppNavigation();
  const { wallet, createProject } = useDAO();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    logoUrl: '',
    logoType: 'upload' as 'upload' | 'url',
    category: '',
    type: 'public' as 'public' | 'private',
    website: '',
    discord: '',
    twitter: '',
    github: '',
    governanceTokenType: 'wallet' as 'wallet' | 'custom',
    walletToken: 'WADA' as 'WADA' | 'NIGHT',
    customToken: '',
    customTokenContract: '',
    visibilityType: 'anyone' as 'anyone' | 'govToken' | 'whitelist',
    tokenPercentage: '',
    proposalCreatorTypes: [] as string[],
    votingTypes: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate governance token
    if (formData.governanceTokenType === 'custom' && !formData.customToken) {
      toast.error('Please specify the custom governance token');
      return;
    }

    // Validate governance token holder percentage if selected
    if (formData.visibilityType === 'govToken' && !formData.tokenPercentage) {
      toast.error('Please specify the minimum token percentage required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the temporary project
      const governanceToken = formData.governanceTokenType === 'wallet' 
        ? formData.walletToken 
        : formData.customToken;

      const projectData = {
        name: formData.name,
        description: formData.description,
        longDescription: formData.longDescription,
        type: formData.type,
        category: formData.category,
        creator: wallet?.address || 'anonymous',
        governanceToken,
        website: formData.website,
        discord: formData.discord,
        twitter: formData.twitter,
        github: formData.github,
        logoUrl: formData.logoUrl
      };

      await createProject(projectData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Project created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: 'proposalCreatorTypes' | 'votingTypes', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleReviewAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate governance token
    if (formData.governanceTokenType === 'custom' && !formData.customToken) {
      toast.error('Please specify the custom governance token');
      return;
    }

    // Validate governance token holder percentage if selected
    if (formData.visibilityType === 'govToken' && !formData.tokenPercentage) {
      toast.error('Please specify the minimum token percentage required');
      return;
    }

    setShowReview(true);
  };

  const handleBackToForm = () => {
    setShowReview(false);
  };

  const getVisibilityTypeLabel = () => {
    switch (formData.visibilityType) {
      case 'anyone': return 'Anyone';
      case 'govToken': return 'Governance Token Holders';
      case 'whitelist': return 'Whitelist';
      default: return '';
    }
  };

  const getProposalCreatorTypesLabel = () => {
    const labels = {
      'govToken': 'Governance Token Holders',
      'whitelist': 'Whitelist',
      'owner': 'Only Owner'
    };
    return formData.proposalCreatorTypes.map(type => labels[type as keyof typeof labels]).join(', ') || 'None selected';
  };

  const getVotingTypesLabel = () => {
    const labels = {
      'simple': 'Simple Majority (>50%)',
      'supermajority': 'Supermajority (>66.7%)',
      'quadratic': 'Quadratic Voting',
      'tokenWeighted': 'Token-Weighted Voting'
    };
    return formData.votingTypes.map(type => labels[type as keyof typeof labels]).join(', ') || 'None selected';
  };

  const getGovernanceTokenLabel = () => {
    if (formData.governanceTokenType === 'wallet') {
      return formData.walletToken;
    } else {
      return formData.customToken || 'Custom Token';
    }
  };

  if (showReview) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              onClick={handleBackToForm}
              className="p-2 rounded-xl"
              style={{ color: 'var(--dao-foreground)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold dao-text-gradient">Review Project</h1>
              <p className="opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                Review your project details before creating
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-6">
            {/* Basic Information Review */}
            <div className="dao-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                  Basic Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Project Name</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Category</p>
                  <p className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Type</p>
                  <p className="font-medium capitalize" style={{ color: 'var(--dao-foreground)' }}>{formData.type}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Governance Token</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{getGovernanceTokenLabel()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Description</p>
                <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.description}</p>
              </div>
              
              {formData.longDescription && (
                <div className="mt-4">
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Detailed Description</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.longDescription}</p>
                </div>
              )}

              {formData.logoUrl && (
                <div className="mt-4">
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Project Logo</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.logoUrl}</p>
                </div>
              )}
            </div>

            {/* Social Links Review */}
            {(formData.website || formData.discord || formData.twitter || formData.github) && (
              <div className="dao-card p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--dao-foreground)' }}>
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.website && (
                    <div>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Website</p>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.website}</p>
                    </div>
                  )}
                  {formData.discord && (
                    <div>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Discord</p>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.discord}</p>
                    </div>
                  )}
                  {formData.twitter && (
                    <div>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Twitter</p>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.twitter}</p>
                    </div>
                  )}
                  {formData.github && (
                    <div>
                      <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>GitHub</p>
                      <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{formData.github}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Governance & Voting Review */}
            <div className="dao-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Vote className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                  Governance & Voting
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Voting Types</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{getVotingTypesLabel()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Who can see your project</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{getVisibilityTypeLabel()}</p>
                  {formData.visibilityType === 'govToken' && formData.tokenPercentage && (
                    <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                      Minimum {formData.tokenPercentage}% token holding required
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>Who can create proposals</p>
                  <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>{getProposalCreatorTypesLabel()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToForm}
                className="rounded-xl"
                disabled={isSubmitting}
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit}
                className="rounded-xl dao-gradient-blue text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => nav.goBack()}
            className="p-2 rounded-xl"
            style={{ color: 'var(--dao-foreground)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold dao-text-gradient">Create New Project</h1>
            <p className="opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Launch your community project with voting capabilities
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleReviewAndCreate} className="space-y-8">
          {/* Basic Information */}
          <div className="dao-card p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--dao-foreground)' }}>
              Basic Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Project Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your project name"
                  className="rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Short Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your project (max 200 characters)"
                  className="rounded-xl resize-none"
                  rows={3}
                  maxLength={200}
                  required
                />
                <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                  {formData.description.length}/200 characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Detailed Description
                </label>
                <Textarea
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                  placeholder="Detailed description of your project, goals, and vision"
                  className="rounded-xl resize-none"
                  rows={6}
                />
              </div>

              {/* Project Logo Section */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Your Project Logo
                </label>
                <div className="space-y-4">
                  <RadioGroup 
                    value={formData.logoType} 
                    onValueChange={(value) => handleInputChange('logoType', value)}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upload" id="upload" />
                      <Label htmlFor="upload" className="cursor-pointer flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <Label htmlFor="url" className="cursor-pointer flex items-center space-x-2">
                        <Image className="w-4 h-4" />
                        <span>Image URL</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.logoType === 'upload' ? (
                    <div className="border-2 border-dashed rounded-xl p-6 text-center" 
                         style={{ borderColor: 'var(--dao-border)' }}>
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                        <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs opacity-50" style={{ color: 'var(--dao-foreground)' }}>
                          PNG, JPG, SVG up to 5MB
                        </p>
                        <Button type="button" variant="outline" className="rounded-xl mt-2">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Input
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="rounded-xl"
                    />
                  )}
                  <div className="text-xs opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                    A logo helps users identify your project. Recommended size: 200x200px
                  </div>
                </div>
              </div>

              {/* Enhanced Governance Token Section */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Governance Token
                </label>
                <div className="space-y-4">
                  <RadioGroup 
                    value={formData.governanceTokenType} 
                    onValueChange={(value) => handleInputChange('governanceTokenType', value)}
                    className="flex flex-row space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet-token" />
                      <Label htmlFor="wallet-token" className="cursor-pointer flex items-center space-x-2">
                        <Coins className="w-4 h-4" />
                        <span>Wallet Token</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom-token" />
                      <Label htmlFor="custom-token" className="cursor-pointer flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Custom Token</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.governanceTokenType === 'wallet' ? (
                    <div>
                      <Select value={formData.walletToken} onValueChange={(value) => handleInputChange('walletToken', value)}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select wallet token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WADA">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                              <span>WADA</span>
                              {wallet && (
                                <span className="text-xs opacity-70">({wallet.balance.toLocaleString()})</span>
                              )}
                            </div>
                          </SelectItem>
                          <SelectItem value="NIGHT">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                              <span>NIGHT</span>
                              {wallet && (
                                <span className="text-xs opacity-70">({wallet.nightBalance.toLocaleString()})</span>
                              )}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                        {wallet ? `Your ${formData.walletToken} balance: ${
                          formData.walletToken === 'WADA' ? wallet.balance.toLocaleString() : wallet.nightBalance.toLocaleString()
                        }` : 'Connect wallet to see token balances'}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Input
                          value={formData.customToken}
                          onChange={(e) => handleInputChange('customToken', e.target.value)}
                          placeholder="Enter custom token name or ticker (e.g., MYTOKEN)"
                          className="rounded-xl"
                        />
                        <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                          Specify a custom token for governance and voting
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                          Token Contract Address
                        </label>
                        <div className="dao-card p-4 rounded-xl border-2 border-dashed" style={{ borderColor: 'var(--dao-border)' }}>
                          <div className="flex items-start space-x-3">
                            <Code className="w-5 h-5 mt-0.5" style={{ color: 'var(--dao-accent-blue)' }} />
                            <div className="flex-1">
                              <Input
                                value={formData.customTokenContract}
                                onChange={(e) => handleInputChange('customTokenContract', e.target.value)}
                                placeholder="0x1234567890abcdef1234567890abcdef12345678"
                                className="rounded-xl font-mono text-sm"
                              />
                              <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                                Enter the smart contract address for your custom token
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defi">DeFi</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="dao">DAO</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                    Project Type
                  </label>
                  <div className="flex items-center space-x-4 p-3 rounded-xl border" 
                       style={{ borderColor: 'var(--dao-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>Public</span>
                    <Switch
                      checked={formData.type === 'private'}
                      onCheckedChange={(checked) => handleInputChange('type', checked ? 'private' : 'public')}
                    />
                    <span className="text-sm" style={{ color: 'var(--dao-foreground)' }}>Private</span>
                  </div>
                  <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                    {formData.type === 'private' ? 'Only invited members can join' : 'Anyone can join and participate'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="dao-card p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--dao-foreground)' }}>
              Social Links (Optional)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourproject.com"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Discord
                </label>
                <Input
                  value={formData.discord}
                  onChange={(e) => handleInputChange('discord', e.target.value)}
                  placeholder="https://discord.gg/yourproject"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Twitter
                </label>
                <Input
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourproject"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  GitHub
                </label>
                <Input
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/yourproject"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="dao-card border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              After creating your project, you'll be able to create proposals, invite members, and start voting activities. 
              Your project will be visible to the community and can be discovered by other users.
            </AlertDescription>
          </Alert>

          {/* Project Visibility Section */}
          <div className="dao-card p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--dao-foreground)' }}>
              Project Visibility & Access
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                  Who can see your project
                </label>
                <RadioGroup 
                  value={formData.visibilityType} 
                  onValueChange={(value) => handleInputChange('visibilityType', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anyone" id="visibility-anyone" />
                    <Label htmlFor="visibility-anyone" className="cursor-pointer flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <div>
                        <span>Anyone</span>
                        <p className="text-xs opacity-70">Project is publicly visible to all users</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="govToken" id="visibility-token" />
                    <Label htmlFor="visibility-token" className="cursor-pointer flex items-center space-x-2">
                      <Coins className="w-4 h-4" />
                      <div>
                        <span>Governance Token Holders</span>
                        <p className="text-xs opacity-70">Only users with governance tokens can see this project</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whitelist" id="visibility-whitelist" />
                    <Label htmlFor="visibility-whitelist" className="cursor-pointer flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <div>
                        <span>Whitelist</span>
                        <p className="text-xs opacity-70">Only whitelisted addresses can see this project</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.visibilityType === 'govToken' && (
                  <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: 'var(--dao-border)' }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dao-foreground)' }}>
                      Minimum Token Percentage Required *
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={formData.tokenPercentage}
                        onChange={(e) => handleInputChange('tokenPercentage', e.target.value)}
                        placeholder="5"
                        min="0.01"
                        max="100"
                        step="0.01"
                        className="rounded-xl w-24"
                      />
                      <Percent className="w-4 h-4 opacity-50" style={{ color: 'var(--dao-foreground)' }} />
                    </div>
                    <div className="text-xs opacity-60 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                      Users must hold at least this percentage of the total token supply
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Who can create proposals section - Multi-select */}
          <div className="dao-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                Who can create proposals
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                Select multiple options to allow different types of users to create proposals
              </p>
              
              <div className="space-y-3">
                {[
                  { value: 'govToken', label: 'Governance Token Holders', desc: 'Users holding governance tokens can create proposals' },
                  { value: 'whitelist', label: 'Whitelist', desc: 'Only whitelisted addresses can create proposals' },
                  { value: 'owner', label: 'Only Owner', desc: 'Only the project owner can create proposals' }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 rounded-xl border" 
                       style={{ borderColor: 'var(--dao-border)' }}>
                    <Checkbox
                      id={`proposal-creator-${option.value}`}
                      checked={formData.proposalCreatorTypes.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('proposalCreatorTypes', option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`proposal-creator-${option.value}`}
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                        {option.label}
                      </div>
                      <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                        {option.desc}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voting Type section - Multi-select */}
          <div className="dao-card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Vote className="w-5 h-5" style={{ color: 'var(--dao-accent-purple)' }} />
              <h2 className="text-xl font-bold" style={{ color: 'var(--dao-foreground)' }}>
                Voting Type
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                Select multiple voting mechanisms that can be used for proposals in this project
              </p>
              
              <div className="space-y-3">
                {[
                  { value: 'simple', label: 'Simple Majority (>50%)', desc: 'Proposals pass with more than 50% approval' },
                  { value: 'supermajority', label: 'Supermajority (>66.7%)', desc: 'Proposals require at least 66.7% approval to pass' },
                  { value: 'quadratic', label: 'Quadratic Voting', desc: 'Voting power scales quadratically with token holdings' },
                  { value: 'tokenWeighted', label: 'Token-Weighted Voting', desc: 'Voting power proportional to token holdings' }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 p-3 rounded-xl border" 
                       style={{ borderColor: 'var(--dao-border)' }}>
                    <Checkbox
                      id={`voting-type-${option.value}`}
                      checked={formData.votingTypes.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleMultiSelectChange('votingTypes', option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`voting-type-${option.value}`}
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                        {option.label}
                      </div>
                      <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--dao-foreground)' }}>
                        {option.desc}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => nav.goBack()}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl dao-gradient-blue text-white border-0"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review & Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
