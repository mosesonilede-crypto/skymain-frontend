# SkyMaintain API Integration

## Overview

This document outlines the complete integration between the SkyMaintain frontend (Next.js) and backend (FastAPI).

## Architecture

### Frontend Stack
- **Framework**: Next.js 16.1.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Authentication**: Cookie-based sessions (HttpOnly, SameSite)

### Backend Stack
- **Framework**: FastAPI
- **Server**: uvicorn 0.40.0
- **Database**: SQLAlchemy 2.0.45
- **Environment**: Python 3.x

## API Client (`src/lib/api.ts`)

### Base Configuration
```typescript
// All requests go through the Next.js proxy
const API_PREFIX = "/api";
```

### Authentication
All requests include `credentials: "include"` for cookie-based auth.

### Available Endpoints

#### Authentication
- `POST /v1/auth/login` - User login
  - Request: `{ email: string, password: string }`
  - Response: `{ email: string, role: string, organization_name: string }`
  - Sets HttpOnly session cookie

- `GET /v1/auth/me` - Get current user
  - Response: `{ email: string, role: string, organization_name: string }`
  - Requires authentication

- `POST /v1/auth/logout` - User logout
  - Clears session cookie

#### System Information
- `GET /v1/health` - API health check
  - Response: `{ status: "ok" | "healthy" }`

- `GET /v1/version` - Version information
  - Response: `{ service: string, version: string, env: string }`

- `GET /v1/build` - Build information
  - Response: Build metadata (commit, build_time, etc.)

- `GET /v1/runtime` - Runtime information
  - Response: `{ python_version: string, platform: string, hostname: string, process_id: number }`

- `GET /v1/capabilities` - API capabilities
  - Response: `{ features: string[], api_version: string }`

#### Internal Monitoring
- `GET /internal/healthz` - Internal health check
- `GET /internal/readiness` - Readiness probe
- `GET /internal/liveness` - Liveness probe
- `GET /internal/metrics` - Prometheus metrics

#### Documents
- `POST /v1/documents` - Register document metadata
  - Request: `{ kind, aircraft, ata, revision, title, storage_uri }`
  - Response: `{ id, org_id, ... }`

#### Domain Intelligence
- `POST /v1/domain-intelligence/answer` - Answer with citations and blocks
  - Request: `{ aircraft_family, subsystem, question, ata? }`
  - Response: `{ answer, citations, sources, answer_blocks, metadata }`

## Page Structure

### Public Pages
1. **Homepage** (`/`)
   - Shows system status with health indicator
   - Displays version, runtime, and build information
   - Features grid showcasing capabilities
   - Sign-in CTA

2. **Login** (`/login`)
   - Email/password form
   - Error handling with visual feedback
   - Redirects to previous page after login (`?from=` parameter)
   - Loading state with spinner

### Protected Pages (Require Authentication)
3. **Control Center** (`/control-center`)
  - Auth landing page
  - Tenant selector

4. **Dashboard** (`/dashboard`)
   - User information cards
   - System information with version and build data
   - Quick action cards
   - Logout functionality

5. **Profile** (`/profile`)
   - Account information (read-only)
   - Session management
   - System information
   - Security status

6. **Documents** (`/documents`)
  - Document registration form
  - Displays created document

7. **Domain Intelligence** (`/domain-intelligence`)
  - Question form
  - Answer, citations, sources, answer blocks

### Admin-Only Pages
5. **Admin Dashboard** (`/admin`)
   - User management table
   - Statistics overview
   - System health monitoring
   - Role-based access control

6. **System Monitoring** (`/system`)
   - Comprehensive health check dashboard
   - Version, build, runtime, capabilities information
   - Detailed health endpoint status table
   - Real-time refresh capability

## Components

### Shared Components
- **Navigation** - Responsive navigation with role-based links
- **Toast** - Notification system (success, error, info, warning)
- **ErrorBoundary** - Global error handling
- **LoadingSpinner** - Reusable loading indicator

### Features
- ✅ Server-side rendering for initial data
- ✅ Client-side hydration for interactivity
- ✅ Protected routes with middleware
- ✅ Role-based access control
- ✅ Graceful error handling
- ✅ Loading states
- ✅ Toast notifications
- ✅ Responsive design

## Route Guard (`proxy.ts`)

