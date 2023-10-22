import { handleReturnFetch, getToken } from ".";

type Metadata = {
  Title: string;
  Author: string;
  URL: string;
  Hostname: string;
  Description: string;
  Sitename: string;
  ID: string;
  Fingerprint: string;
  License: string;
  Language: string;
  Image: string;
  PageType: string;
};

type Data = {
  Url: string;
  Title: string;
  Content: string;
  Metadata: Metadata;
};

type ApiResponse = {
  current_datetime: string;
  data: Data;
  status: string;
};

export async function fetchScrapeLandingPage(
  url: string
): Promise<ApiResponse> {
  return handleReturnFetch(
    await fetch("/api/clips/scrape", {
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
