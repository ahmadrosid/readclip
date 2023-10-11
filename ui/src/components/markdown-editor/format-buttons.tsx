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
}

const buttons: ButtonProps[] = [
  {
    icon: "Undo",
    title: "Undo",
  },
  {
    icon: "Redo",
    title: "Redo",
  },
  {
    icon: "Bold",
    title: "Bold",
  },
  {
    icon: "Italic",
    title: "Italic",
  },
  {
    icon: "Strikethrough",
    title: "Strikethrough",
  },
  {
    icon: "Heading",
    title: "Add heading",
  },
  {
    icon: "Code2",
    title: "Insert code block",
  },
  {
    icon: "List",
    title: "Add bulleted list",
  },
  {
    icon: "ListOrdered",
    title: "Add numbered list",
  },
  {
    icon: "ListChecks",
    title: "Add check lists",
  },
  {
    icon: "Link",
    title: "Add hyperlink",
  },
  {
    icon: "Image",
    title: "Add image",
  },
  {
    icon: "Minus",
    title: "Insert horizontal line",
  },
  {
    icon: "Quote",
    title: "Add blockquote",
  },
];

const separators: number[] = [2, 6, 10];

export default function FormatButtons() {
  const formatText = () => {
    console.log("formatting texts");
  };
  return (
    <div className="flex gap-2 p-2">
      {buttons.map((button, idx) => {
        const separator = separators.includes(idx) ? (
          <div className="border border-gray-600"></div>
        ) : (
          ""
        );
        return (
          <>
            {separator}
            <button key={idx} title={button.title} onClick={formatText}>
              <Icon name={button.icon} />
            </button>
          </>
        );
      })}
    </div>
  );
}
