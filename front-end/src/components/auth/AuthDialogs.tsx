import React, { useEffect } from 'react';
import { useDAO } from '../context/DAOProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { WalletSelector } from './WalletSelector';
import { WalletConnectionPopup } from './WalletConnectionPopup';

export function AuthDialogs() {
  const {
    showWalletSelector,
    setShowWalletSelector,
    showConnectionPopup,
    setShowConnectionPopup,
    connectWallet,
    enterGuestMode,
    wallet,
    connectionDetails
  } = useDAO();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (wallet && !showConnectionPopup && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [wallet, showConnectionPopup, navigate, location.pathname]);

  const handleWalletConnect = async (walletType: 'midnight' | 'hydra' | 'lace') => {
    await connectWallet(walletType);
  };

  const handleGuestAccess = () => {
    enterGuestMode();
    navigate('/dashboard');
  };

  const handleConnectionPopupClose = () => {
    setShowConnectionPopup(false);
  };

  return (
    <>
      <WalletSelector
        open={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onConnect={handleWalletConnect}
        onGuestAccess={handleGuestAccess}
      />
      {wallet && connectionDetails.walletType && connectionDetails.zkSessionHash && wallet.address && (
        <WalletConnectionPopup
          open={showConnectionPopup}
          onClose={handleConnectionPopupClose}
          walletAddress={wallet.address}
          walletType={connectionDetails.walletType}
          zkSessionHash={connectionDetails.zkSessionHash}
        />
      )}
    </>
  );
}
