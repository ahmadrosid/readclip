import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/router";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto pt-8">
      <div className="max-w-3xl py-16 mx-auto text-left">
        <p>Bookmark manager for organizing your links from internet.</p>
        <p className="py-6 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          A better way to bookmark, read news, blogs, or any internet text
          without ads.
        </p>
        <Link
          to="/clip"
          className={cn(
            buttonVariants({
              size: "lg",
              className:
                "items-center justify-between h-10 bg-black dark:bg-white text-white dark:text-black",
            })
          )}
        >
          Start bookmarking <ArrowRight className="w-4 h-4 ml-3" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 py-12">
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          Why?
        </h2>
        <p className="text-lg font-medium">
          The web these days is very cluttered with ads and widgets everywhere.
          While I don't have an issue with website owners displaying ads to earn
          some money from the content they create, sometimes they don't care
          about us, the readers. Sometime they place ads in a way that prevents
          us from even being able to read the texts.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 py-12 mb-8">
        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          Features
        </h2>
        <div className="space-y-4 pt-8">
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700">
            Reading
          </h3>
          <p className="text-lg font-medium">
            Readclip will download the html content, then do some magic and turn
            it into markdown, and present it in a simple and clean manner,
            allowing for easier reading without any ads or distractions. You can
            choose between dark mode or light mode for your reading preference.
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700">
            Bookmarking
          </h3>
          <p className="text-lg font-medium">
            When bookmarking links from internet sometimes you will lose the
            content when the link is no longer accesable. With ReadClip, we aim
            to address this by preserving the content. This way, even if the
            links are broken, we'll still have access to the text from those
            inaccessible sources.
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700">
            You own your data
          </h3>
          <p className="text-lg font-medium">
            When you save a bookmark, we'll download the content and store it in
            database and only you can access the data. You can also export your
            data to JSON or csv format. This way, you can always have access to
            your data.
          </p>
        </div>
      </div>
    </div>
  );
}
