<script>
  import "../app.css";
  import { Toaster } from "svelte-sonner";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import MainNavigation from "@/components/MainNavigation.svelte";
  import Footer from "@/components/Footer.svelte";
  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <MainNavigation />
  <slot></slot>
  <Footer />
</QueryClientProvider>

<Toaster />
