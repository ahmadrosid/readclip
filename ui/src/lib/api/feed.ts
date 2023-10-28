import { MediaExtensions } from "@/components/feed";
import { handleReturnFetch, getToken } from ".";

type FeedItem = {
  title: string;
  description: string;
  content: string;
  link: string;
  links: string[];
  published: string;
  publishedParsed: string;
  extensions: MediaExtensions;
};

type ApiResponse = {
  id: string;
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
  id: string;
  url: string;
  type: string;
  options: string[];
};

export async function fetchRssFeed(
  request: RequestRssFeed
): Promise<ApiResponse> {
  if (!request.id) {
    throw new Error("ID is required!");
  }

  return handleReturnFetch(
    await fetch("/api/rss/parse?id=" + request.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(request),
    })
  );
}
