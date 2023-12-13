import { handleReturnFetch, getToken } from ".";
export interface UpdateUsernameResponse {
  data: Data;
  status: string;
}

export interface Data {
  ID: string;
  Name: string;
  Username: string;
  Email: string;
  FirebaseID: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

type RequestUpdateUsername = {
  username: string;
};

export const fetchUpdateUsername = async (
  data: RequestUpdateUsername
): Promise<UpdateUsernameResponse> => {
  return handleReturnFetch(
    await fetch("/api/user/update-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(data),
    })
  );
};
