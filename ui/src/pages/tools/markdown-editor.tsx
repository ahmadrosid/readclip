import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { twMerge } from "tailwind-merge";
import { Pencil, Columns, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ViewMode = "editor" | "viewer" | "split";

const defaultText = `# Hello

- there

1. how
2. are 

![alt](https://images.unsplash.com/photo-1691635187966-3795fd20fb77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80)

## Table

Example table format.

| Country        | Capital City   |
|----------------|----------------|
| United States  | Washington, D.C.|
| France         | Paris          |
| Japan          | Tokyo          |
| Brazil         | Brasília       |
| Australia      | Canberra       |

## Code section
\`\`\`js
// this is a comment

function doSomething(nothing) {
    return nothing;
}
\`\`\`

`;

export default function MarkdownEditor() {
  const { title, description } = tools[2];
  const [text, setText] = useState(defaultText);
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
        <div>
          <div className="rounded-md bg-white dark:bg-gray-800 border grid grid-cols-3 max-w-[130px]">
            <Button
              className="p-0"
              variant="ghost"
              onClick={() => splitView("editor")}
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button
              className="p-0"
              variant="ghost"
              onClick={() => splitView("split")}
            >
              <Columns className="w-5 h-5" />
            </Button>
            <Button
              className="p-0"
              variant="ghost"
              onClick={() => splitView("viewer")}
            >
              <Eye className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex py-4 gap-6">
        <div
          className={twMerge("flex-1", viewMode === "viewer" ? "hidden" : "")}
        >
          <Textarea
            id="textarea"
            className="min-h-[70vh] bg-white dark:bg-gray-800"
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div
          className={twMerge(
            "bg-white dark:bg-gray-800 border rounded-md py-4 flex-1",
            viewMode === "editor" ? "hidden" : ""
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
