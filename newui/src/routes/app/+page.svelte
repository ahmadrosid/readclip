<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  const query = createQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      return response.json();
    },
  });
</script>

<h1
  class="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
>
  Clips
</h1>

<a
  href="/"
  class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >Home</a
>

<div>
  {#if $query.isLoading}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.message}</p>
  {:else if $query.isSuccess}
    {#each $query.data.slice(0, 10) as todo}
      <p>{todo.title}</p>
    {/each}
  {/if}
</div>
