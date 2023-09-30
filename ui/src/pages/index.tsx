import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/router";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto pt-8">
      <div className="max-w-2xl pt-16 pb-8 mx-auto text-center">
        <p>Bookmark manager for organizing your links from internet.</p>
        <p className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          A better way to bookmark, read news, blogs, or any internet text
          without ads.
        </p>
      </div>
      <div className="text-center">
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
    </div>
  );
}
