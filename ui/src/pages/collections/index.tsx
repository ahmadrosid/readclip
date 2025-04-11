import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionCard } from "@/components/collection-card";
import { DialogCollection } from "@/components/dialog-collection";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "react-query";
import { Collection } from "@/lib/types";

// Mock function for testing UI
const fetchCollections = async (): Promise<{ data: Collection[] }> => {
  return {
    data: [
      {
        id: "1",
        name: "Programming Resources",
        description: "Useful links for developers",
        isPublic: true,
        clipIds: ["1", "2", "3"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Design Inspiration",
        isPublic: false,
        clipIds: ["4", "5"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
};

export default function Collections() {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

  const { data: collections, isLoading } = useQuery({
    queryKey: "collections",
    queryFn: fetchCollections,
    enabled: !!user,
  });

  const handleCreateCollection = useCallback(() => {
    setOpenDialog(true);
  }, []);

  return (
    <div className="p-4 md:p-8 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Collections <span className="text-gray-800/50 dark:text-gray-400/50">(Cooming soon)</span></h1>
        <Button onClick={handleCreateCollection}>
          <Plus className="mr-2 h-4 w-4" /> New Collection
        </Button>
      </div>

      {isLoading ? (
        <div>Loading collections...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections?.data.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      <DialogCollection open={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
}
