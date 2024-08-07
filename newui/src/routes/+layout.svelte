<script>
  import "../app.css";
  import { Toaster } from "svelte-sonner";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";

  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <slot></slot>
</QueryClientProvider>

<ModeWatcher />
<Toaster />
