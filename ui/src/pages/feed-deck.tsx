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
import React, { useCallback, useEffect, useState } from "react";
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

type DeckComponentProps = DeckProps & {
  id: string;
  onDeleteDeck: (id: string) => void;
};

const DeckComponent = React.memo<DeckComponentProps>(
  ({ type, url, options, id, onDeleteDeck }) => {
    const queryData = useQuery({
      queryFn: () =>
        fetchRssFeed({
          type: type,
          url: url,
          options: options,
        }),
      queryKey: id,
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

    const getLogoUrl = (link: string) => {
      const url = new URL(link);
      return `https://logo.clearbit.com/${url.host}`;
    };

    return (
      <div className="w-full max-w-md border-r border-b bg-white flex-shrink-0">
        <div className="p-2 border-b flex gap-2 items-center">
          {queryData.data?.data && (
            <img
              src={getLogoUrl(queryData.data?.data?.link)}
              alt={queryData.data?.data?.title}
              className="w-6 h-6"
            />
          )}
          <div className="flex-1">{queryData.data?.data?.title}</div>
          <Popover>
            <PopoverTrigger>
              <MoreVertical />
            </PopoverTrigger>
            <PopoverContent side="left" align="start" className="p-2 w-52">
              <div className="grid gap-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  type="submit"
                  onClick={() => queryData.refetch()}
                >
                  <RefreshCcwIcon className="w-4 h-4 mr-3" /> Refresh
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onDeleteDeck(id)}
                >
                  <Trash2 className="w-4 h-4 mr-3" /> Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid max-h-[85vh] overflow-y-auto">
          {queryData?.data?.data?.items.map((item) => (
            <div key={item.link} className="hover:bg-gray-100 border-b p-2">
              <h3 className="font-bold text-gray-800 tracking-tight text-base pb-1">
                {item.title}
              </h3>
              <div
                className="text-gray-700 text-sm space-y-1"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

type FeedItemValue = {
  type: DeckProps["type"];
  url: string;
  options: string[];
};

function FeedItem({
  type,
  label,
  onValueUpdate,
}: {
  type: DeckProps["type"];
  label: string;
  defaultItem?: FeedItemValue;
  onValueUpdate: (param: FeedItemValue) => void;
}) {
  const [showSelected, setShowSelected] = useState(false);
  const [selectedGithubValue, setSelectedGithubValue] = useState({
    language: "go",
    time: "daily",
  });
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

  useEffect(() => {
    onValueUpdate({
      type: "github",
      options: [selectedGithubValue.time, selectedGithubValue.language],
      url: "",
    });
  }, [onValueUpdate, selectedGithubValue]);

  return (
    <li
      className={cn(
        "border-b p-4 hover:bg-gray-50",
        showSelected && "bg-gray-50"
      )}
    >
      <div className="flex items-center" onClick={toggleShowSelected}>
        {icon}
        <p
          className={cn(
            "flex-1 cursor-pointer",
            isComingSoon && "text-gray-400"
          )}
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
            <span className="text-sm pb-2 block text-gray-600">
              Rss Feed Url
            </span>
            <Input
              name="input_url_rss"
              className="bg-white"
              placeholder="https://example.com/rss.xml"
              onChange={(e) =>
                onValueUpdate({
                  type: "rss",
                  url: e.currentTarget.value,
                  options: [],
                })
              }
            />
          </label>
        </div>
      )}
      {type === "github" && showSelected && (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="language"
              className="text-gray-600 text-sm pb-2 inline-block"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              onChange={(e) =>
                setSelectedGithubValue((prev) => ({
                  ...prev,
                  language: e.target.value,
                }))
              }
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
              htmlFor="time_range"
              className="text-gray-600 text-sm pb-2 inline-block"
            >
              Since
            </label>
            <select
              id="time_range"
              name="time_range"
              onChange={(e) => {
                setSelectedGithubValue((prev) => ({
                  ...prev,
                  time: e.target.value,
                }));
              }}
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

type SavedComponentItem = DeckProps & { id: string };

export default function FeedDeckPage() {
  const deckItemKey = "saved-decks-items";
  const [showAddDeckDialog, setShowAddDeckDialog] = useState(false);
  const [savedDecksComponents, setSavedDecksComponents] = useState<
    SavedComponentItem[]
  >(() => {
    const savedDecks = window.localStorage.getItem(deckItemKey);
    if (savedDecks) {
      const data = JSON.parse(savedDecks);
      return data;
    }
    return [];
  });
  const [selectedFeedItem, setSelectedFeedItem] = useState<
    FeedItemValue | undefined
  >();

  const handleAddNewFeed = useCallback(() => {
    if (!selectedFeedItem) return;
    if (selectedFeedItem.type === "rss" && selectedFeedItem.url === "")
      return toast.error("Rss feed url is required!");
    setSavedDecksComponents((prev) => {
      const newDeck = [
        ...prev,
        {
          type: selectedFeedItem.type,
          url: selectedFeedItem.url,
          options: selectedFeedItem.options,
          id: crypto.randomUUID(),
        },
      ];
      window.localStorage.setItem(deckItemKey, JSON.stringify(newDeck));
      return newDeck;
    });
    setSelectedFeedItem(undefined);
    setShowAddDeckDialog(false);
  }, [selectedFeedItem]);

  const handleDeleteSavedDeckById = (id: string) => {
    setSavedDecksComponents((prev) => {
      const data = [...prev];
      const newDeck = data.filter((item) => item.id != id);
      window.localStorage.setItem(deckItemKey, JSON.stringify(newDeck));
      return newDeck;
    });
  };

  return (
    <div className="flex overflow-x-auto border-l">
      {savedDecksComponents.map((item, idx) => (
        <DeckComponent
          key={idx}
          type={item.type}
          url={item.url}
          options={item.options}
          id={item.id}
          onDeleteDeck={(id) => handleDeleteSavedDeckById(id)}
        />
      ))}
      <div
        className={cn(
          "grid min-w-[28rem] place-content-center h-[80vh]",
          savedDecksComponents.length === 0 && "w-screen"
        )}
      >
        <div>
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
                  <FeedItem
                    type="github"
                    label="Github Trending"
                    defaultItem={selectedFeedItem}
                    onValueUpdate={setSelectedFeedItem}
                  />
                  <FeedItem
                    type="rss"
                    label="RSS Feed"
                    onValueUpdate={setSelectedFeedItem}
                  />
                  <FeedItem
                    type="hackernews"
                    label="Hackernews"
                    onValueUpdate={setSelectedFeedItem}
                  />
                  <FeedItem
                    type="reddit"
                    label="Sub Reddit"
                    onValueUpdate={setSelectedFeedItem}
                  />
                  <FeedItem
                    type="youtube"
                    label="Youtube Channel"
                    onValueUpdate={setSelectedFeedItem}
                  />
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
                <Button size="sm" className="px-6" onClick={handleAddNewFeed}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
