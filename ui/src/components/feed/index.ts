export type BaseDeck = {
  type: "github" | "reddit" | "rss" | "youtube" | "hackernews";
  url: string;
  options: string[];
};
