<script>
  export let className = "";
  export let as = "h1";
</script>

<svelte:element
  this={as}
  class={`py-6 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white ${className}`}
>
  <slot />
</svelte:element>
