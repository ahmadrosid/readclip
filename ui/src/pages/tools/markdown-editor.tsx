import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { twMerge } from "tailwind-merge";
import { Pencil, Columns, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "editor" | "viewer" | "split";

export default function MarkdownEditor() {
  const { title, description } = tools[2];
  const [text, setText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const splitView = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="px-8 min-h-[80vh]">
      <div className="pt-6">
        <Title>{title}</Title>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <Separator className="mt-4" />
      </div>

      <div>
        <div className="rounded-md bg-white dark:bg-gray-800 border grid grid-cols-3 max-w-[130px]">
          <Button
            className={cn(
              "p-0",
              viewMode === "editor" && "bg-gray-200 dark:bg-gray-700"
            )}
            variant="ghost"
            onClick={() => splitView("editor")}
          >
            <Pencil className="w-5 h-5" />
          </Button>
          <Button
            className={cn(
              "p-0",
              viewMode === "split" && "bg-gray-200 dark:bg-gray-700"
            )}
            variant="ghost"
            onClick={() => splitView("split")}
          >
            <Columns className="w-5 h-5" />
          </Button>
          <Button
            className={cn(
              "p-0",
              viewMode === "viewer" && "bg-gray-200 dark:bg-gray-700"
            )}
            variant="ghost"
            onClick={() => splitView("viewer")}
          >
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="flex py-4 gap-6">
        <div
          className={twMerge("flex-1", viewMode === "viewer" ? "hidden" : "")}
        >
          <Textarea
            id="textarea"
            className="min-h-[80vh] bg-white dark:bg-gray-800"
            placeholder="Paste your markdown text here..."
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div
          className={twMerge(
            "bg-white dark:bg-gray-800 border rounded-md py-4 flex-1 max-h-[80vh] overflow-y-auto",
            viewMode === "editor" && "hidden",
            viewMode === "viewer" && "max-h-max"
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
