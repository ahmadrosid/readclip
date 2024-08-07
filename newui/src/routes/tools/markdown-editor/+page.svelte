<script lang="ts">
  import { Title } from "@/components/ui/title";
  import { Separator } from "@/components/ui/separator";
  import { Markdown } from "@/components/markdown";
  import { twMerge } from "tailwind-merge";
  import { Pencil, Columns, Eye } from "lucide-svelte";
  import { Textarea } from "@/components/ui/textarea";
  import { Button } from "@/components/ui/button";
  import { cn } from "$lib/utils.js";

  type ViewMode = "editor" | "viewer" | "split";

  const tool = {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Write, edit and view Markdown texts.",
    link: "/tools/markdown-editor",
  };
  let text = "";
  let viewMode: ViewMode = "split";

  function splitView(mode: ViewMode) {
    viewMode = mode;
  }
</script>

<div class="px-8 min-h-[80vh]">
  <div class="pt-6">
    <Title class="pb-2">{tool?.title}</Title>
    <p class="text-lg text-gray-600 dark:text-gray-400">
      {tool?.description}
    </p>
    <Separator class="my-4" />
  </div>

  <div>
    <div class="rounded-lg bg-white dark:bg-gray-800 border grid grid-cols-3 max-w-[130px] p-0.5 gap-0.5">
      <Button
        class={cn(
          "p-0",
          viewMode === "editor" && "bg-gray-200 dark:bg-gray-700"
        )}
        variant="ghost"
        on:click={() => splitView("editor")}
      >
        <Pencil class="w-4 h-4" />
      </Button>
      <Button
        class={cn(
          "p-0",
          viewMode === "split" && "bg-gray-200 dark:bg-gray-700"
        )}
        variant="ghost"
        on:click={() => splitView("split")}
      >
        <Columns class="w-4 h-4" />
      </Button>
      <Button
        class={cn(
          "p-0",
          viewMode === "viewer" && "bg-gray-200 dark:bg-gray-700"
        )}
        variant="ghost"
        on:click={() => splitView("viewer")}
      >
        <Eye class="w-4 h-4" />
      </Button>
    </div>
  </div>
  <div class="flex py-4 gap-6">
    <div
      class={twMerge("flex-1", viewMode === "viewer" ? "hidden" : "")}
    >
      <Textarea
        id="textarea"
        class="min-h-[80vh] bg-white dark:bg-gray-800 font-mono"
        placeholder="Paste your markdown text here..."
        bind:value={text}
      />
    </div>
    <div
      class={twMerge(
        "bg-white dark:bg-gray-800 border rounded-md py-4 flex-1 max-h-[80vh] overflow-y-auto",
        viewMode === "editor" && "hidden",
        viewMode === "viewer" && "max-h-max"
      )}
    >
      <Markdown content={text} class="mx-auto prose-headings:border-b" />
    </div>
  </div>
</div>
