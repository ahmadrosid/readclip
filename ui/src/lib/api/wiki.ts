import { handleReturnFetch, getToken } from ".";

type CreateWikiResponse = {
  ID: string;
  UserID: string;
  Title: string;
  Description: string;
  Sidebar: {
    sections: string[][];
    sidebars: {
      label: string;
      slug: string;
    }[];
  };
};

type RequestCreateWiki = {
  title: string;
  description: string;
  sidebar: {
    sections: string[][];
    sidebars: {
      label: string;
      slug: string;
    }[];
  };
};

export const fetchCreateWiki = async (
    data: RequestCreateWiki
  ): Promise<CreateWikiResponse> => {
    return handleReturnFetch(
      await fetch("/api/wikis/create", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
        body: JSON.stringify(data),
      })
    );
  };
  

export const fetchWikiCurrentUser = async (
    token: string
  ): Promise<CreateWikiResponse> => {
    return handleReturnFetch(
      await fetch("/api/wikis/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
    );
  };
  