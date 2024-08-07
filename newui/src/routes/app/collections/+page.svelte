<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Textarea } from "@/components/ui/textarea";

  type Bookmark = {
    id: number;
    title: string;
    url: string;
    tags: string[];
  };

  type Collection = {
    id: number;
    name: string;
    description: string;
    bookmarks: Bookmark[];
    slug: string;
  };

  let collections: Collection[] = [];

  let newCollectionName = "";
  let newCollectionDescription = "";
  let newCollectionSlug = "";
  let dialogOpen = false;

  function createSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function createCollection() {
    if (newCollectionName.trim()) {
      const slug = newCollectionSlug.trim() || createSlug(newCollectionName);
      collections = [...collections, {
        id: collections.length + 1,
        name: newCollectionName,
        description: newCollectionDescription,
        bookmarks: [],
        slug: slug
      }];
      newCollectionName = "";
      newCollectionDescription = "";
      newCollectionSlug = "";
      dialogOpen = false;
    }
  }
</script>

<div class="p-4 md:p-8 min-h-[80vh]">
  <h1 class="text-3xl font-bold mb-6">Collections</h1>

  <div class="mb-8">
    <Dialog.Root bind:open={dialogOpen}>
      <Dialog.Trigger>
        <Button>New collection</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create new collection</Dialog.Title>
        </Dialog.Header>
        <form on:submit|preventDefault={createCollection} class="space-y-4">
          <div>
            <label for="collectionName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collection Name</label>
            <Input id="collectionName" placeholder="Enter collection name" bind:value={newCollectionName} />
          </div>
          <div>
            <label for="collectionDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <Textarea
              id="collectionDescription"
              placeholder="Enter collection description"
              bind:value={newCollectionDescription}
            />
          </div>
          <div>
            <label for="collectionSlug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (optional)</label>
            <Input id="collectionSlug" placeholder="Enter custom slug or leave blank for auto-generation" bind:value={newCollectionSlug} />
          </div>
          <div class="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each collections as collection (collection.id)}
      <Card class="flex flex-col h-full">
        <CardHeader>
          <CardTitle>{collection.name}</CardTitle>
          <p class="text-sm text-gray-600 dark:text-gray-400">{collection.description}</p>
          <p class="text-xs text-gray-500 mt-1">Public URL: /collections/{collection.slug}</p>
        </CardHeader>
        <CardContent class="flex-grow">
          <h3 class="font-semibold mb-2">Bookmarks:</h3>
          {#if collection.bookmarks.length > 0}
            <ul class="space-y-2">
              {#each collection.bookmarks.slice(0, 3) as bookmark (bookmark.id)}
                <li>
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">{bookmark.title}</a>
                  <div class="flex flex-wrap gap-1 mt-1">
                    {#each bookmark.tags.slice(0, 2) as tag}
                      <Badge variant="secondary">{tag}</Badge>
                    {/each}
                    {#if bookmark.tags.length > 2}
                      <Badge variant="secondary">+{bookmark.tags.length - 2}</Badge>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
            {#if collection.bookmarks.length > 3}
              <p class="text-sm text-gray-500 mt-2">+{collection.bookmarks.length - 3} more bookmarks</p>
            {/if}
          {:else}
            <p class="text-sm text-gray-500">No bookmarks yet</p>
          {/if}
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">View Collection</Button>
        </CardFooter>
      </Card>
    {/each}
  </div>
</div>
