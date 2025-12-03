
  
  # M9 Privacy Voting

Privacy-focused DAO governance platform with zero-knowledge proof support. Built with React + TypeScript + Vite.

## Setup

```bash
npm install
npm run dev      # Development: http://localhost:3000
npm run build    # Production build
```

## Architecture

```
src/
├── components/     # UI components + context providers
│   ├── layout/     # AppHeader, AppSidebar
│   ├── auth/       # Authentication dialogs
│   ├── context/    # DAOProvider, ThemeProvider
│   └── ui/         # Shadcn/ui components
├── pages/          # Feature pages
├── routes/         # Routing config
├── hooks/          # Custom hooks
└── constants/      # Routes, configuration
```

## Key Features

- Privacy-enhanced voting with ZK proofs
- DAO governance & proposal management
- Multi-wallet support (Midnight, Lace, Hydra)
- Dark/light theme support
- Responsive UI (mobile & desktop)

## Development

### Navigation

```tsx
const nav = useAppNavigation();
nav.toDashboard();
nav.goBack();
```

### Add Routes

1. Define in `src/constants/routes.ts`
2. Create page in `src/pages/[feature]/`
3. Update `src/routes/routeConfig.ts`

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 15+

## License

MIT
  
