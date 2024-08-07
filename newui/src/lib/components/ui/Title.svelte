<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.js";
  type $$Props = HTMLAttributes<HTMLDivElement>;
  export let as = "h1";

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<svelte:element
  this={as}
  class={cn(
    `py-6 text-3xl font-extrabold tracking-tight text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white`,
    className
  )}
>
  <slot />
</svelte:element>
