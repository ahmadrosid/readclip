import { CheckCircle2, RssIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { RedditIcon } from "@/components/icons/reddit";
import { HackerNewsIcon } from "@/components/icons/hackernews";
import { YoutubeIcon } from "@/components/icons/youtube";
import { GithubIcon } from "@/components/icons/github";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { type BaseDeck } from "@/components/feed/index";
import { FeedItemYoutube } from "./item/youtube";
import { languages } from "@/lib/data/github";
import { FeedItemReddit } from "./item/reddit";

type FeedItemValue = {
  type: BaseDeck["type"];
  url: string;
  options: string[];
};

export function FeedItem({
  type,
  label,
  onValueUpdate,
}: {
  type: BaseDeck["type"];
  label: string;
  defaultItem?: FeedItemValue;
  onValueUpdate: (param: FeedItemValue) => void;
}) {
  const [showSelected, setShowSelected] = useState(false);
  const [selectedGithubValue, setSelectedGithubValue] = useState({
    language: "",
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

  const toggleShowSelected = useCallback(() => {
    setShowSelected((prev) => {
      if (prev === false) {
        onValueUpdate({
          type,
          url: "",
          options:
            type === "github"
              ? [selectedGithubValue.time, selectedGithubValue.language]
              : [],
        });
      }
      return !prev;
    });
  }, [
    onValueUpdate,
    selectedGithubValue.language,
    selectedGithubValue.time,
    type,
  ]);

  const isComingSoon = false;

  useEffect(() => {
    if (type !== "github") return;

    onValueUpdate({
      type: "github",
      options: [selectedGithubValue.time, selectedGithubValue.language],
      url: "",
    });
  }, [type, onValueUpdate, selectedGithubValue]);

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
        <div className="pt-2">
          <label>
            <p className="pb-2 inline-flex">
              <span className="flex-1 text-sm pb-2 text-gray-600">
                {"Rss feed url or "}
              </span>
              <a
                href="/explore-rss"
                className="text-sm px-1 text-gray-600 underline"
              >
                explore rss
              </a>
            </p>
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

      {type === "youtube" && showSelected && (
        <FeedItemYoutube
          onSubmit={(channelId) => {
            onValueUpdate({
              type,
              url: "",
              options: [channelId],
            });
          }}
        />
      )}

      {type === "reddit" && showSelected && (
        <FeedItemReddit
          onSubmit={(channelId) => {
            onValueUpdate({
              type,
              url: "",
              options: [channelId],
            });
          }}
        />
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
              {languages.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
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
