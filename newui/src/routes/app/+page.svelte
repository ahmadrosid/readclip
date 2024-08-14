<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { fetchAllArticles } from "$lib/api/api";
  import { auth } from "$lib/firebase";

  const query = createQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      return fetchAllArticles({ token: token ?? "" });
    },
  });
</script>

<div>
  {#if $query.isLoading}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.message}</p>
  {:else if $query.isSuccess}
    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 py-8">
    {#each $query.data.data as item}
        <div class="bg-white rounded-lg p-4 border dark:border-gray-700/50 dark:bg-gray-800/40">
          <h2 class="font-semibold tracking-tight leading-normal mb-2 dark:text-gray-200 text-lg">
              {item.Title.slice(0, 50)}
              {item.Title.length > 50 ? "..." : ""}
          </h2>
          <p class="text-muted-foreground text-xs mb-2">
            {item.Description.slice(0, 100)}
            {item.Description.length > 100 ? "..." : ""}
          </p>
          <a href={item.Url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline text-sm">Read more</a>
        </div>
      {/each}
    </div>
  {/if}
</div>
