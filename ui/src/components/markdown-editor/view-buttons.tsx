import { twMerge } from "tailwind-merge";
import Icon from "../lucide-icon";

interface PropInterface {
  splitView: Function;
  viewMode: "split" | "editor" | "viewer";
}
type IconName = "Pencil" | "Eye" | "Columns";

const buttons: { icon: IconName; mode: string }[] = [
  {
    icon: "Pencil",
    mode: "editor",
  },
  {
    icon: "Columns",
    mode: "split",
  },
  {
    icon: "Eye",
    mode: "viewer",
  },
];
export default function ViewButton({ splitView, viewMode }: PropInterface) {
  return (
    <div className="flex  my-2">
      {buttons.map((button, idx) => (
        <button
          key={idx}
          onClick={() => splitView(button.mode)}
          className={twMerge(
            "px-2 py-1 rounded",
            viewMode === button.mode ? "bg-gray-800 text-white" : ""
          )}
        >
          <Icon name={button.icon} />
        </button>
      ))}
    </div>
  );
}
