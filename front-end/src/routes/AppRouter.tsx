import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { routeConfig } from './routeConfig';
import { ROUTES } from '../constants/routes';

export function AppRouter() {
  const renderRoute = (route: typeof routeConfig[number]) => {
    const Component = route.element;
    
    let element: React.ReactNode;
    
    // Wrap element with appropriate layout
    if (route.layout === 'main') {
      element = (
        <MainLayout>
          <Component />
        </MainLayout>
      );
    } else if (route.layout === 'auth') {
      element = (
        <AuthLayout>
          <Component />
        </AuthLayout>
      );
    } else {
      element = <Component />;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={element}
      />
    );
  };

  return (
    <Routes>
      {/* Render all configured routes */}
      {routeConfig.map(renderRoute)}

      {/* 404 fallback */}
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}
