<script>
  import { page } from '$app/stores';
  import BookMarked from "lucide-svelte/icons/book-marked";
  import Home from "lucide-svelte/icons/house";
  import Bookmark from "lucide-svelte/icons/bookmark";
  import Rows from "lucide-svelte/icons/rows-2";
  import Rss from "lucide-svelte/icons/rss";
  import Wrench from "lucide-svelte/icons/wrench";
  import Cog from "lucide-svelte/icons/cog";
  import UserPopover from "@/components/UserPopover.svelte";

  const navItems = [
    { to: "/app", icon: Home, label: "Home" },
    { to: "/app/saved", icon: Bookmark, label: "Bookmarks" },
    { to: "/app/collections", icon: Rows, label: "Collections" },
    { to: "/app/feeds", icon: Rss, label: "Feeds" },
    { to: "/tools", icon: Wrench, label: "Tools" },
    { to: "/app/setting", icon: Cog, label: "Settings" },
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
      <ul class="text-sm space-y-1">
        {#each navItems as { to, icon: Icon, label }}
          <li>
            <a href={to}>
              <div
                class="p-2 rounded-sm cursor-pointer flex gap-2 items-center border border-transparent hover:bg-white dark:hover:bg-gray-800"
                class:active={$page.url.pathname === to}
              >
                <svelte:component this={Icon} class={`text-gray-500 w-5 h-5 ${$page.url.pathname === to ? 'text-gray-700 dark:text-gray-300' : ''}`} />
                <span class="hidden sm:block" class:text-gray-700:dark:text-gray-300={$page.url.pathname === to}>{label}</span>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <UserPopover />
  </div>
  <div class="py-2 pr-2 flex-1">
    <div
      class="rounded-md bg-gray-50 dark:bg-gray-800/35 w-full h-full border border-gray-200 dark:border-gray-700/50 overflow-auto"
    >
      <div class="p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</div>

<style>
  .active {
    @apply bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200/75 dark:border-gray-700/50;
  }
</style>