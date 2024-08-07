<script>
  import "../app.css";
  import { Toaster } from "svelte-sonner";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";

  const queryClient = new QueryClient();
</script>

<svelte:head>
  <title>
	  ReadClip - Your Personal Knowledge Library: Save, Organize, and Enjoy.
  </title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <slot></slot>
</QueryClientProvider>

<ModeWatcher />
<Toaster />
