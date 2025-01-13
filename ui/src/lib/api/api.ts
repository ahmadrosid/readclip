import { handleReturnFetch, getToken } from ".";

export type Article = {
  Id: string;
  Url: string;
  Title: string;
  Description: string;
  Content: string;
  CreatedAt: string;
  Hostname: string;
  Summary: string;
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

export type UpdateClipRequest = {
  id: string;
  title: string;
  content: string;
  token: string;
};

export type UpdateClipResponse = BaseResponse & {
  status: string;
  data: Article;
};

export const fetchAllArticles = async ({
  pageParam = 1,
  tagId = "",
  token,
}: {
  tagId?: string;
  pageParam?: number;
  token: string;
}): Promise<ArticleListResponse> => {
  let url = "/api/clips?page=" + pageParam;
  if (tagId !== "") {
    url += "&tag_id=" + tagId;
  }
  return handleReturnFetch(
    await fetch(url, {
      headers: {
        Authorization: token || getToken(),
      },
    })
  );
};

export const fetchDeleteClip = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`api/clips/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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

export const fetchLogin = async (): Promise<{ status: string; data: User }> => {
  return handleReturnFetch(
    await fetch(`/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchDeleteClipTagAndTag = async (
  tagId: string
): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`/api/tags/${tagId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchDeleteClipTag = async ({
  tagId,
  clipId,
}: {
  tagId: string;
  clipId: string;
}): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`/api/tags/clip/${tagId}/${clipId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchSummarizeClip = async (
  clipId: string
): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`/api/clips/summarize/${clipId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchDeleteUser = async (): Promise<{ status: string }> => {
  return handleReturnFetch(
    await fetch(`/api/users/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
  );
};

export const fetchExportClips = async (format: "json" | "csv") => {
  return fetch("/api/clips/export", {
    method: "POST",
    body: JSON.stringify({ format }),
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
  }).then((response) => {
    const contentType = response.headers.get("Content-Type");

    if (response.status === 204) {
      throw new Error("Error: You have no clips to export");
    } else if (response.status !== 200) {
      throw new Error("Error: " + response.statusText);
    }

    if (contentType?.includes("application/json")) {
      return response.json();
    } else {
      return response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        if (format === "json") {
          a.download = "clips.json";
        } else {
          a.download = "clips.csv";
        }

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    }
  });
};

export const fetchDownloadClip = async (clipId: string) => {
  return fetch(`/api/clips/${clipId}/download`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
  }).then((response) => {
    const filename = response.headers.get("Content-File-Name");
    if (!filename) {
      throw new Error("Error: Failed to download!");
    }

    if (response.status === 404) {
      throw new Error("Error: Clip not found!");
    } else if (response.status !== 200) {
      throw new Error("Error: " + response.statusText);
    }

    return response.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  });
};

export async function fetchUpdateClip({
  id,
  title,
  content,
  token,
}: UpdateClipRequest): Promise<UpdateClipResponse> {
  const response = await fetch(`/api/clips/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ title, content }),
  });
  return handleReturnFetch(response);
}
