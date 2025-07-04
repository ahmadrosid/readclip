import { Separator } from "@/components/ui/separator";
import { tools } from ".";
import { Title } from "@/components/ui/title";
import { useMutation } from "react-query";
import { fetchYoutubeTranscript } from "@/lib/api/echotube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, DownloadIcon, ExternalLink, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { downloadText } from "@/lib/utils";
import { Markdown } from "@/components/markdown";

export default function YoutubeTranscriber() {
  const tool = tools.find((item) => item.slug === "youtube-transcriber");
  const [inputUrl, setInputUrl] = useState("");

  const transcribeMutation = useMutation({
    mutationFn: fetchYoutubeTranscript,
    mutationKey: "youtube-transcript",
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleCopy = useCallback(() => {
    if (!transcribeMutation.data) return;
    navigator.clipboard
      .writeText(
        `# ${
          transcribeMutation.data.info.title
        }\n\n${transcribeMutation.data.content
          .map((item) => item.text)
          .join("\n")}`
      )
      .then(() => {
        toast.success("Copied to clipboard!");
      });
  }, [transcribeMutation.data]);

  const handleDownload = useCallback(() => {
    if (!transcribeMutation.data) return;
    const title = `${transcribeMutation.data.info.title}.md`;
    downloadText(
      title,
      `# ${
        transcribeMutation.data.info.title
      }\n\n${transcribeMutation.data.content
        .map((item) => item.text)
        .join("\n")}`
    );
    toast.success(`Downloaded "${title}"!`);
  }, [transcribeMutation.data]);

  const rawLink = `<a href="javascript:window.location='${window.location.origin}/tools/youtube-transcriber?url='+encodeURIComponent(document.location)">
    Transcribe
  </a>`;

  useEffect(() => {
    if (transcribeMutation.isLoading) return;
    if (inputUrl !== "") return;

    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      setInputUrl(urlParam);
      transcribeMutation.mutate(urlParam);
    }
  }, [inputUrl, transcribeMutation]);

  return (
    <div className="container max-w-6xl mx-auto min-h-[80vh] px-2 sm:px-8">
      <div className="pt-6">
        <Title className="pb-2">{tool?.title}</Title>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {tool?.description}
        </p>
        <div
          className="flex-shrink-0 hover:underline cursor-pointer text-sm dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: rawLink }}
        />
        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="flex gap-4 items-start">
          <div className="flex-1 grid gap-3">
            <form
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                if (inputUrl === "") return;
                transcribeMutation.mutate(inputUrl);
              }}
            >
              <Input
                type="text"
                name="youtube_url"
                placeholder="Paste youtube video link here..."
                className="bg-white dark:bg-gray-800 h-10"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.currentTarget.value)}
              />
              <Button
                className="h-10 dark:text-white"
                disabled={transcribeMutation.isLoading}
              >
                {transcribeMutation.isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  ""
                )}
                Transcribe
              </Button>
            </form>
            <Card className="min-h-[70vh]">
              <CardHeader>
                {transcribeMutation.data && (
                  <div>
                    <CardTitle className="text-2xl flex justify-between items-center">
                      <div>
                        {transcribeMutation.data
                          ? transcribeMutation.data.info?.title
                          : ""}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={handleCopy}
                          className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleDownload}
                          className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                        >
                          <DownloadIcon className="h-3 w-3" />
                        </Button>
                        <a href={inputUrl} target="_blank">
                          <Button
                            variant="secondary"
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      </div>
                    </CardTitle>
                    <Separator className="mt-4" />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {transcribeMutation.data ? (
                  <Markdown className="p-0 max-w-5xl">
                    {transcribeMutation.data.content
                      .map((item) => item.text)
                      .join("\n\n")}
                  </Markdown>
                ) : (
                  ""
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
