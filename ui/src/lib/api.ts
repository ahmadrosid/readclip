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

export type User = {
  ID: string;
  Name: string;
  Email: string;
  FirebaseID: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
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

export type AddArticleTagRequest = {
  clip_id: string;
  tag_id: string;
};

export const getToken = () => {
  return window.localStorage.getItem("token") || "";
};

export const handleReturnFetch = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    if (res.status === 409) {
      throw new Error("User already exists");
    }
    if (res.status === 400) {
      throw new Error(data.error);
    }

    throw new Error("Error: " + res.statusText);
  }
  return data;
};

export const fetchAllArticles = async ({
  pageParam = 1,
  tagId = "",
}: {
  tagId?: string;
  pageParam?: number;
}): Promise<ArticleListResponse> => {
  let url = "/api/clips?page=" + pageParam;
  if (tagId !== "") {
    url += "&tag_id=" + tagId;
  }
  return handleReturnFetch(
    await fetch(url, {
      headers: {
        Authorization: getToken(),
      },
    })
  );
};

export const fetchDeleteArticle = async (
  id: string
): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`api/clips/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchMarkdown = async (url: string): Promise<MarkdownResponse> => {
  return handleReturnFetch(
    await fetch("/api/clips", {
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
};

export const fetchAllTags = async (): Promise<TagListResponse> => {
  return handleReturnFetch(
    await fetch("/api/tags", {
      headers: {
        Authorization: getToken(),
      },
    })
  );
};

export const fetchCreateTag = async (
  name: string
): Promise<TagCreateResponse> => {
  return handleReturnFetch(
    await fetch("/api/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        name,
      }),
    })
  );
};

export const fetchAddrticleTag = async ({
  clip_id,
  tag_id,
}: AddArticleTagRequest): Promise<AddArticleTagResponse> => {
  return handleReturnFetch(
    await fetch(`/api/tags/clip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        clip_id,
        tag_id,
      }),
    })
  );
};

export const fetchCreateUser = async (
  name: string
): Promise<{ status: string; data: User }> => {
  return handleReturnFetch(
    await fetch(`/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({
        name,
      }),
    })
  );
};

export const fetchClipTags = async (
  clipId: string
): Promise<{ status: string; data: Tag[] }> => {
  return handleReturnFetch(
    await fetch(`/api/tags/clip/${clipId}`, {
      headers: {
        Authorization: getToken(),
      },
    })
  );
};
