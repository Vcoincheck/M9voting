import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { DAOProvider } from './components/DAOProvider';
import { Toaster } from './components/ui/sonner';
import { MainRouter } from './MainRouter';

export default function App() {
  return (
    <ThemeProvider>
      <DAOProvider>
        <BrowserRouter>
          <MainRouter />
          <Toaster />
        </BrowserRouter>
      </DAOProvider>
    </ThemeProvider>
  );
}