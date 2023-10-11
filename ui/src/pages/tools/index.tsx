import { Title } from "@/components/ui/title";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const tools = [
  {
    title: "Words counter",
    description: "Count the words in your text",
    link: "/tools/word-counter",
  },
  {
    title: "Reading time estimator",
    description: "Estimate the reading time of your text",
    link: "/tools/reading-time",
  },
  {
    title: "Markdown Editor",
    description: "Write, edit and view Markdown files.",
    link: "/tools/markdown-editor",
  },
  {
    title: "English Thesaurus",
    description:
      "Tired of using the same old, mundane words? 🔍 Discover the power of precision with our thesaurus. Find the perfect word to convey your exact meaning and stand out from the crowd. 📚✨",
    link: "/tools/english-thesaurus",
  },
];

export default function Tools() {
  return (
    <div className="container mx-auto min-h-[80vh]">
      <div className="pt-6 pb-4">
        <Title className="pb-4">Free tools from Readclip</Title>
        <p className="text-lg text-gray-600">
          Free tools from readclip to help with your day to day works no ads no
          distractions.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card key={tool.title}>
            <a href={tool.link}>
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
