<script lang="ts">
  import { Button } from "@/components/ui/button";
  import Google from "./icons/GoogleIcon.svelte";
  import type { UserCredential } from "firebase/auth";
  import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
  import app, { auth } from "$lib/firebase";
  import { onMount } from "svelte";

  export let label: string;
  export let setError: (error: string) => void;
  export let onAuthenticated: ((credential: UserCredential) => void) | undefined = undefined;

  let currentUser: any = null;

  onMount(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(async (user) => {
      currentUser = user;
      if (user) {
        const token = await user.getIdToken();
        window.localStorage.setItem("token", token);
      }
    });

    return () => unsubscribe();
  });

  async function handleGoogleLogin() {
    try {
      setError("");
      const user = await signInWithPopup(auth, new GoogleAuthProvider());
      const token = await user.user.getIdToken();
      window.localStorage.setItem("token", token);
      if (onAuthenticated) onAuthenticated(user);
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        setError("Failed to log in with Google: " + errorMessage);
      }
    }
  }

  async function handleLogout() {
    try {
      setError("");
      await auth.signOut();
    } catch {
      setError("Failed to log out");
    }
  }
</script>

<div class="gap-2 flex justify-between flex-wrap">
  {#if currentUser}
    <Button
      class="w-full bg-white h-10 dark:text-gray-900 dark:hover:text-white"
      variant="outline"
      on:click={handleLogout}
    >
      Logout
    </Button>
  {:else}
    <Button
      on:click={handleGoogleLogin}
      variant="outline"
      class="h-10 w-full dark:text-gray-900 dark:hover:text-white"
    >
      <Google class="mr-2 h-4 w-4" />
      {label}
    </Button>
  {/if}
</div>
