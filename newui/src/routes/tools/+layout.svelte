<script lang="ts">
  import MainNavigation from "@/components/MainNavigation.svelte";
  import Footer from "@/components/Footer.svelte";
</script>

<MainNavigation />
<div class="bg-gray-50 dark:bg-gray-900">
  <div class="w-full max-w-[90vw] mx-auto">
    <slot />
  </div>
</div>
<Footer />
