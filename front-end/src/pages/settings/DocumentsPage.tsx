import React from 'react';
import { ExternalLink, FileText, Book, Shield, Code, Users } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useAppNavigation } from '../../hooks';

export function DocumentsPage() {
  const nav = useAppNavigation();
  const documentSections = [
    {
      title: 'Technical Documentation',
      icon: Code,
      description: 'In-depth technical guides and API references',
      documents: [
        {
          title: 'M9 DAO Project Proposal - 3rd Stage Voting App',
          description: 'Complete technical specification and implementation guide for the M9 Privacy Voting system',
          type: 'External Link',
          url: 'https://vcc.gitbook.io/m9dao-project/proposal/3rdstage-voting-app/proposal-draft',
          badge: 'Primary',
          icon: FileText
        },
        {
          title: 'Zero-Knowledge Proofs Implementation',
          description: 'Technical documentation on ZK proof generation and verification',
          type: 'Guide',
          badge: 'Technical',
          icon: Shield
        },
        {
          title: 'Smart Contract Architecture',
          description: 'Detailed overview of the DAO smart contract structure',
          type: 'Reference',
          badge: 'Technical',
          icon: Code
        }
      ]
    },
    {
      title: 'User Guides',
      icon: Book,
      description: 'Step-by-step guides for DAO participants',
      documents: [
        {
          title: 'Getting Started with M9 Privacy Voting',
          description: 'Complete walkthrough for new users joining the DAO',
          type: 'Tutorial',
          badge: 'Beginner',
          icon: Users
        },
        {
          title: 'Wallet Connection Guide',
          description: 'How to connect and manage your Midnight, Lace, or Hydra wallet',
          type: 'Tutorial',
          badge: 'Beginner',
          icon: Shield
        },
        {
          title: 'Creating and Voting on Proposals',
          description: 'Learn the commit-reveal voting process and proposal creation',
          type: 'Guide',
          badge: 'Intermediate',
          icon: FileText
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Privacy features and security best practices',
      documents: [
        {
          title: 'Anonymous Voting with ZK Proofs',
          description: 'Understanding how your privacy is protected during voting',
          type: 'Guide',
          badge: 'Privacy',
          icon: Shield
        },
        {
          title: 'Token Security Best Practices',
          description: 'How to keep your WADA and NIGHT tokens secure',
          type: 'Guide',
          badge: 'Security',
          icon: Shield
        },
        {
          title: 'Commit-Reveal Voting Process',
          description: 'Deep dive into the two-phase voting mechanism',
          type: 'Technical',
          badge: 'Advanced',
          icon: Code
        }
      ]
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'primary':
        return 'var(--dao-accent-blue)';
      case 'technical':
      case 'advanced':
        return 'var(--dao-accent-purple)';
      case 'beginner':
        return 'var(--dao-success)';
      case 'intermediate':
        return 'var(--dao-warning)';
      case 'privacy':
      case 'security':
        return 'var(--dao-accent-purple)';
      default:
        return 'var(--dao-accent-blue)';
    }
  };

  const handleDocumentClick = (doc: any) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      console.log('Opening document:', doc.title);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center dao-gradient-blue">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              M9
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold dao-text-gradient mb-2">Documentation Hub</h1>
            <p className="text-xl opacity-70" style={{ color: 'var(--dao-foreground)' }}>
              Technical guides, tutorials, and resources for M9 Privacy Voting
            </p>
          </div>
        </div>

        <div className="dao-card p-4">
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                Primary Technical Documentation
              </p>
              <p className="text-sm opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                For the most up-to-date technical specifications, visit our GitBook documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document Sections */}
      <div className="container mx-auto px-4 space-y-8">
        {documentSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;

          return (
            <div key={sectionIndex} className="dao-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--dao-accent-blue)', opacity: 0.1 }}
                >
                  <SectionIcon className="w-5 h-5" style={{ color: 'var(--dao-accent-blue)' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: 'var(--dao-foreground)' }}>
                    {section.title}
                  </h2>
                  <p className="opacity-70" style={{ color: 'var(--dao-foreground)' }}>
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.documents.map((doc, docIndex) => {
                  const DocIcon = doc.icon;

                  return (
                    <div
                      key={docIndex}
                      className="rounded-xl p-4 dao-card cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <DocIcon className="w-5 h-5 mt-1" style={{ color: 'var(--dao-accent-blue)' }} />
                        <Badge
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{
                            backgroundColor: getBadgeColor(doc.badge),
                            color: 'white'
                          }}
                        >
                          {doc.badge}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-1 line-clamp-2">{doc.title}</h3>
                      <p className="text-sm opacity-70 line-clamp-2">{doc.description}</p>

                      <div className="flex items-center justify-between mt-3 text-xs opacity-50">
                        <span>{doc.type}</span>
                        {doc.url && <ExternalLink className="w-3 h-3 opacity-50" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="mt-8 dao-card p-6">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--dao-foreground)' }}>
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() =>
              window.open(
                'https://vcc.gitbook.io/m9dao-project/proposal/3rdstage-voting-app/proposal-draft',
                '_blank'
              )
            }
            className="rounded-xl p-4 h-auto dao-gradient-blue text-white border-0 justify-start cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">GitBook Documentation</div>
                <div className="text-sm opacity-90">Complete technical specs</div>
              </div>
            </div>
          </div>

          <div
            onClick={() => nav.goBack()}
            className="rounded-xl p-4 h-auto justify-start cursor-pointer"
            style={{ border: '1px solid var(--dao-border)', color: 'var(--dao-foreground)' }}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Back to Dashboard</div>
                <div className="text-sm opacity-70">Return to main dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
