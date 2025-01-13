# Examples

This document provides a complete example of implementing a new feature in ReadClip.

## Example: Implementing Edit Clip Feature

Here's a walkthrough of how the edit clip feature was implemented:

### 1. Backend Implementation

#### a. Domain Types (internal/clip/domain.go)
```go
type UpdateClipRequest struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}

type UpdateClipResponse struct {
    Status string  `json:"status"`
    Data   Article `json:"data"`
}
```

#### b. Repository Method (internal/clip/repository.go)
```go
func (r *repository) UpdateClipByID(ctx context.Context, userID string, clipID string, title string, content string) (*Article, error) {
    query := `
        UPDATE articles 
        SET title = $1, content = $2, updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING id, url, title, description, content, created_at, hostname, summary
    `
    var article Article
    err := r.db.QueryRowContext(ctx, query, title, content, clipID, userID).Scan(
        &article.Id,
        &article.Url,
        &article.Title,
        &article.Description,
        &article.Content,
        &article.CreatedAt,
        &article.Hostname,
        &article.Summary,
    )
    if err != nil {
        return nil, err
    }
    return &article, nil
}
```

#### c. Handler (internal/clip/handler.go)
```go
func (h *Handler) updateClipByID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    clipID := vars["id"]

    var req UpdateClipRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user := r.Context().Value("user").(*auth.User)
    if user == nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    article, err := h.repo.UpdateClipByID(r.Context(), user.ID, clipID, req.Title, req.Content)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    response := UpdateClipResponse{
        Status: "success",
        Data:   *article,
    }
    json.NewEncoder(w).Encode(response)
}
```

### 2. Frontend Implementation

#### a. API Types and Function (ui/src/lib/api/api.ts)
```typescript
export interface UpdateClipRequest {
  id: string;
  title: string;
  content: string;
  token: string;
}

export interface UpdateClipResponse {
  status: string;
  data: Article;
}

export async function fetchUpdateClip({
  id,
  title,
  content,
  token,
}: UpdateClipRequest): Promise<UpdateClipResponse> {
  const response = await fetch(`/api/clips/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
    body: JSON.stringify({ title, content }),
  });
  return handleReturnFetch(response);
}
```

#### b. Dialog Component (ui/src/components/dialog-edit-clip.tsx)
```typescript
interface DialogEditClipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  clipId: string;
}

export function DialogEditClip({
  open,
  onOpenChange,
  title: initialTitle,
  content: initialContent,
  clipId,
}: DialogEditClipProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();
      return fetchUpdateClip({
        id: clipId,
        title,
        content,
        token,
      });
    },
    onSuccess: (response) => {
      toast.success("Clip updated successfully!");
      queryClient.setQueryData(["clip", clipId], response);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update clip: ${error.message}`);
    },
  });

  const handleSave = () => {
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Clip</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>
            {updateMutation.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

#### c. Using the Dialog (ui/src/pages/(clip)/clip.tsx)
```typescript
export default function Home() {
  const [openEditClip, setOpenEditClip] = useState(false);
  
  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpenEditClip(true)}
        className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
      >
        <PencilIcon className="h-3 w-3" />
      </Button>

      {data.data && (
        <DialogEditClip
          open={openEditClip}
          onOpenChange={setOpenEditClip}
          title={data.data.Title}
          content={data.data.Content}
          clipId={data.data.Id}
        />
      )}
    </>
  );
}
```

### 3. Key Implementation Points

1. **Authentication**
   - All endpoints check for user authentication
   - Frontend gets user token before making requests

2. **Error Handling**
   - Backend returns appropriate HTTP status codes
   - Frontend shows toast notifications for success/error

3. **State Management**
   - Uses React Query for managing server state
   - Updates cache directly after successful mutations

4. **UI/UX**
   - Shows loading state during operations
   - Provides immediate feedback to users
   - Maintains consistent styling with other components

This example demonstrates the complete flow of implementing a new feature in ReadClip, from backend to frontend, following all the established patterns and best practices.
