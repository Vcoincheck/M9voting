export type RoutePermission = 'public' | 'authenticated' | 'admin';

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  layout?: 'main' | 'auth' | 'none';
  permission?: RoutePermission;
  title?: string;
  description?: string;
}

export interface AppRoute {
  id: string;
  path: string;
  name: string;
  component: string;
}
