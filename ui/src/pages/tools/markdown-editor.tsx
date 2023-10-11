import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { twMerge } from "tailwind-merge";
import ViewButton from "@/components/markdown-editor/view-buttons";

type ViewMode = "editor" | "viewer" | "split";

const defaultText = `
# Hello

- there

1. how
2. are 

![alt](https://images.unsplash.com/photo-1691635187966-3795fd20fb77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80)

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
  }

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title>{title}</Title>
        <p className="text-lg text-gray-600">{description}</p>
        <Separator className="mt-4" />
      </div>

      <ViewButton splitView={splitView} viewMode={viewMode} />
      <div className="flex py-4 gap-6">
        <div className={twMerge("editor flex-1", viewMode === "viewer" ? "hidden" : "")}>
          <textarea
            id="textarea"
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-screen bg-gray-800 text-white p-6 rounded-lg"
          />
        </div>
        <div className={twMerge("viewer flex-1", viewMode === "editor" ? "hidden" : "")}>
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  );
}
