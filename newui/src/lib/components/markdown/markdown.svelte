<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import Markdown, { type Plugin } from "svelte-exmarkdown";
  import { gfmPlugin } from "svelte-exmarkdown/gfm";
  import { highlightPlugin } from "$lib/highlight-plugin";
  import CodeBlock from "./code-block.svelte";
  import { cn } from "@/utils";
  const plugins: Plugin[] = [gfmPlugin(), highlightPlugin, { renderer: { pre: CodeBlock } }];

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    content?: string;
  }

  let className: $$Props["class"] = undefined;
  export { className as class };
  export let content = "";
</script>

<div class={cn("prose px-4 max-w-3xl dark:prose-invert", className)}>
    <Markdown md={content} {plugins} />
</div>