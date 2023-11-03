export type BaseDeck = {
  type: "github" | "reddit" | "rss" | "youtube" | "hackernews" | "indiehacker";
  url: string;
  options: string[];
};

export interface MediaExtensions {
  media: Media;
}

interface Media {
  group: Group[];
}

interface Group {
  name: string;
  value: string;
  attrs: Attrs;
  children: Children2;
}

interface Children2 {
  community: Community[];
  content: Content[];
  description: Description[];
  thumbnail: Thumbnail[];
  title: Description[];
}

interface Thumbnail {
  name: string;
  value: string;
  attrs: Attrs5;
  children: Attrs;
}

interface Attrs5 {
  height: string;
  url: string;
  width: string;
}

interface Description {
  name: string;
  value: string;
  attrs: Attrs;
  children: Attrs;
}

interface Content {
  name: string;
  value: string;
  attrs: Attrs4;
  children: Attrs;
}

interface Attrs4 {
  height: string;
  type: string;
  url: string;
  width: string;
}

interface Community {
  name: string;
  value: string;
  attrs: Attrs;
  children: Children;
}

interface Children {
  starRating: StarRating[];
  statistics: Statistic[];
}

interface Statistic {
  name: string;
  value: string;
  attrs: Attrs3;
  children: Attrs;
}

interface Attrs3 {
  views: string;
}

interface StarRating {
  name: string;
  value: string;
  attrs: Attrs2;
  children: Attrs;
}

interface Attrs2 {
  average: string;
  count: string;
  max: string;
  min: string;
}

interface Attrs {}
