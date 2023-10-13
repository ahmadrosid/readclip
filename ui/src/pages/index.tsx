import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link } from "@/router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger className="px-6 flex items-center underline">
        See Demo <ArrowRight className="w-4 h-4 ml-3" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Demo</DialogTitle>
          <div className="pt-4">
            <iframe
              className="overflow-hidden rounded-md"
              width="620"
              height="400"
              src="https://www.youtube.com/embed/PZbvBXEPvFk?si=9EW0yHgN10Q3GVY_"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const howToRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.hash === "#how-to") {
      howToRef.current?.scrollIntoView();
    }
  }, [howToRef]);

  return (
    <div className="container px-4 sm:px-8 mx-auto pt-8">
      <div className="max-w-3xl py-16 mx-auto text-left">
        <p>Welcome to Readclip.</p>
        <p className="py-6 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          A better way to bookmark, read news, blogs, or any text from internet
          without ads.
        </p>
        <div className="flex gap-2 items-center">
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
            Getting started
          </Link>
          <DialogDemo />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-4 py-12 mb-8">
        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          Features
        </h2>
        <Separator />
        <div className="space-y-4 pt-8">
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
            Reading
          </h3>
          <p className="text-lg font-medium">
            Readclip will download the html content, then do some magic and turn
            it into markdown, and present it in a simple and clean manner,
            allowing for easier reading without any ads or distractions. You can
            choose between dark mode or light mode for your reading preference.
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
            Bookmarking
          </h3>
          <p className="text-lg font-medium">
            When bookmarking links from the internet, you will sometimes lose
            the content when the link is no longer accessible. With ReadClip, we
            aim to address this by preserving the content. This way, even if the
            links are broken, you still have access to it.
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
            Own your data
          </h3>
          <p className="text-lg font-medium">
            When you save a bookmark, we'll download the content and store it in
            the database, and only you can access the data. You can also export
            your data to JSON or CSV format. This way, you can always have
            access to your data even if you delete your account.
          </p>
        </div>
      </div>

      <div
        ref={howToRef}
        id="how-to"
        className="max-w-3xl mx-auto space-y-4 py-12 mb-8"
      >
        <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          How it works?
        </h2>
        <Separator />
        <p className="text-lg font-medium">
          You can use Readclip in two simple ways: bookmarklet or submit a link.
        </p>
        <div className="space-y-4 pt-8">
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
            Submit link.
          </h3>
          <p className="text-lg font-medium">
            Got to to{" "}
            <Link to={"/clip"} className="underline">
              Clip
            </Link>{" "}
            page and submit your link there.
            <img
              src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700714/submit-readclip_hszpvj.png"
              alt="clip"
              className="w-full border my-2 rounded-md"
            />
          </p>
          <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
            Bookmarklet
          </h3>
          <p className="text-lg font-medium">
            You also can use bookmarklet to save your link. Drag and drop the
            bookmarklet link into you bookmark bar.
            <img
              src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700583/bookmarklet-readclip_scghdf.png"
              alt="clip"
              className="w-full border my-2 rounded-md"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
