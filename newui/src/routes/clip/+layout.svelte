<script>
  import { Toaster } from "svelte-sonner";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  const queryClient = new QueryClient();

  import {
    BookMarked,
    Home,
    Bookmark,
    Rows,
    Rss,
    Wrench,
    Cog,
  } from "lucide-svelte";

  const navItems = [
    { to: "/clip", icon: Home, label: "Home" },
    { to: "/clips", icon: Bookmark, label: "Bookmarks" },
    { to: "/collections", icon: Rows, label: "Collections" },
    { to: "/feed-deck", icon: Rss, label: "Feeds" },
    { to: "/tools", icon: Wrench, label: "Tools" },
    { to: "/setting", icon: Cog, label: "Settings" },
  ];
</script>

<div class="h-screen bg-gray-100 flex dark:bg-gray-900/75 dark:border-gray-800">
  <div
    class="h-full w-full max-w-[50px] sm:min-w-[260px] sm:max-w-[260px] flex-col hidden sm:flex"
  >
    <div class="p-4">
      <a href="/" class="text-lg flex items-center gap-2">
        <BookMarked class="w-5 h-5 block sm:hidden" />
        <span class="font-semibold hidden sm:block dark:text-gray-300">
          ReadClip
        </span>
      </a>
    </div>
    <div class="px-2 flex-1">
      <ul class="text-sm">
        {#each navItems as { to, icon: Icon, label }}
          <li>
            <a href={to}>
              <div
                class="hover:bg-white dark:hover:bg-gray-800 p-2 rounded-sm cursor-pointer flex gap-2 items-center"
              >
                <Icon class="text-gray-500 w-5 h-5" />
                <span class="hidden sm:block">{label}</span>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- UserPopover component would go here -->
  </div>
  <div class="py-2 pr-2 flex-1">
    <div
      class="rounded-md bg-white/75 dark:bg-gray-800/35 w-full h-full border dark:border-gray-700/50 overflow-auto"
    >
      <QueryClientProvider client={queryClient}>
        <div class="p-6">
          <slot></slot>
        </div>
      </QueryClientProvider>

      <Toaster />
    </div>
  </div>
</div>
