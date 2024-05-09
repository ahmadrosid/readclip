import { buttonVariants } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function DialogDemo({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn("px-6 flex items-center underline", className)}
      >
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
    <div>
      <div className="py-0 sm:py-16 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-gray-50 dark:bg-gray-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl py-0 sm:py-16 mx-auto text-left sm:text-center px-4 sm:px-0">
          <div className="py-6 max-w-4xl">
            <Badge
              variant={"secondary"}
              className="py-2 px-4 rounded-full border border-gray-200 dark:border-gray-500"
            >
              Read, Save, Organize and Enjoy
            </Badge>
            <h1 className="py-4 sm:py-8 text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-7xl sm:leading-[4.5rem] dark:text-gray-200">
              {/* Bookmarks manager that saves both links and their content. */}
              {/* Bookmarks manager with content backup */}
              {/* Read article without ads widget or any distractions. */}
              Curate Your Own Clutter-Free Content Library
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Your one-stop solution for bookmarking, tagging, and enjoying online content.
            </p>
          </div>
          <div className="flex justify-start sm:justify-center gap-2 items-center py-6">
            <Link
              to="/clip"
              className={cn(
                buttonVariants({
                  size: "lg",
                  className:
                    "items-center justify-between h-10  dark:text-gray-100 text-white dark:bg-gray-700 dark:hover:bg-gray-800",
                })
              )}
            >
              Getting started
            </Link>
            <DialogDemo />
          </div>
        </div>
      </div>

      <div className="p-8 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto space-y-4 py-12 mb-2 px-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
          The Better Way to Bookmark and Read
          </h2>
        </div>
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-red-200">
              <CardContent className="p-6">
                <CardTitle className="pb-4 text-xl">😩 Reading Without ReadClip</CardTitle>
                <ul className="list-disc list-inside px-4 space-y-4 py-4">
                  <li>Constant distractions from ads & widgets</li>
                  <li>Easily lose track of interesting reads</li>
                  <li>Links break when sites go down</li>
                  <li>Content gets removed or paywalled</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-green-200">
              <CardContent className="p-6">
                <CardTitle className="pb-4 text-xl">😎 Reading With ReadClip</CardTitle>
                <ul className="list-disc list-inside px-4 space-y-4 py-4">
                  <li>Strip away ads for uninterrupted focus</li>
                  <li>Build a personal library of saved articles</li>
                  <li>Access content even if original link breaks</li>
                  <li>Easily find & rediscover reads with tagging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-4 py-12 mb-8 px-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 pb-16">
            <Card>
              <CardContent className="p-6">
                <div className="text-[50px] h-20 w-20">💾</div>
                <CardTitle className="pb-4 text-xl">Content Saving</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Save Any Online Article: Readclip lets you save articles, blog
                  posts, news, and more from the web with a single click.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-[57px] h-20 w-20">📖</div>
                <CardTitle className="pb-4 text-xl">
                  Distraction-Free Reading
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Readclip downloads saved links' HTML content, removing ads,
                  widgets, and distractions for clean, easy reading.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-[57px] h-20 w-20">🏷️</div>
                <CardTitle className="pb-4 text-xl">
                  Tagging and Categorization
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Easily organize saved links with customizable tags. Quickly
                  find what you need by topic, source, or other criteria.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-[57px] h-20 w-20">💡</div>
                <CardTitle className="pb-4 text-xl">Feeds</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Setup news feeds from popular media like Reddit, Hacker News,
                  and YouTube channels you like to get the latest updates with a
                  single click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-8 dark:bg-gray-800">
        <div
          ref={howToRef}
          id="how-to"
          className="max-w-4xl mx-auto space-y-4 py-12 mb-8"
        >
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-800 sm:text-5xl sm:leading-[3.5rem] dark:text-white">
            How it works?
          </h2>
          {/* <Separator /> */}
          <p className="text-lg font-normal py-2">
            You can use Readclip in two simple ways: bookmarklet or submit a
            link.
          </p>
          <div className="space-y-4 pt-8">
            <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
              Submit link.
            </h3>
            <div className="text-lg font-normal">
              <p className="pb-4">
                Got to to{" "}
                <Link to={"/clip"} className="underline">
                  Clip
                </Link>{" "}
                page and submit your link there.
              </p>
              <div className="py-2 block">
                <img
                  src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700714/submit-readclip_hszpvj.png"
                  alt="clip"
                  className="w-full border rounded-md"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] text-gray-700 dark:text-gray-300">
                Bookmarklet
              </h3>
              <div className="text-lg font-normal">
                <p className="py-4">
                  You also can use bookmarklet to save your link. Drag and drop
                  the bookmarklet link into you bookmark bar.
                </p>
                <div className="py-2">
                  <img
                    src="https://res.cloudinary.com/dr15yjl8w/image/upload/v1696700583/bookmarklet-readclip_scghdf.png"
                    alt="clip"
                    className="w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
