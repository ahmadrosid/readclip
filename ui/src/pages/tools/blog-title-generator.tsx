import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import { fetchLlmProxy } from "@/lib/api/llm-api";
import { tools } from "@/pages/tools/index";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function BlogPostGenerator() {
  const tool = tools.find((item) => item.slug === "blog-title-generator");
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickSubmit = async () => {
    console.log("Generate button clicked");
    const token = await user?.getIdToken();
    setLoading(true);

    await fetchLlmProxy({
      token,
      body: {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: "Hello, how are you?" }],
      },
      onParsed: (result) => {
        setText(prev => prev + (result.choices[0].delta.content || ""));
      },
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title className="pb-4">{tool?.title}</Title>
        <p className="text-lg text-gray-600">{tool?.description}</p>
        <Separator className="mt-4" />
      </div>
      <div className="grid py-6 gap-6">
        <div className="flex gap-2">
          <div className="w-full min-w-xs max-w-xs space-y-2">
            <Textarea className="dark:bg-gray-800/50" placeholder="Enter your text here" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={handleClickSubmit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              <span>Generate</span>
            </Button>
          </div>
          <div className="py-2 flex-1">
            <p className="text-sm text-gray-600">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
