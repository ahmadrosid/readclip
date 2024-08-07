<script lang="ts">
  import Title from "@/components/ui/Title.svelte";
  import * as Card from "$lib/components/ui/card";

  export let tools = [
    {
      slug: "youtube-transcript",
      title: "Youtube Transcript",
      description:
        "Get the transcript of any Youtube video.",
      link: "/tools/youtube-transcript",
    },
    {
      slug: "reddit-reader",
      title: "Reddit reader",
      description: "Read reddit discussion without distraction wihtout pain!",
      link: "/tools/reddit-reader",
    },
    {
      slug: "markdown-editor",
      title: "Markdown Editor",
      description: "Write, edit and view Markdown texts.",
      link: "/tools/markdown-editor",
    },
    {
      slug: "word-counter",
      title: "Words counter",
      description: "Count the words in your text",
      link: "/tools/word-counter",
    },
    {
      slug: "reading-time",
      title: "Reading time estimator",
      description: "Estimate the reading time of your text",
      link: "/tools/reading-time",
    },
    {
      slug: "business-analysis",
      title: "Business Value Proposition Analysis",
      description:
        "Find out Business Value Proposition Statement from landing page using AI.",
      link: "/tools/business-analysis",
    },
    {
      slug: "html-to-markdown",
      title: "Html to markdown",
      description: "Convert HTML to markdown.",
      link: "/tools/html-to-markdown",
    },
    {
      slug: "blog-title-generator",
      title: "Blog Title Generator",
      description: "Generate high-quality blog titles for your content.",
      link: "/tools/blog-title-generator",
    },
  ];
</script>

<div class="px-4 bg-gray-900 sm:px-8 mx-auto min-h-[80vh]">
  <div class="pt-6 pb-4">
    <Title class="pb-4">Free tools from Readclip</Title>
    <p class="text-lg text-gray-600 dark:text-gray-300">
      ReadClip offers free tools to help streamline your daily tasks, without
      ads or distractions.
    </p>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8">
    {#each tools as tool}
      <Card.Root class="rounded-lg bg-gray-700/40 border border-gray-600/25">
        <a href={tool.link}>
          <Card.Header>
            <Card.Title>{tool.title}</Card.Title>
            <Card.Description>{tool.description}</Card.Description>
          </Card.Header>
        </a>
      </Card.Root>
    {/each}
  </div>
</div>
