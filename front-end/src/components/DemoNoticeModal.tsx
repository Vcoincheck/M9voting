import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import M9Logo from '../assets/m9Logo-1.png';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TECH_LOGS = [
  { version: "v1.0.0.0", change: "UI initial design (Sidebar, Header, Activities/History)" },
  { version: "v1.0.1.0", change: "Create Wallet management into Settings" },
  { version: "v1.0.2.0", change: "Guest Mode added, disconnect â†’ homepage" },
  { version: "v1.0.3.0", change: "Wallet popup resize + auto adjust 50% screen" },
  { version: "v1.0.4.0", change: "Wallet dropdown fixed, added session hash, disconnect, removed balances" },
  { version: "v1.0.4.1", change: "Redesign create project page" },
  { version: "v1.0.5.0", change: "Projects & Community page added" },
  { version: "v1.0.5.1", change: "Project details redesign,homepage popup fix" },
  { version: "v1.0.6.0", change: "Redesign create project page" },
];

export function DemoNoticeModal({ isOpen, onClose }: DemoNoticeModalProps) {
  const { theme } = useTheme();
  const [showNotice, setShowNotice] = useState(true);
  const [logIndex, setLogIndex] = useState(0);

  // Timer: show notice for 5s then switch to log
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setShowNotice(false), 4000);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Timer: cycle through logs every 3s
  useEffect(() => {
    if (!isOpen || showNotice) return;

    if (logIndex >= TECH_LOGS.length) {
      onClose(); // auto-close after last log
      return;
    }

    const timer = setTimeout(() => {
      setLogIndex((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, showNotice, logIndex, onClose]);

  if (!isOpen) return null;

  // Case: finished all logs
  if (!showNotice && logIndex >= TECH_LOGS.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <Card className="relative w-full max-w-lg mx-4 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <img src={M9Logo} alt="M9 Logo" className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-sm">M9 Privacy Voting</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">DAO Platform with ZK Privacy</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6">
          {showNotice ? (
            // Initial Notice
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold"> Important Notice </h2>
              <br></br><p>This product is under development, features may change.</p>
              <p>We are in pre-release phase, feedback is welcome.</p>
              <br></br><p className="italic text-sm">M9voting built by VCC, empowered by Cardano community</p>
            </div>
          ) : (
            // Tech Log presentation
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold">Update Log</h2>
              <p className="text-blue-600 dark:text-blue-400 font-bold">
                {TECH_LOGS[logIndex].version}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {TECH_LOGS[logIndex].change}
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6 flex justify-center">
            <Button onClick={onClose} className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



