import { handleReturnFetch, getToken } from "./index";

type VideoInfo = {
  ID: string;
  channel_id: string;
  title: string;
  duration: number;
  short_description: string;
  author: string;
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
  category: string;
};

type Content = {
  text: string;
  duration: number;
  offset: number;
};

type VideoData = {
  info: VideoInfo;
  url: string;
  content: Content[];
  language: string;
};

export type FindChannelResponse = {
  id: string;
  name: string;
  thumbnail: string;
};

export const fetchYoutubeTranscript = async (
  url: string
): Promise<VideoData> => {
  return handleReturnFetch(
    await fetch("/api/youtube/transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ url }),
    })
  );
};

export const findYoutubeChannels = async (
  query: string
): Promise<FindChannelResponse[]> => {
  return handleReturnFetch(
    await fetch("/api/youtube/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ query }),
    })
  );
};
