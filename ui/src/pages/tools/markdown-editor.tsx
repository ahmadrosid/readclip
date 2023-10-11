import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";

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

  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6">
        <Title>{title}</Title>
        <p className="text-lg text-gray-600">{description}</p>
        <Separator className="mt-4" />
      </div>

      <div className="flex py-6 gap-6">
        <div className="editor flex-1">
          <textarea
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-screen bg-gray-800 text-white p-6 rounded-lg"
          />
        </div>
        <div className="viewer flex-1">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  );
}
