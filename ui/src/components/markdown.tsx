import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose px-4 max-w-3xl dark:prose-invert"
    >
      {children}
    </ReactMarkdown>
  );
}
