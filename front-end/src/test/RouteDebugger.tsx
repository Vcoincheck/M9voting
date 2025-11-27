import React from 'react';
import { useLocation } from 'react-router-dom';

export function RouteDebugger() {
  const location = useLocation();
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#333',
      color: '#0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 9999,
      maxHeight: '200px',
      overflowY: 'auto'
    }}>
      <div>🔍 Current Route Debug</div>
      <div>Pathname: {location.pathname}</div>
      <div>Search: {location.search}</div>
      <div>Hash: {location.hash}</div>
    </div>
  );
}
