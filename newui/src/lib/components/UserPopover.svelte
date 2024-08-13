<script lang="ts">
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover";
  import { onMount } from "svelte";
  import ModeToggle from "@/components/ui/ModeToggle.svelte";
  import { toast } from "svelte-sonner";
  import { getAuth } from "firebase/auth";
  import app from "$lib/firebase";

  interface User {
    photoURL: string;
    displayName: string;
  }

  let user: User | null = null;

  async function handleLogout() {
    try {
      const auth = getAuth(app);
      await auth.signOut();
      window.location.href = "/login";
    } catch {
      toast.error("Failed to log out");
    } finally {
      window.localStorage.removeItem("token");
    }
  }

  onMount(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          user = {
            photoURL: firebaseUser.photoURL || "",
            displayName: firebaseUser.displayName || "",
          };
        }
      }
    );

    return () => unsubscribe();
  });
</script>

<div class="px-2 pb-3 relative flex justify-between items-center">
  <Popover>
    <PopoverTrigger>
      <div class="p-2 rounded-md flex gap-2 items-center cursor-pointer">
        <img
          src={user?.photoURL || "/img/avatar.png"}
          class="w-7 h-7 rounded-full"
          alt={user?.displayName || ""}
        />
        <div class="hidden sm:block text-sm">{user?.displayName || ""}</div>
      </div>
    </PopoverTrigger>
    <PopoverContent
      sideOffset={5}
      align="start"
      class="w-[200px] dark:bg-gray-800"
    >
      <ul class="text-gray-600 dark:text-gray-400 text-sm space-y-2">
        <li
          class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300"
        >
          Settings
        </li>
        <li
          class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300"
        >
          Appearance
        </li>
        <li
          class="cursor-pointer hover:underline hover:text-gray-800 dark:hover:text-gray-300"
        >
          <button on:click={handleLogout}>Logout</button>
        </li>
      </ul>
    </PopoverContent>
  </Popover>
  <div class="hidden sm:block">
    <ModeToggle />
  </div>
</div>
