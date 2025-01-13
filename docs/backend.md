# Backend Development Guide

This guide explains how to add new features to the ReadClip backend.

## Adding New Endpoints

### 1. Define the Domain Types

In `internal/clip/domain.go`:

```go
type NewFeatureRequest struct {
    // Request fields
    UserID string `json:"user_id"`
    Data   string `json:"data"`
}

type NewFeatureResponse struct {
    // Response fields
    Status string `json:"status"`
    Data   string `json:"data"`
}
```

### 2. Add Repository Methods

In `internal/clip/repository.go`:

```go
type ClipRepository interface {
    // Add your new method
    NewFeature(ctx context.Context, userID string, data string) error
}

func (r *repository) NewFeature(ctx context.Context, userID string, data string) error {
    query := `INSERT INTO table (user_id, data) VALUES ($1, $2)`
    _, err := r.db.ExecContext(ctx, query, userID, data)
    return err
}
```

### 3. Implement the Handler

In `internal/clip/handler.go`:

```go
func (h *Handler) newFeatureHandler(w http.ResponseWriter, r *http.Request) {
    // 1. Parse request
    var req NewFeatureRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // 2. Get user from context
    user := r.Context().Value("user").(*auth.User)
    if user == nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // 3. Call repository
    err := h.repo.NewFeature(r.Context(), user.ID, req.Data)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 4. Return response
    response := NewFeatureResponse{
        Status: "success",
        Data:   "Feature completed",
    }
    json.NewEncoder(w).Encode(response)
}
```

### 4. Register the Route

In your route setup:

```go
router.HandleFunc("/api/new-feature", h.newFeatureHandler).Methods("POST")
```

## Authentication

All authenticated endpoints should:

1. Use the authentication middleware
2. Get the user from the context
3. Validate user permissions before proceeding

Example:
```go
func (h *Handler) authenticatedEndpoint(w http.ResponseWriter, r *http.Request) {
    user := r.Context().Value("user").(*auth.User)
    if user == nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }
    // Continue with handler logic
}
```

## Error Handling

Follow these patterns for error handling:

1. Use appropriate HTTP status codes
2. Return error messages in JSON format
3. Log errors for debugging
4. Handle expected errors gracefully

Example:
```go
type ErrorResponse struct {
    Status  string `json:"status"`
    Message string `json:"message"`
}

func handleError(w http.ResponseWriter, status int, message string) {
    response := ErrorResponse{
        Status:  "error",
        Message: message,
    }
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(response)
}
```

## Testing

Write tests for:
1. Handler functions
2. Repository methods
3. Edge cases and error conditions

Example test:
```go
func TestNewFeatureHandler(t *testing.T) {
    // Setup test cases
    tests := []struct {
        name           string
        input         NewFeatureRequest
        expectedStatus int
    }{
        // Add test cases
    }

    // Run tests
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```
