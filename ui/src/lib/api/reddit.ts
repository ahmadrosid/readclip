import { handleReturnFetch, getToken } from ".";

export type RedditResponse = {
  Id: string;
  Url: string;
  Title: string;
  Description: string;
  Content: string;
  CreatedAt: string;
  Hostname: string;
};

export async function fetchRedditPost(url: string): Promise<RedditResponse> {
  return handleReturnFetch(
    await fetch("/api/reddit/grab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        url,
      }),
    })
  );
}
