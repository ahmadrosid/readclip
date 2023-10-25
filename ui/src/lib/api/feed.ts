import { handleReturnFetch, getToken } from ".";

type FeedItem = {
  title: string;
  description: string;
  content: string;
  link: string;
  links: string[];
  published: string;
  publishedParsed: string;
};

type ApiResponse = {
  data?: {
    title: string;
    description: string;
    link: string;
    links: string[];
    updated: string;
    updatedParsed: string;
    language: string;
    items: FeedItem[];
    feedType: string;
    feedVersion: string;
  };
};

type RequestRssFeed = {
  url: string;
  type: string;
  options: string[];
};

export async function fetchRssFeed(
  request: RequestRssFeed
): Promise<ApiResponse> {
  return handleReturnFetch(
    await fetch("/api/rss/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(request),
    })
  );
}
