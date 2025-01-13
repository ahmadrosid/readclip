# ReadClip Architecture

This document provides an overview of ReadClip's architecture and design patterns.

## System Overview

ReadClip is built with a modern stack:

- **Backend**: Go with PostgreSQL database
- **Frontend**: React with TypeScript
- **Authentication**: Firebase Auth
- **State Management**: React Query
- **UI Components**: Shadcn/ui

## Directory Structure

```
ReadClip/
├── internal/               # Backend Go code
│   ├── clip/               # Clip-related functionality
│   │   ├── domain.go       # Type definitions
│   │   ├── handler.go      # HTTP handlers
│   │   └── repository.go   # Database operations
│   └── user/               # User-related functionality
├── ui/                     # Frontend React code
│   ├── src/
│   │   ├── lib/            # Shared utilities
│   │   │   ├── api/        # API functions
│   │   │   └── utils/      # Helper functions
│   │   ├── components/     # Reusable UI components
│   │   └── pages/          # Page components
└── docs/                   # Documentation
```

## Backend Architecture

### Domain-Driven Design

The backend follows a simplified domain-driven design approach:

1. **Domain Layer** (`domain.go`)
   - Defines types and interfaces
   - Contains business logic rules

2. **Repository Layer** (`repository.go`)
   - Handles database operations
   - Implements domain interfaces

3. **Handler Layer** (`handler.go`)
   - HTTP request handling
   - Input validation
   - Response formatting

### Authentication Flow

1. Client sends Firebase ID token in Authorization header
2. Middleware validates token with Firebase Admin SDK
3. User information is added to request context
4. Handlers access user info from context

## Frontend Architecture

### Component Structure

1. **Pages**
   - Main route components
   - Handle data fetching
   - Manage page-level state

2. **Components**
   - Reusable UI elements
   - Follow atomic design principles
   - Use shadcn/ui as base

3. **Hooks**
   - Custom React hooks
   - Encapsulate common logic
   - Handle authentication

### State Management

1. **Server State**
   - Managed by React Query
   - Automatic caching and revalidation
   - Optimistic updates

2. **Local State**
   - React useState for component state
   - Context for shared state
   - URL parameters for navigation state

### API Integration

1. **API Functions**
   - Centralized in `api.ts`
   - Type-safe requests/responses
   - Error handling

2. **Authentication**
   - Firebase Auth for user management
   - Token management
   - Protected routes

## Data Flow

1. User interacts with UI
2. Frontend component calls API function
3. API function sends HTTP request with auth token
4. Backend middleware validates token
5. Handler processes request
6. Repository performs database operation
7. Response flows back to UI
8. React Query updates cache
9. UI updates automatically

## Best Practices

### Backend

1. Use interfaces for dependency injection
2. Handle errors appropriately
3. Validate input data
4. Use prepared statements
5. Follow Go idioms

### Frontend

1. Use TypeScript for type safety
2. Follow React best practices
3. Keep components focused
4. Handle loading/error states
5. Use proper error boundaries

## Security

1. **Authentication**
   - Firebase Auth for user management
   - Token validation on every request
   - CORS configuration

2. **Authorization**
   - User-specific data access
   - Resource ownership validation
   - Role-based access control

3. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection

## Testing

1. **Backend Tests**
   - Unit tests for business logic
   - Integration tests for APIs
   - Mock database for testing

2. **Frontend Tests**
   - Component tests with React Testing Library
   - Integration tests for workflows
   - Mock API calls

## Deployment

1. **Backend**
   - Containerized with Docker
   - Environment variables for configuration
   - Health check endpoints

2. **Frontend**
   - Static file hosting
   - Environment-specific configuration
   - Build optimization
