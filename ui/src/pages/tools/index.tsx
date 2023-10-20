import { Title } from "@/components/ui/title";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const tools = [
  {
    slug: "youtube-transcriber",
    title: "Youtube Transcriber",
    description:
      "Don't really have time to watch videos? Now you can read them!",
    link: "/tools/youtube-transcriber",
  },
  {
    slug: "reddit-reader",
    title: "Reddit reader",
    description: "Read reddit discussion without distraction wihtout pain!",
    link: "/tools/reddit-reader",
  },
  {
    slug: "word-counter",
    title: "Words counter",
    description: "Count the words in your text",
    link: "/tools/word-counter",
  },
  {
    slug: "reading-time",
    title: "Reading time estimator",
    description: "Estimate the reading time of your text",
    link: "/tools/reading-time",
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Write, edit and view Markdown files.",
    link: "/tools/markdown-editor",
  },
];

export default function Tools() {
  return (
    <div className="container px-4 sm:px-8 mx-auto min-h-[80vh]">
      <div className="pt-6 pb-4">
        <Title className="pb-4">Free tools from Readclip</Title>
        <p className="text-lg text-gray-600">
          Free tools from readclip to help with your day to day works no ads no
          distractions.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
