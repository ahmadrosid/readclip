export const handleReturnFetch = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    if (res.status === 409) {
      throw new Error("User already exists");
    }
    if (res.status >= 400) {
      throw new Error(data.error);
    }

    throw new Error("Error: " + res.statusText);
  }
  return data;
};

export const getToken = () => {
  return window.localStorage.getItem("token") || "";
};
