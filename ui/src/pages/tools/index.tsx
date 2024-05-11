import { Title } from "@/components/ui/title";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/router";

export const tools = [
  {
    slug: "youtube-transcriber",
    title: "Youtube Transcriber",
    description:
      "Don't really have time to watch videos? Now you can read them!",
    link: `/tools/youtube-transcriber` as const,
  },
  {
    slug: "reddit-reader",
    title: "Reddit reader",
    description: "Read reddit discussion without distraction wihtout pain!",
    link: "/tools/reddit-reader" as const,
  },
  {
    slug: "markdown-editor",
    title: "Markdown Editor",
    description: "Write, edit and view Markdown texts.",
    link: "/tools/markdown-editor" as const,
  },
  {
    slug: "word-counter",
    title: "Words counter",
    description: "Count the words in your text",
    link: "/tools/word-counter" as const,
  },
  {
    slug: "reading-time",
    title: "Reading time estimator",
    description: "Estimate the reading time of your text",
    link: "/tools/reading-time" as const,
  },
  {
    slug: "business-analysis",
    title: "Business Value Proposition Analysis",
    description:
      "Find out Business Value Proposition Statement from landing page using AI.",
    link: "/tools/business-analysis" as const,
  },
  {
    slug: "html-to-markdown",
    title: "Html to markdown",
    description: "Convert HTML to markdown.",
    link: "/tools/html-to-markdown" as const,
  },
];

export default function Tools() {
  return (
    <div className="container px-4 sm:px-8 mx-auto min-h-[80vh]">
      <div className="pt-6 pb-4">
        <Title className="pb-4">Free tools from Readclip</Title>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          ReadClip offers free tools to help streamline your daily tasks, without ads or distractions.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8">
        <Card>
          <Link to="/tools/markdown-editor">
            <CardHeader>
              <CardTitle>Markdown Editor</CardTitle>
              <CardDescription>
                Write, edit and view Markdown texts.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/word-counter">
            <CardHeader>
              <CardTitle>Word counter</CardTitle>
              <CardDescription>Count the words in your text.</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/reading-time">
            <CardHeader>
              <CardTitle>Reading time estimator</CardTitle>
              <CardDescription>
                Estimate the reading time of your text.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/business-analysis">
            <CardHeader>
              <CardTitle>Business Value Proposition Analysis</CardTitle>
              <CardDescription>
                Discover a Business's Value Proposition Statement from its Landing Page Using AI.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/reddit-reader">
            <CardHeader>
              <CardTitle>Reddit reader</CardTitle>
              <CardDescription>
                Read Reddit discussions without distractions or eye strain!
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/youtube-transcriber">
            <CardHeader>
              <CardTitle>Youtube Transcriber</CardTitle>
              <CardDescription>
                Don't really have time to watch videos? Now you can read them!
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
        <Card>
          <Link to="/tools/html-to-markdown">
            <CardHeader>
              <CardTitle>Html to markdown</CardTitle>
              <CardDescription>
                Convert HTML to markdown.
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
}