Protects routes at the edge before page rendering:
- Checks for session cookie
- Redirects unauthenticated users to login
- Protects `/dashboard`, `/control-center`, `/profile`, `/documents`, `/domain-intelligence`

## Environment Variables

### Frontend (`.env.local`)
```bash
# optional (proxy is default)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Backend
- Default: `http://127.0.0.1:8000`
- Environment detection in version endpoint

## Development Setup

### Start Backend
```powershell
cd C:\Users\moses\OneDrive\Documents\SkyMaintain
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\moses\OneDrive\Documents\SkyMaintain; .\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload"
```

### Start Frontend
```powershell
cd C:\Users\moses\OneDrive\Documents\SkyMaintain\frontend\skymain-frontend
npm.cmd run dev
```

Access at: `http://localhost:3000`

## Security Features

1. **HttpOnly Cookies** - Session cookies not accessible to JavaScript
2. **SameSite** - CSRF protection
3. **CORS** - Credentials required for cross-origin requests
4. **Server-side Auth Guards** - Pages verify auth before rendering
5. **Middleware Protection** - Edge-level route protection
6. **Role Verification** - Server-side role checks for admin pages

## Error Handling

1. **API Errors** - Custom `APIError` class with status codes
2. **Error Boundary** - Catches React errors globally
3. **Toast Notifications** - User-friendly error messages
4. **Validation** - Form validation on login page
5. **Graceful Degradation** - Promise.allSettled for optional data

## Data Flow

### Authentication Flow
1. User submits login form → `POST /v1/auth/login`
2. Backend sets HttpOnly session cookie
3. Frontend receives user data
4. Redirect to dashboard (or `?from=` page)
5. Protected pages call `GET /v1/auth/me` server-side
6. User data passed to client component

### Protected Page Flow
1. Middleware checks session cookie
2. Server component calls `GET /v1/auth/me`
3. If auth fails → redirect to login
4. If admin required → verify role
5. Pass user to client component
6. Client component renders with user data

## Next Steps

### Phase 1: Real Data Integration
- [ ] Connect admin dashboard to real user API endpoints
- [ ] Implement user CRUD operations
- [ ] Add organization management
- [ ] Integrate activity logs

### Phase 2: Advanced Features
- [ ] Real-time updates with WebSockets
- [ ] File uploads for maintenance reports
- [ ] Search and filtering
- [ ] Data export functionality

### Phase 3: Production Readiness
- [ ] CSRF token implementation
- [ ] Rate limiting
- [ ] Caching strategy
- [ ] Performance optimization
- [ ] Security audit
- [ ] Monitoring and alerting

## Testing

### Manual Testing Checklist
- [ ] Homepage loads and shows correct backend status
- [ ] Login with demo credentials works
- [ ] Dashboard shows user information
- [ ] Profile page displays account details
- [ ] Documents page can create a document
- [ ] Domain intelligence returns citations + answer blocks
- [ ] Admin can access admin dashboard
- [ ] Non-admin users redirected from admin pages
- [ ] System monitoring shows all health checks
- [ ] Logout works and redirects to login
- [ ] Navigation highlights active page
- [ ] Toast notifications appear and auto-dismiss

### API Testing
```powershell
# Health check
curl http://127.0.0.1:8000/v1/health

# Version
curl http://127.0.0.1:8000/v1/version

# Build info
curl http://127.0.0.1:8000/v1/build

# Runtime
curl http://127.0.0.1:8000/v1/runtime

# Capabilities
curl http://127.0.0.1:8000/v1/capabilities
```

## Troubleshooting

### Backend Not Responding
- Check if uvicorn is running on port 8000: `netstat -ano | findstr :8000`
- Verify virtual environment is activated
- Check backend logs in PowerShell window

### Frontend Build Errors
- Clear `.next` directory: `Remove-Item -Recurse -Force .next`
- Reinstall dependencies: `npm install`
- Check for TypeScript errors: `npm run build`

### Authentication Issues
- Clear browser cookies
- Check session cookie in DevTools
- Verify `credentials: "include"` in API calls
- Check CORS settings on backend

## Performance Considerations

- Server components fetch data server-side (no client-side waterfalls)
- Parallel data fetching with `Promise.allSettled`
- Error boundaries prevent full page crashes
- Loading states for better UX
- Optimistic UI updates where appropriate
