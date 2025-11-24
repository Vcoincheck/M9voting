export const formatAddress = (address: string, start = 16, end = 16) => {
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getTimeRemaining = (expiry: Date) => {
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Expired';
};

export const isSessionExpiring = (sessionExpiry: Date | undefined) => {
  if (!sessionExpiry) return false;
  return (sessionExpiry.getTime() - new Date().getTime()) < 10 * 60 * 1000; // Less than 10 minutes
};