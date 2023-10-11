import { Fragment } from "react";
import Icon from "../lucide-icon";

type IconName =
  | "Undo"
  | "Redo"
  | "Bold"
  | "Italic"
  | "Strikethrough"
  | "Heading"
  | "Code2"
  | "List"
  | "ListOrdered"
  | "ListChecks"
  | "Link"
  | "Image"
  | "Minus"
  | "Quote";

interface ButtonProps {
  icon: IconName;
  title: string;
  type: string;
}

const buttons: ButtonProps[] = [
  {
    icon: "Undo",
    title: "Undo",
    type: "undo",
  },
  {
    icon: "Redo",
    title: "Redo",
    type: "redo",
  },
  {
    icon: "Bold",
    title: "Bold",
    type: "bold",
  },
  {
    icon: "Italic",
    title: "Italic",
    type: "italic",
  },
  {
    icon: "Strikethrough",
    title: "Strikethrough",
    type: "strike",
  },
  {
    icon: "Heading",
    title: "Add heading",
    type: "heading",
  },
  {
    icon: "Code2",
    title: "Insert code block",
    type: "code",
  },
  {
    icon: "List",
    title: "Add bulleted list",
    type: "bulleted-list",
  },
  {
    icon: "ListOrdered",
    title: "Add numbered list",
    type: "ordered-list",
  },
  {
    icon: "ListChecks",
    title: "Add check lists",
    type: "check-list",
  },
  {
    icon: "Link",
    title: "Add hyperlink",
    type: "link",
  },
  {
    icon: "Image",
    title: "Add image",
    type: "image",
  },
  {
    icon: "Minus",
    title: "Insert horizontal line",
    type: "hline",
  },
  {
    icon: "Quote",
    title: "Add blockquote",
    type: "quote",
  },
];

const separators: number[] = [2, 6, 10];

export default function FormatButtons({ setText }: { setText: React.Dispatch<React.SetStateAction<string>>  }) {
  const textArea = document.querySelector("#textarea") as HTMLTextAreaElement;

  const getCursorPosition = () => textArea.selectionStart;

  const isTextHighlighted = () =>
    textArea.selectionStart !== textArea.selectionEnd;
  
    const getSelectedText = () => {}; 

  const getText = () => textArea.value;

  const formatText = (type: string) => {
    const cursorPosition = getCursorPosition();
    const textHighlighted = isTextHighlighted();
    // const selectedText = 
    const text = getText();
    console.log(cursorPosition, textHighlighted);
    console.log(text)

    switch (type) {
      case "undo": {
        console.log("hello");
        break;
      }
      case "redo": {
        break;
      }
      case "bold": {
        break;
      }
      case "italic": {
        break;
      }
      case "strike": {
        break;
      }
      case "heading": {
        break;
      }
      case "code": {
        break;
      }

      case "bulleted-list": {
        break;
      }
      case "ordered-list": {
        break;
      }
      case "check-list": {
        break;
      }
      case "link": {
        break;
      }
      case "image": {
        break;
      }
      case "hline": {
        break;
      }
      case "quote": {
        break;
      }
    }
  };

  return (
    <div className="flex gap-2 p-2">
      {buttons.map((button, idx) => {
        const separator = separators.includes(idx) ? (
          <div className="border border-gray-400 mx-0"></div>
        ) : (
          ""
        );
        return (
          <Fragment key={idx}>
            {separator}
            <button
              title={button.title}
              onClick={() => formatText(button.type)}
            >
              <Icon name={button.icon} />
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
