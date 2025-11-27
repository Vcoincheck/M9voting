
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MessageSquare, ExternalLink, Send, Twitter } from 'lucide-react';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const feedbackOptions = [
    {
      label: 'Google Form',
      icon: MessageSquare,
      href: 'https://forms.google.com/demo-feedback',
      description: 'Submit detailed feedback'
    },
    {
      label: 'Telegram',
      icon: Send,
      href: 'https://t.me/ADA_VIET',
      description: 'Join our community'
    },
    {
      label: 'Twitter',
      icon: Twitter,
      href: 'https://x.com/VCoinCheck',
      description: 'Follow for updates'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Feedback Button */}
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
          text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105
          rounded-full px-4 py-2.5 flex items-center gap-2 group
          ${isOpen ? 'scale-105 shadow-xl' : ''}
        `}
      >
  <MessageSquare className={`h-4 w-4 transition-transform duration-200 text-blue-700 dark:text-blue-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        <span className="font-medium">Feedback</span>
        <div className={`w-2 h-2 bg-white/30 rounded-full transition-all duration-200 ${isOpen ? 'scale-150' : ''}`}></div>
      </Button>


      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute bottom-full right-0 mb-2 w-64"
        >
          <Card 
            className="shadow-2xl border-0 backdrop-blur-xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200"
            style={{
              backgroundColor: 'var(--dao-card)',
              borderColor: 'var(--dao-border)'
            }}
          >
            <CardContent className="p-2">
              {feedbackOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group hover:shadow-md"
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--dao-card-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    role="menuitem"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:shadow-sm transition-all duration-150"
                      style={{
                        background: 'linear-gradient(135deg, var(--dao-accent-blue), var(--dao-accent-purple))',
                        opacity: 0.5
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                      }}
                    >
                      <IconComponent className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium" style={{ color: 'var(--dao-foreground)' }}>
                          {option.label}
                        </h4>
                        <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-70 transition-opacity duration-150" style={{ color: 'var(--dao-foreground)' }} />
                      </div>
                      <p className="text-xs opacity-60" style={{ color: 'var(--dao-foreground)' }}>
                        {option.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </CardContent>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--dao-border)' }}>
              <p className="text-xs text-center opacity-50" style={{ color: 'var(--dao-foreground)' }}>
                Your feedback helps us improve
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}