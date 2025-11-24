import { useState, useEffect } from 'react';

interface ResponsiveSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsiveSize(): ResponsiveSize {
  const [size, setSize] = useState<ResponsiveSize>(() => {
    // Default values for SSR
    if (typeof window === 'undefined') {
      return {
        width: 400,
        height: 600,
        isMobile: false,
        isTablet: false,
        isDesktop: true
      };
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    }

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      // Delay to account for orientation change animation
      setTimeout(handleResize, 100);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return size;
}

export function getHalfScreenDimensions(screenWidth: number, screenHeight: number) {
  // Calculate half screen dimensions with some constraints
  const halfWidth = Math.min(screenWidth * 0.5, 600); // Max 600px width
  const halfHeight = Math.min(screenHeight * 0.5, 500); // Max 500px height
  
  // Ensure minimum dimensions for usability
  const minWidth = 280;
  const minHeight = 200;
  
  return {
    width: Math.max(halfWidth, minWidth),
    height: Math.max(halfHeight, minHeight)
  };
}