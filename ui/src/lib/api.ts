export type Article = {
  Id: string;
  Url: string;
  Title: string;
  Description: string;
  Content: string;
  CreatedAt: string;
  Hostname: string;
};

type BaseResponse = {
  current_datetime: string;
};

export type ArticleListResponse = BaseResponse & {
  status: string;
  data: Article[];
  page: number;
  per_page: number;
  total: number;
  nextCursor: number;
};

export type MarkdownResponse = BaseResponse & {
  data: Article;
  status: string;
};

export type Tag = {
  Id: string;
  UserID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export type TagListResponse = BaseResponse & {
  data: Tag[];
  status: string;
};

export type TagCreateResponse = BaseResponse & {
  data: Tag;
  status: string;
};

export type AddArticleTagResponse = BaseResponse & {
  data: {
    Id: string;
    TagID: string;
    ArticleID: string;
    CreatedAt: string;
  };
  status: string;
};

export const fetchAllArticles = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<ArticleListResponse> => {
  console.log("pageParam", pageParam);
  const res = await fetch("/api/clips?page=" + pageParam);
  return await res.json();
};

export const fetchDeleteArticle = async (
  id: string
): Promise<{ status: string }> => {
  const res = await fetch(`api/clips/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};

export const fetchMarkdown = async (url: string): Promise<MarkdownResponse> => {
  const res = await fetch("/api/clips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  });
  return await res.json();
};

export const fetchAllTags = async (): Promise<TagListResponse> => {
  const res = await fetch("/api/tags");
  return await res.json();
};

export const fetchCreateTag = async (
  name: string
): Promise<TagCreateResponse> => {
  const res = await fetch("/api/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });
  return await res.json();
};

export type AddArticleTagRequest = {
  article_id: string;
  tag_id: string;
};

export const fetchAddrticleTag = async ({
  article_id,
  tag_id,
}: AddArticleTagRequest): Promise<AddArticleTagResponse> => {
  const res = await fetch(`/api/tags/clip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      article_id,
      tag_id,
    }),
  });
  return await res.json();
};
