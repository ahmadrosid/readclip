<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { BookMarked } from "lucide-svelte";
  import { onMount } from "svelte";
  import ModeToggle from "./ui/ModeToggle.svelte";

  let hasToken = false;

  onMount(() => {
    hasToken = !!window.localStorage.getItem("token");
  });

  async function handleLogout() {
    // Implement your logout logic here
    // For example:
    // await auth.signOut();
    window.localStorage.removeItem("token");
    hasToken = false;
    //   navigate("/login");
  }
</script>

<header
  class="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur dark:bg-gray-900/75 dark:border-gray-800"
>
  <div class="px-4 sm:px-8 flex h-14 items-center">
    <div class="mr-4 flex flex-1">
      <nav class="flex items-center space-x-2">
        <a href="/" class="text-lg flex items-center gap-2">
          <BookMarked class="w-5 h-5" />
          <span class="font-bold hidden sm:block dark:text-gray-300">
            ReadClip
          </span>
        </a>

        <a href="/app">
          <Button class="dark:text-gray-300 text-gray-800 px-2" variant="link">
            Home
          </Button>
        </a>

        <a href="/app/saved">
          <Button class="dark:text-gray-300 text-gray-800 px-2" variant="link">
            Clips
          </Button>
        </a>

        <a href="/app/feed-deck">
          <Button class="dark:text-gray-300 text-gray-800 px-2" variant="link">
            Feeds
          </Button>
        </a>

        <a href="/tools" class="hidden sm:block">
          <Button class="dark:text-gray-300 text-gray-800 px-2" variant="link">
            Tools
          </Button>
        </a>

        {#if hasToken}
          <a href="/setting">
            <Button
              class="dark:text-gray-300 text-gray-800 px-2"
              variant="link"
            >
              Settings
            </Button>
          </a>
        {/if}
      </nav>
    </div>

    <div
      class="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end"
    >
      <nav class="flex items-center">
        <div class="flex-shrink-0 hover:underline cursor-pointer text-sm">
          <a
            href={`javascript:window.location='https://readclip.site/clip?url='+encodeURIComponent(document.location)`}
          >
            Add to Readclip
          </a>
        </div>
        {#if hasToken}
          <div class="flex gap-4 items-center">
            <div class="flex-shrink-0 hover:underline cursor-pointer text-sm">
              <a
                href="javascript:window.location='${import.meta.env
                  .VITE_APP_URL}/clip?url='+encodeURIComponent(document.location)"
              >
                Add to Readclip
              </a>
            </div>

            <!-- ModeToggle component would go here -->

            <Button variant="outline" on:click={handleLogout}>Logout</Button>
          </div>
        {:else}
          <a href="/login">
            <Button variant="link" class="text-gray-600 dark:text-gray-300">
              Sign in
            </Button>
          </a>
          <a href="/register">
            <Button variant="outline">Sign up</Button>
          </a>
        {/if}
      </nav>
    </div>

    <div class="px-0 sm:pr-2 sm:pl-4 block md:hidden">
      <!-- ModeToggle component would go here -->
       <ModeToggle />
    </div>
  </div>
</header>
