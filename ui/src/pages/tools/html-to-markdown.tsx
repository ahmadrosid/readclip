import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { twMerge } from "tailwind-merge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchConvertHtmlToMarkdown } from "@/lib/api/html";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HtmlToMarkdown() {
  const tool = tools.find((item) => item.slug === "html-to-markdown");
  
  const [htmlText, setHtmlText] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitConvertHtml = async (htmlText: string) => {
    if (htmlText === "") {
      toast.error("Please enter html text");
      return;
    }
    setLoading(true);
    const result = await fetchConvertHtmlToMarkdown(htmlText);
    setText(`# ${result.data.title}\n\n${result.data.content}`);
    setLoading(false);
  }

  return (
    <div className="px-8 min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-2">{tool?.title}</Title>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {tool?.description}
        </p>
        <Separator className="mt-4" />
      </div>

      <div>
          <Button onClick={async () => {
            await handleSubmitConvertHtml(htmlText)
          }}>
            { loading? <span className="animate-spin mr-2"><Loader2 className="w-5 h-5" /></span>: null}
            Submit
          </Button>
      </div>
      <div className="flex py-4 gap-6">
        <div className="flex-1">
          <Textarea
            id="textarea"
            className="min-h-[80vh] bg-white dark:bg-gray-800"
            placeholder="Paste your html text here..."
            onChange={(e) => setHtmlText(e.target.value)}
          />
        </div>
        <div
          className={twMerge(
            "bg-white dark:bg-gray-800 border rounded-md py-4 flex-1 overflow-y-auto",
          )}
        >
          <Markdown className="mx-auto prose-headings:border-b prose-headings:pb-2">
            {text}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
