# SkyMaintain Frontend

Professional maintenance management system frontend built with Next.js 16.1.4, React 19, and TypeScript.

## Features

- ✅ **Authentication System** - Cookie-based secure authentication with role-based access control
- ✅ **Dashboard** - Comprehensive user dashboard with system information
- ✅ **Documents** - Document registration UI
- ✅ **Domain Intelligence** - Question + citations + answer blocks
- ✅ **Profile Management** - User profile and session management
- ✅ **Admin Panel** - User management and system statistics (admin-only)
- ✅ **System Monitoring** - Real-time health checks and metrics
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **Error Handling** - Global error boundaries and toast notifications
- ✅ **Type Safety** - Full TypeScript coverage

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks

## Project Structure

```
skymain-frontend/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage (public)
│   ├── layout.tsx           # Root layout with error boundary
│   ├── globals.css          # Global styles and animations
│   ├── login/               # Login page
│   ├── control-center/      # Auth landing + tenant selector
│   ├── dashboard/           # User dashboard (protected)
│   ├── profile/             # Profile page (protected)
│   ├── documents/           # Documents (protected)
│   ├── domain-intelligence/ # Domain intelligence (protected)
│   ├── admin/               # Admin dashboard (admin-only)
│   └── system/              # System monitoring (admin-only)
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navigation.tsx   # App navigation
│   │   ├── Toast.tsx        # Notification system
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Utility functions
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   └── proxy.ts             # Route protection
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on port 8000 (FastAPI)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
# optional (proxy is default)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Development

Start the development server (locked to port 3000):

```bash
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Start Backend

The backend must be running for full functionality:

```powershell
cd C:\Users\moses\OneDrive\Documents\SkyMaintain
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\moses\OneDrive\Documents\SkyMaintain; .\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload"
```

## Pages

### Public Routes
- `/` - Homepage with system status
- `/login` - Authentication page

### Protected Routes (Require Authentication)
- `/control-center` - Auth landing + tenant selector
- `/dashboard` - Main user dashboard
- `/profile` - User profile and settings
- `/documents` - Document registration
- `/domain-intelligence` - Question + answer blocks + citations

### Admin Routes (Admin Role Required)
- `/admin` - User management dashboard
- `/system` - System monitoring and health checks

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /v1/auth/login` - Login
- `GET /v1/auth/me` - Get current user
- `POST /v1/auth/logout` - Logout

### System Information
- `GET /v1/health` - Health check
- `GET /v1/version` - Version info
- `GET /v1/build` - Build metadata
- `GET /v1/runtime` - Runtime information
- `GET /v1/capabilities` - API capabilities

### Documents
- `POST /v1/documents` - Register document metadata

### Domain Intelligence
- `POST /v1/domain-intelligence/answer` - Answer with citations + answer blocks

### Monitoring
- `GET /internal/healthz` - Internal health
- `GET /internal/readiness` - Readiness probe
- `GET /internal/liveness` - Liveness probe

See [API_INTEGRATION.md](API_INTEGRATION.md) for detailed documentation.

## Authentication Flow

1. User enters credentials on `/login`
2. Frontend sends `POST /v1/auth/login`
3. Backend validates and sets HttpOnly session cookie
4. Frontend redirects to dashboard (or previous page via `?from=` param)
5. Protected pages verify auth via `GET /v1/auth/me` server-side
6. Proxy guard checks session cookie at the edge

## Security

- HttpOnly cookies (not accessible to JavaScript)
- SameSite cookie attribute for CSRF protection
- Server-side authentication guards
- Role-based access control
- Edge middleware for route protection
- Secure credential handling

## Scripts

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Components

### Navigation
Responsive navigation bar with:
- Role-based menu items
- Active route highlighting
- User information display

### Toast Notifications
Toast system supporting:
- Success, error, info, warning types
- Auto-dismiss functionality
- Manual close option
- Smooth animations

### Error Boundary
Global error handling that:
- Catches React errors
- Shows user-friendly error UI
- Provides recovery options

### Loading Spinner
Reusable loading indicator with:
- Multiple size options
- Optional loading text
- Smooth animations

## Development Notes

- Uses Server Components by default for better performance
- Client Components marked with "use client" directive
- Parallel data fetching with Promise.allSettled
- Type-safe API client with error handling
- Responsive design with Tailwind CSS
- Clean separation of concerns

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Contributing

1. Create feature branch
2. Make changes with TypeScript types
3. Test locally with backend
4. Submit pull request

## License

Proprietary - SkyMaintain Platform

## Support

For issues or questions, contact the development team.

