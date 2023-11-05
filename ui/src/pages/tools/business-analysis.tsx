import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Title } from "@/components/ui/title";
import { tools } from "@/pages/tools/index";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { fetchScrapeLandingPage } from "@/lib/api/scrape";
import { toast } from "sonner";
import { Markdown } from "@/components/markdown";
import { CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchOpenai } from "@/lib/api/openai";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      {/* <Skeleton className="h-12 w-12 rounded-full" /> */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function BusinessAnalysis() {
  const tool = tools.find((item) => item.slug === "business-analysis");
  const [result, setResult] = useState({
    value: "",
    content: "",
  });

  const defaultPrompt = `Analyze Business Value Proposition Statement using this framework.

Value Proposition Statement
- For (target customer segments)
- who are dissatisfied with (existing solution)
- because it does not meet (key unmet needs),
- (Venture name) provides a (product category)
- that delivers (key benefits of your solution).

Output your analysis in one sentence.`;

  const openAiMutation = useMutation({
    mutationFn: fetchOpenai,
    mutationKey: "openai-generate",
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      setResult((prev) => ({
        content: prev.content,
        value: data.choices[0].message.content,
      }));
    },
  });

  const scrapeMutation = useMutation({
    mutationFn: fetchScrapeLandingPage,
    mutationKey: "scrape-mutation",
    onError: (err: Error) => {
      toast.success(err.message);
    },
    onSuccess: (data) => {
      setResult({
        ...result,
        content: data.data.Content,
      });
      openAiMutation.mutate({
        model: "gpt-3.5-turbo",
        // model: "gpt-4",
        messages: [
          {
            role: "system",
            content: defaultPrompt,
          },
          {
            role: "user",
            content: `This is the text from landing page ${inputUrl}\n${data.data.Content}`,
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        // top_p: 1,
        // frequency_penalty: 0,
        // presence_penalty: 0,
      });
    },
  });

  const [inputUrl, setInputUrl] = useState("");

  const savedApiKey = window.localStorage.getItem("OPENAI_API_KEY");
  const [openAiApikey, setOpenAiApiKey] = useState<string>(
    savedApiKey ? savedApiKey : ""
  );

  const handleSubmit = () => {
    if (openAiApikey === "") {
      toast.error("Please add openai api key!");
      return;
    }
    setResult({
      value: "",
      content: "",
    });
    scrapeMutation.mutate(inputUrl);
  };

  const handleCopy = useCallback((data: string) => {
    if (!data) return;
    navigator.clipboard.writeText(data).then(() => {
      toast.success("Copied to clipboard!");
    });
  }, []);

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-4">{tool?.title}</Title>
        <p className="text-lg text-gray-600">{tool?.description}</p>
        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex gap-4">
              <Input
                placeholder="Paste landing page url here..."
                className="flex-1 bg-white h-10"
                value={inputUrl}
                name="input_url"
                onChange={(e) => setInputUrl(e.currentTarget.value)}
              />
              <Button
                disabled={scrapeMutation.isLoading}
                onClick={handleSubmit}
                className="h-10"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>

        <div className="flex gap-4">
          <div className="w-full max-w-xs">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardContent className="p-0">
                  <Separator className="my-2" />
                  <div className="py-2">
                    <label className="grid gap-2">
                      OpenAI Apikey
                      <Input
                        value={openAiApikey}
                        onChange={(e) => {
                          setOpenAiApiKey(e.currentTarget.value);
                          window.localStorage.setItem(
                            "OPENAI_API_KEY",
                            e.currentTarget.value
                          );
                        }}
                        placeholder="Paste your apikey here..."
                        type="password"
                        name="open_ai_api_key"
                      />
                    </label>
                  </div>
                  <div className="py-2">
                    <label className="grid gap-2">
                      System prompt
                      <Textarea
                        placeholder="Paste your apikey here..."
                        name="openai_system_prompt"
                        rows={16}
                        defaultValue={defaultPrompt}
                      />
                    </label>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>

          <Card className="flex-1">
            <CardHeader className="py-0">
              <CardContent className="px-0 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {result.content !== "" && (
                      <div className="pb-4 px-2 flex justify-between items-center">
                        <CardTitle>Text from landing page</CardTitle>
                        <div className={cn(result.content === "" && "hidden")}>
                          <Button
                            variant="secondary"
                            onClick={() => handleCopy(`# ${result.content}`)}
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="border rounded-md py-2 min-h-[3rem]">
                      {scrapeMutation.isLoading && <LoadingSkeleton />}
                      <Markdown>{result.content}</Markdown>
                    </div>
                  </div>
                  <div>
                    {result.value !== "" || openAiMutation.isLoading ? (
                      <div className="pb-4 px-2 flex justify-between items-center">
                        <CardTitle>Value Proposition Statement</CardTitle>
                        <div className={cn(result.content === "" && "hidden")}>
                          <Button
                            variant="secondary"
                            onClick={() => handleCopy(`# ${result.value}`)}
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="border rounded-md p-3 min-h-[3rem]">
                      {openAiMutation.isLoading ? (
                        <div className="px-2">
                          <LoadingSkeleton />
                        </div>
                      ) : (
                        <div>{result.value}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
