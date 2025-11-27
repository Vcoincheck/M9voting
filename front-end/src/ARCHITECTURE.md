# Project Structure

## Directory Organization

```
src/
├── pages/              # Page components organized by feature
│   ├── LandingPage.tsx
│   ├── dashboard/
│   ├── proposals/
│   ├── projects/
│   ├── settings/
│   └── auth/
│
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── figma/         # Figma-based components
│   ├── wallet/        # Wallet-related components
│   ├── utils/         # Component utilities
│   └── [...]          # Layout & feature components
│
├── layouts/           # Layout wrappers (MainLayout, AuthLayout)
├── routes/            # Routing configuration
│   ├── AppRouter.tsx  # Main router component
│   └── routeConfig.ts # Route definitions
│
├── hooks/             # Custom React hooks
│   └── useAppNavigation.ts
│
├── constants/         # App constants
│   └── routes.ts      # Route path constants
│
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── styles/            # Global styles
└── assets/            # Static assets
```

## Routing

Routes are centrally defined in `src/routes/routeConfig.ts` with:
- Type-safe path constants in `src/constants/routes.ts`
- Automatic layout wrapping based on configuration
- Permission-based access control structure

### Navigation

Use the `useAppNavigation()` hook for type-safe navigation:

```tsx
import { useAppNavigation } from '@/hooks';

function MyComponent() {
  const nav = useAppNavigation();
  
  return (
    <button onClick={() => nav.toProposalList()}>
      View Proposals
    </button>
  );
}
```

## Page Organization

Pages are organized by feature area:

- **dashboard/** - Dashboard page
- **proposals/** - Proposal list, details, create, voting pages
- **projects/** - Project pages
- **settings/** - Settings, wallet management, documents, activities
- **auth/** - Authentication-related pages

## Component Organization

- **ui/** - Shadcn UI components and base UI elements
- **wallet/** - Wallet connection and management
- **figma/** - Figma design components
- **components/** - Feature-specific components

## Best Practices

1. **Use `useAppNavigation()` hook** for all navigation within the app
2. **Import from route constants** instead of hardcoding paths
3. **Keep pages in the `pages/` folder** (page-level components)
4. **Keep reusable components in `components/`**
5. **Use layouts** for consistent page structure
