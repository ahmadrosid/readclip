import { getToken, handleReturnFetch } from "./api";

type VideoInfo = {
  id: string;
  channel_id: string;
  title: string;
  duration: number;
  keywords: string[];
  is_owner_viewing: boolean;
  short_description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  }[];
  allow_ratings: boolean;
  view_count: number;
  author: string;
  is_private: boolean;
  is_live: boolean;
  is_live_content: boolean;
  is_upcoming: boolean;
  is_post_live_dvr: boolean;
  is_crawlable: boolean;
  embed: {
    iframe_url: string;
    width: number;
    height: number;
  };
  channel: {
    id: string;
    name: string;
    url: string;
  };
  is_unlisted: boolean;
  is_family_safe: boolean;
  category: string;
  has_ypc_metadata: boolean;
  start_timestamp: null | number;
};

export const fetchYoutubeTranscribe = async (
  url: string
): Promise<{
  info: VideoInfo;
  url: string;
  content: string;
  language: string;
}> => {
  if (url === "") {
    throw new Error("Url is required!");
  }

  return handleReturnFetch(
    await fetch(`https://echo-tube.vercel.app/transcribe`, {
      method: "POST",
      body: JSON.stringify({ videoUrl: url }),
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};
