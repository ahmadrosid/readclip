import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  CheckCircle2,
  MoreVertical,
  PlusIcon,
  RefreshCcwIcon,
  RssIcon,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { fetchRssFeed } from "@/lib/api/feed";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { RedditIcon } from "@/components/icons/reddit";
import { HackerNewsIcon } from "@/components/icons/hackernews";
import { YoutubeIcon } from "@/components/icons/youtube";
import { GithubIcon } from "@/components/icons/github";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type DeckProps = {
  type: "github" | "reddit" | "rss" | "youtube" | "hackernews";
  url: string;
  options: string[];
};

function DeckComponent({ type, url, options }: DeckProps) {
  const queryData = useQuery({
    queryFn: () =>
      fetchRssFeed({
        type: type,
        url: url,
        options: options,
      }),
    queryKey: "query-fetch-feed",
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="w-full max-w-md border-r bg-white flex-shrink-0">
      <div className="p-2 border-b flex gap-2 items-center">
        <img
          src="https://logo.clearbit.com/https://ahmadrosid.com"
          alt={queryData.data?.data?.title}
          className="w-6 h-6"
        />
        <div className="flex-1">{queryData.data?.data?.title}</div>
        <Popover>
          <PopoverTrigger>
            <MoreVertical />
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="p-2 w-52">
            <div className="grid gap-2">
              <Button variant={"ghost"} className="justify-start">
                <RefreshCcwIcon className="w-4 h-4 mr-3" /> Refresh
              </Button>
              <Button variant={"ghost"} className="justify-start">
                <Trash2 className="w-4 h-4 mr-3" /> Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2 max-h-[85vh] overflow-y-auto">
        {queryData?.data?.data?.items.map((item) => (
          <div key={item.link} className="hover:bg-gray-100 border-b p-2">
            <h3 className="font-bold text-gray-800 tracking-tight text-lg">
              {item.title}
            </h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedItem({ type, label }: { type: DeckProps["type"]; label: string }) {
  const [showSelected, setShowSelected] = useState(false);
  let icon = <GithubIcon className="w-5 h-5 mr-4" />;
  switch (type) {
    case "github":
      icon = <GithubIcon className="w-5 h-5 mr-4" />;
      break;
    case "rss":
      icon = <RssIcon className="w-5 h-5 mr-4" />;
      break;
    case "youtube":
      icon = <YoutubeIcon className="w-5 h-5 mr-4" />;
      break;
    case "reddit":
      icon = <RedditIcon className="w-5 h-5 mr-4" />;
      break;
    case "hackernews":
      icon = <HackerNewsIcon className="w-5 h-5 mr-4" />;
      break;
  }

  const toggleShowSelected = useCallback(
    () => setShowSelected((prev) => !prev),
    []
  );

  const isComingSoon =
    type === "youtube" || type === "hackernews" || type === "reddit";

  return (
    <li
      className={cn(
        "border-b p-4 hover:bg-gray-50",
        showSelected && "bg-gray-50"
      )}
    >
      <div className="flex items-center">
        {icon}
        <p
          className={cn(
            "flex-1 cursor-pointer",
            isComingSoon && "text-gray-400"
          )}
          onClick={toggleShowSelected}
        >
          {label}
        </p>
        {isComingSoon ? (
          <p className="text-xs text-gray-500">Coming soon</p>
        ) : (
          <CheckCircle2
            className={cn("w-5 h-5 text-gray-500", !showSelected && "hidden")}
          />
        )}
      </div>
      {type === "rss" && showSelected && (
        <div className="pt-4">
          <label>
            <span className="text-xs pb-2 block">Rss Feed Url</span>
            <Input
              name="input_url_rss"
              className="bg-white"
              placeholder="https://example.com/rss.xml"
            />
          </label>
        </div>
      )}
      {type === "github" && showSelected && (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="location"
              className="text-gray-600 text-sm pb-2 inline-block"
            >
              Language
            </label>
            <select
              id="location"
              name="location"
              className="w-full text-sm ring-1 ring-gray-200 focus:outline-none shadow-sm p-2 rounded border-r-8 border-transparent"
            >
              <option value="go">Go</option>
              <option value="java">Java</option>
              <option value="php">PHP</option>
              <option value="rust">Rust</option>
              <option value="ruby">Ruby</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="location"
              className="text-gray-600 text-sm pb-2 inline-block"
            >
              Since
            </label>
            <select
              id="location"
              name="location"
              className="w-full text-sm ring-1 ring-gray-200 focus:outline-none shadow-sm p-2 rounded border-r-8 border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      )}
    </li>
  );
}

export default function FeedDeckPage() {
  const [showAddDeckDialog, setShowAddDeckDialog] = useState(false);
  const [savedDecksComponents, setSavedDecksComponents] = useState<DeckProps[]>(
    []
  );

  const handleAddNewFeed = useCallback(() => {
    setSavedDecksComponents((prev) => [
      ...prev,
      { type: "rss", url: "https://ahmadrosid.com", options: [] },
    ]);
  }, []);

  if (savedDecksComponents.length === 0) {
    return (
      <div className="grid place-content-center h-[80vh]">
        <Dialog open={showAddDeckDialog} onOpenChange={setShowAddDeckDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="justify-between px-3">
              <PlusIcon className="w-4 h-4 mr-1" /> Add feed
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 overflow-hidden gap-0">
            <DialogHeader className="px-4 py-4 border-b bg-gray-50">
              <DialogTitle>Add feed</DialogTitle>
            </DialogHeader>
            <div className="px-4 py-2 flex items-center gap-2">
              <SearchIcon className="w-5 h-5 text-gray-500" />
              <input
                placeholder="Search"
                className="p-2 w-full focus:outline-none"
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto border-t">
              <ul className="grid">
                <FeedItem type="github" label="Github Trending" />
                <FeedItem type="rss" label="RSS Feed" />
                <FeedItem type="hackernews" label="Hackernews" />
                <FeedItem type="reddit" label="Sub Reddit" />
                <FeedItem type="youtube" label="Youtube Channel" />
              </ul>
            </div>
            <DialogFooter className="px-4 py-3 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDeckDialog(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="px-6">
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto border-l">
      {savedDecksComponents.map((item, idx) => (
        <DeckComponent
          key={idx}
          type={item.type}
          url={item.url}
          options={item.options}
        />
      ))}
      <div className="grid min-w-[28rem] place-content-center h-[80vh]">
        <div>
          <Button
            variant="outline"
            onClick={handleAddNewFeed}
            className="justify-between px-3"
          >
            <PlusIcon className="w-4 h-4 mr-1" /> Add feed
          </Button>
        </div>
      </div>
    </div>
  );
}
