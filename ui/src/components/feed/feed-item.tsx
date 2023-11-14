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
import { IndiehackerIcon } from "../icons/indiehacker";
import { LaravelnewsIcon } from "../icons/laravelnews";
import { ProductHuntIcon } from "../icons/producthunt";
import Select from "react-select";

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
  const [indihackerNews, setSelectedIndiehackersValue] = useState("featured");
  const [selectedGithubValue, setSelectedGithubValue] = useState({
    language: "All",
    time: "daily",
  });
  let icon = <GithubIcon className="w-5 h-5 mr-4 dark:text-gray-100" />;
  switch (type) {
    case "github":
      icon = <GithubIcon className="w-5 h-5 mr-4 dark:text-gray-100" />;
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
    case "indiehacker":
      icon = <IndiehackerIcon className="w-5 h-5 mr-4" />;
      break;
    case "laravelnews":
      icon = <LaravelnewsIcon className="w-5 h-5 mr-4" />;
      break;
    case "producthunt":
      icon = <ProductHuntIcon className="w-5 h-5 mr-4" />;
      break;
  }

  const toggleShowSelected = useCallback(() => {
    setShowSelected((prev) => {
      if (prev === false) {
        const options = [];
        if (type === "github") {
          options.push(selectedGithubValue.time);
          options.push(selectedGithubValue.language);
        } else if (type === "indiehacker") {
          options.push(indihackerNews);
        }
        onValueUpdate({
          type,
          url: "",
          options: options,
        });
      }
      return !prev;
    });
  }, [
    onValueUpdate,
    selectedGithubValue.language,
    selectedGithubValue.time,
    type,
    indihackerNews,
  ]);

  useEffect(() => {
    if (type === "github") {
      onValueUpdate({
        type,
        options: [selectedGithubValue.time, selectedGithubValue.language],
        url: "",
      });
      return;
    } else if (type === "indiehacker") {
      onValueUpdate({
        type,
        options: [indihackerNews],
        url: "",
      });
    }
  }, [type, onValueUpdate, selectedGithubValue, indihackerNews]);

  return (
    <li
      className={cn(
        "border-b dark:border-gray-700/30 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/10",
        showSelected && "bg-gray-50 dark:bg-gray-700/5"
      )}
    >
      <div className="flex items-center" onClick={toggleShowSelected}>
        {icon}
        <p className={cn("flex-1 cursor-pointer")}>{label}</p>
        <CheckCircle2
          className={cn(
            "w-5 h-5 text-green-500 dark:text-green-300",
            !showSelected && "hidden"
          )}
        />
      </div>
      {type === "rss" && showSelected && (
        <div className="pt-2">
          <label>
            <p className="pb-2 inline-flex">
              <span className="flex-1 text-sm pb-2 text-gray-600 dark:text-gray-500">
                {"Rss feed url or "}
              </span>
              <a
                href="/explore-rss"
                className="text-sm px-1 text-gray-600 underline dark:text-gray-500"
              >
                explore rss
              </a>
            </p>
            <Input
              name="input_url_rss"
              className="bg-white dark:bg-gray-700"
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
              className="text-gray-600 text-sm pb-2 inline-block dark:text-gray-300"
            >
              Language
            </label>
            <Select
              className="dark:bg-gray-700 dark:text-gray-300"
              styles={{
                input: (baseStyles) => ({
                  ...baseStyles,
                  background: "transparent",
                }),
                control: (baseStyles) => ({
                  ...baseStyles,
                  background: "transparent",
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: "inherit",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  background: "inherit",
                }),
              }}
              defaultValue={{
                value: "",
                label: selectedGithubValue.language,
              }}
              onChange={(option) => {
                setSelectedGithubValue((prev) => ({
                  ...prev,
                  language: option?.value || "",
                }));
              }}
              isMulti={false}
              options={languages}
            />
          </div>
          <div>
            <label
              htmlFor="time_range"
              className="text-gray-600 text-sm pb-2 inline-block dark:text-gray-300"
            >
              Since
            </label>
            <Select
              className="dark:bg-gray-700 dark:text-gray-300"
              styles={{
                input: (baseStyles) => ({
                  ...baseStyles,
                  background: "transparent",
                }),
                control: (baseStyles) => ({
                  ...baseStyles,
                  background: "transparent",
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: "inherit",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  background: "inherit",
                }),
              }}
              defaultValue={{
                value: "daily",
                label: "Daily",
              }}
              onChange={(value) => {
                setSelectedGithubValue((prev) => ({
                  ...prev,
                  language: value?.value || "",
                }));
              }}
              isMulti={false}
              options={[
                {
                  label: "Daily",
                  value: "daily",
                },
                {
                  label: "Weekly",
                  value: "weekly",
                },
                {
                  label: "Monthly",
                  value: "monthly",
                },
              ]}
            />
          </div>
        </div>
      )}

      {type === "indiehacker" && showSelected && (
        <div className="pt-4 grid grid-cols-1">
          <div>
            <label
              htmlFor="mode"
              className="text-gray-600 text-sm pb-2 inline-block dark:text-gray-300"
            >
              News
            </label>
            <select
              id="mode"
              name="mode"
              onChange={(e) => setSelectedIndiehackersValue(e.target.value)}
              className="w-full text-sm ring-1 ring-gray-200 dark:ring-gray-600 dark:bg-gray-700 focus:outline-none shadow-sm p-2 rounded border-r-8 border-transparent"
            >
              <option value={"featured"}>Featured</option>
              <option value={"latest"}>Latest</option>
            </select>
          </div>
        </div>
      )}
    </li>
  );
}
