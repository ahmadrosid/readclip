# Frontend Development Guide

This guide explains how to add new features to the ReadClip frontend.

## Adding New API Functions

### 1. Define Types

In `ui/src/lib/api/api.ts`:

```typescript
// Request type
export interface NewFeatureRequest {
  data: string;
  token: string;
}

// Response type
export interface NewFeatureResponse {
  status: string;
  data: {
    id: string;
    // other fields
  };
}
```

### 2. Implement API Function

In `ui/src/lib/api/api.ts`:

```typescript
export async function fetchNewFeature({
  data,
  token,
}: NewFeatureRequest): Promise<NewFeatureResponse> {
  const response = await fetch('/api/new-feature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify({ data }),
  });
  return handleReturnFetch(response);
}
```

## State Management with React Query

### 1. Using Mutations

For operations that modify data:

```typescript
function YourComponent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();
      return fetchNewFeature({
        data: "your data",
        token,
      });
    },
    onSuccess: (response) => {
      // Update cache if needed
      queryClient.setQueryData(['key', 'id'], response);
      toast.success("Operation successful!");
    },
    onError: (error: Error) => {
      toast.error(`Operation failed: ${error.message}`);
    },
  });
}
```

### 2. Using Queries

For fetching data:

```typescript
function YourComponent() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['unique-key', id],
    queryFn: async () => {
      const token = await user?.getIdToken();
      return fetchData({
        id,
        token: token || "",
      });
    },
    enabled: !!user, // Only run when user is logged in
  });
}
```

## Adding UI Components

### 1. Create Dialog Component

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // other props
}

export function DialogComponent({
  open,
  onOpenChange,
}: DialogProps) {
  const [data, setData] = useState("");
  
  const handleSave = () => {
    // Implementation
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Title</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter data"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 2. Use the Component

```typescript
function ParentComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Dialog
      </Button>

      <DialogComponent
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
```

## Error Handling

1. Use toast notifications for user feedback
2. Handle loading states
3. Show appropriate error messages

Example:

```typescript
function ErrorHandlingExample() {
  const { isLoading, error } = useQuery({
    // ... query config
    onError: (err: Error) => {
      if (err.message === "Unauthorized") {
        toast.error("Please log in to continue");
        return;
      }
      toast.error(`An error occurred: ${err.message}`);
    },
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <YourComponent />;
}
```

## Best Practices

1. Use TypeScript for type safety
2. Follow the existing component patterns
3. Use React Query for state management
4. Handle loading and error states
5. Use toast notifications for user feedback
6. Keep components small and focused
7. Use consistent naming conventions
