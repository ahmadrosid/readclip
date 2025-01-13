# ReadClip Development Guide

Welcome to the ReadClip development guide! This documentation will help you understand how to add new features to ReadClip.

## Table of Contents

1. [Architecture Overview](./architecture.md)
2. [Backend Development](./backend.md)
   - Adding New Endpoints
   - Database Operations
   - Authentication
3. [Frontend Development](./frontend.md)
   - Adding New API Functions
   - State Management with React Query
   - Components and UI
4. [Examples](./examples.md)
   - Complete Feature Implementation Example
   - Testing Your Changes

## Getting Started

Before adding new features, make sure you understand the project structure:

```
ReadClip/
├── internal/           # Backend Go code
│   ├── clip/           # Clip-related functionality
│   └── user/           # User-related functionality
├── ui/                 # Frontend React code
│   ├── src/
│   │   ├── lib/        # Shared utilities and API functions
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # Page components
└── docs/               # Documentation
```

## Development Workflow

1. Plan your feature
   - Define the API endpoint requirements
   - Design the database schema changes (if needed)
   - Plan the UI components and interactions

2. Implement backend changes
   - Follow the [Backend Development](./backend.md) guide
   - Test your endpoints

3. Implement frontend changes
   - Follow the [Frontend Development](./frontend.md) guide
   - Test the UI interactions

4. Test end-to-end
   - Verify authentication works
   - Check error handling
   - Test edge cases

## Need Help?

Check the [Examples](./examples.md) for a complete feature implementation walkthrough.
