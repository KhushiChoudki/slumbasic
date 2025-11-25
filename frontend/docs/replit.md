# PATH - Road Planning Platform

## Overview

PATH is a web application designed to help design better communities using satellite imagery and smart technology for road planning and infrastructure development. The platform enables users to create, manage, and track road planning projects while allowing community members to report infrastructure issues. Built with a modern React frontend and Express backend, the application emphasizes a tactile 3D design aesthetic with high contrast and lively visual elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router

**UI Component Library**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design system
- Custom CSS variables for theming with light/dark mode support

**Design System**
- Typography: Anton font for display/headlines, Inter for body text
- Color palette defined via CSS custom properties with accent color (#ff6b9a pink)
- Modern 3D aesthetic with glass morphism effects, layered shadows, and parallax scrolling
- Component-based architecture with reusable UI elements (Hero, Navbar, Cards, Sections)

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod validation for form state and validation
- Local React state for UI interactions (mobile menu, theme toggle, animations)

**Animation & Interactions**
- Intersection Observer API for scroll-triggered animations
- CSS transitions and transforms for micro-interactions
- Parallax effects on hero section background

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- ES modules (type: "module") for modern JavaScript features
- Custom middleware for JSON parsing, request logging, and error handling

**Data Layer**
- In-memory storage implementation (MemStorage class) for development
- Interface-based storage abstraction (IStorage) allowing easy swapping of persistence layers
- Drizzle ORM configured for PostgreSQL with schema definitions
- Mock seed data for initial projects and reports

**API Design**
- RESTful API endpoints following resource-based URL patterns
- Structured routes for Projects (`/api/projects`) and Reports (`/api/reports`)
- Zod schema validation for request bodies using Drizzle-Zod integration
- Consistent error handling with appropriate HTTP status codes

**Database Schema**
- Users table with username/password authentication
- Projects table for road planning initiatives (title, location, description, status, images)
- Reports table for community-submitted infrastructure issues with foreign key to projects
- UUID primary keys and timestamps for data tracking

### Development Environment

**Build Process**
- Development: tsx for running TypeScript server code directly
- Production: Vite builds frontend, esbuild bundles backend into ESM format
- Separate dist directories for client (`dist/public`) and server (`dist/index.js`)

**Development Tools**
- Replit-specific plugins for runtime error overlay and dev tooling
- Custom Vite middleware integration for SSR-like behavior during development
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**Type Safety**
- Shared schema types between frontend and backend via `shared/schema.ts`
- Strict TypeScript configuration with incremental compilation
- Zod for runtime type validation complementing TypeScript static types

### Design Philosophy

**Separation of Concerns**
- Client code isolated in `client/` directory
- Server code in `server/` directory
- Shared types and schemas in `shared/` directory
- Clear boundaries between presentation, business logic, and data access

**Component Reusability**
- Atomic design pattern with UI primitives in `components/ui/`
- Feature components composed from primitives
- Example components demonstrating usage patterns

**Accessibility**
- Semantic HTML structure throughout
- ARIA attributes on interactive elements
- Keyboard navigation support
- Focus management for modals and overlays

## External Dependencies

### Core Framework Dependencies
- **React & React DOM** (v18+): UI library for component-based frontend
- **Express**: Web application framework for Node.js backend
- **TypeScript**: Static typing for both frontend and backend code
- **Vite**: Frontend build tool and development server

### Database & ORM
- **Drizzle ORM**: TypeScript ORM for database interactions
- **@neondatabase/serverless**: Neon serverless PostgreSQL driver
- **Drizzle-Kit**: CLI for database migrations and schema management
- **Drizzle-Zod**: Bridge between Drizzle schemas and Zod validation

### UI Component Libraries
- **Radix UI**: Extensive collection of headless UI primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-built components using Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: CVA for managing component variants
- **clsx & tailwind-merge**: Utility for conditional className merging

### Form Handling & Validation
- **React Hook Form**: Performant form state management
- **@hookform/resolvers**: Resolver integrations for validation libraries
- **Zod**: TypeScript-first schema validation

### Data Fetching & State
- **TanStack Query**: Server state management and data synchronization
- **Wouter**: Minimal client-side routing library

### Icons & Visual Elements
- **Lucide React**: Icon library with React components
- **Embla Carousel**: Carousel/slider component library
- **date-fns**: Modern date utility library

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling
- **esbuild**: JavaScript bundler for production builds
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing

### Design Assets
- **Google Fonts**: Anton (display) and Inter (body) typefaces
- Generated placeholder images stored in `attached_assets/generated_images/`
- Custom noise textures and gradients via inline SVG data URIs

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used with in-memory storage)

### Notable Architectural Decisions

**Why Wouter over React Router**: Smaller bundle size and simpler API suitable for the application's routing needs

**Why Drizzle ORM**: Type-safe database queries with excellent TypeScript integration, lighter weight than Prisma

**Why In-Memory Storage**: Rapid development iteration without database setup; easily replaceable with PostgreSQL implementation via IStorage interface

**Why shadcn/ui**: Copy-paste component model provides full control over component code while maintaining consistency

**Why Vite**: Superior developer experience with instant HMR and optimized production builds compared to webpack-based solutions