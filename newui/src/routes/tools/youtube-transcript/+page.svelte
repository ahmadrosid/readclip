<script lang="ts">
  import { Separator } from "@/components/ui/separator";
  import { Title } from "@/components/ui/title";
  import { fetchYoutubeTranscript } from "$lib/api/youtube";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { CopyIcon, DownloadIcon, ExternalLink, Loader2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { downloadText } from "$lib/utils.js";
  import { Markdown } from "@/components/markdown";

  let tool = {
    slug: "youtube-transcriber",
    title: "Youtube Transcriber",
    description:
      "Don't really have time to watch videos? Now you can read them!",
    link: "/tools/youtube-transcriber",
  };

  let inputUrl = "";
  let transcriptData: {
    content: {
      text: string;
    }[];
    info: {
      title: string;
    };
  } | null = null;
  let isLoading = false;

  const transcribe = async () => {
    if (inputUrl === "") return;
    isLoading = true;
    try {
      transcriptData = await fetchYoutubeTranscript(inputUrl);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      isLoading = false;
    }
  };

  const handleCopy = () => {
    if (!transcriptData) return;
    navigator.clipboard
      .writeText(
        `# ${transcriptData.info.title}\n\n${transcriptData.content
          .map((item: any) => item.text)
          .join("\n")}`
      )
      .then(() => {
        toast.success("Copied to clipboard!");
      });
  };

  const handleDownload = () => {
    if (!transcriptData) return;
    const title = `${transcriptData.info.title}.md`;
    downloadText(
      title,
      `# ${transcriptData.info.title}\n\n${transcriptData.content
        .map((item: any) => item.text)
        .join("\n")}`
    );
    toast.success(`Downloaded "${title}"!`);
  };

  const rawLink = `<a href="javascript:window.location='https://readclip.site/tools/youtube-transcriber?url='+encodeURIComponent(document.location)">
		Transcribe
	</a>`;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      inputUrl = urlParam;
      transcribe();
    }
  });
</script>

<div class="container max-w-6xl mx-auto min-h-[80vh] px-2 sm:px-8">
  <div class="pt-6">
    <Title class="pb-2">{tool?.title}</Title>
    <p class="text-lg text-gray-600 dark:text-gray-400">
      {tool?.description}
    </p>
    <div
      class="flex-shrink-0 hover:underline cursor-pointer text-sm dark:text-gray-400"
    >
      {@html rawLink}
    </div>
  </div>
  <div class="grid py-6 gap-6">
    <div class="flex gap-4 items-start">
      <div class="flex-1 grid gap-3">
        <form class="flex gap-2" on:submit|preventDefault={transcribe}>
          <Input
            type="text"
            name="youtube_url"
            placeholder="Paste youtube video link here..."
            class="bg-white dark:bg-gray-700/50 h-10 border-gray-200 dark:border-gray-700/50"
            bind:value={inputUrl}
          />
          <Button
            type="submit"
            class="h-10 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700/50"
            disabled={isLoading}
          >
            {#if isLoading}
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
            {/if}
            Transcribe
          </Button>
        </form>
        <Card class="min-h-[70vh]">
          <CardHeader>
            {#if transcriptData}
              <div class="flex justify-between w-full items-center border-b border-gray-200 dark:border-gray-700/50 pb-2">
                <div class="text-2xl font-bold">
                  {transcriptData.info?.title || "Untitled"}
                </div>
                <div class="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    on:click={handleCopy}
                    class="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                  >
                    <CopyIcon class="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    on:click={handleDownload}
                    class="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                  >
                    <DownloadIcon class="h-3 w-3" />
                  </Button>
                  <a href={inputUrl} target="_blank">
                    <Button
                      variant="secondary"
                      class="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                    >
                      <ExternalLink class="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            {/if}
          </CardHeader>
          <CardContent>
            {#if transcriptData}
              <Markdown
                class="p-0 max-w-5xl"
                content={transcriptData.content
                  .map((item) => item.text)
                  .join("\n")}
              />
            {/if}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
