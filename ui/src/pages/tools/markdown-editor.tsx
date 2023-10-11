import { Title } from "@/components/ui/title";
import { tools } from ".";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Markdown } from "@/components/markdown";
import Icon from "@/components/lucide-icon";
import FormatButtons from "@/components/markdown-editor/format-buttons";

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
          <FormatButtons />
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

/*
 * !TODO
 * - formatting buttons
 * */

/*
          <div className="flex">
            <button>
              <Icon name="Undo" />
            </button>

            <button>
              <Icon name="Redo" />
            </button>
            <button>
              <Icon name="Bold" />
            </button>

            <button>
              <Icon name="Italic" />
            </button>
            <button>
              <Icon name="Strikethrough" />
            </button>
            <button>
              <Icon name="Heading" />
            </button>

            <button>
              <Icon name="Code2" />
            </button>

            <button>
              <Icon name="List" />
            </button>
            <button>
              <Icon name="ListOrdered" />
            </button>
            <button>
              <Icon name="ListChecks" />
            </button>

            <button>
              <Icon name="Link" />
            </button>
            <button>
              <Icon name="Image" />
            </button>

            <button>
              <Icon name="Minus" />
            </button>

            <button>
              <Icon name="Quote" />
            </button>
          </div>



*/
