
  
  # M9 Privacy Voting - ZK-enabled DAO Governance

A privacy-focused DAO governance platform with zero-knowledge proof support. Built with React, TypeScript, and Vite.

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd hello

# Install dependencies and run
npm install
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
```

## Project Structure

```
src/
├── components/     # UI components
├── pages/          # Feature pages (dashboard, proposals, projects, settings)
├── routes/         # Routing configuration
├── hooks/          # Custom hooks (useAppNavigation)
├── constants/      # Route definitions
├── layouts/        # Layout wrappers (Main, Auth)
├── test/           # Debug components
└── types/          # TypeScript definitions
```

## Tech Stack

- React 18.3 + TypeScript
- Vite 6.3 (SWC compiler)
- react-router-dom v7.9
- Tailwind CSS + Shadcn/ui
- React Context (DAOProvider)

## Routes

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/proposal-list` - Proposals
- `/projects-community` - Projects
- `/settings` - User settings

## Features

- 🔐 Privacy-enhanced voting (WADA/NIGHT tokens)
- 📊 Dashboard with governance metrics
- 🏗️ Project management system
- 💼 Full proposal lifecycle
- ⚙️ User settings & wallet management
- 📱 Responsive mobile/desktop UI

## Navigation

Use `useAppNavigation` hook:

```tsx
const nav = useAppNavigation();
nav.toDashboard();
nav.toProposalList();
nav.goBack();
```

## Add New Routes

1. Add to `src/constants/routes.ts`
2. Create page in `src/pages/[feature]/`
3. Add config in `src/routes/routeConfig.ts`

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 15+

## License

MIT
  
