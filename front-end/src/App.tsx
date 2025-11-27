import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { DAOProvider } from './components/DAOProvider';
import { Toaster } from './components/ui/sonner';
import { AppRouter } from './routes';
import { RouteDebugger } from './test/RouteDebugger';

export default function App() {
  return (
    <ThemeProvider>
      <DAOProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster />
          <RouteDebugger />
        </BrowserRouter>
      </DAOProvider>
    </ThemeProvider>
  );
}