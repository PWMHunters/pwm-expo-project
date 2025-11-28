import { headerJson, headerRevocableSession, instance, xParseSessionTokenKey } from "./config";

export interface UserData {
  objectId?: string;
  sessionToken?: string;
  createdAt?: string;

  username: string;
  email: string;
  password: string;
}

export const userService = {
  signUp,
  login,
  getCurrentUser,
  updateUser,
  deleteUser,
  logout,
};

export async function signUp(user: UserData): Promise<UserData> {
  const response = await instance.post(
    "/users",
    user,
    { headers: { ...headerJson, ...headerRevocableSession } }
  );
  return response.data;
}

export async function login({ username, password }: {
  username: string;
  password: string;
}): Promise<UserData> {
  const response = await instance.post(
    "/login",
    new URLSearchParams({ username, password }),
    { headers: headerRevocableSession }
  );

  return response.data;
}

export async function getCurrentUser(sessionToken: string): Promise<UserData | null> {
  try {
    const response = await instance.get("/users/me", {
      headers: {
        [xParseSessionTokenKey]: sessionToken,
      },
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function updateUser({
  sessionToken,
  ...data
}: Partial<UserData>): Promise<UserData> {
  if (!sessionToken) throw new Error("sessionToken é obrigatório");

  const response = await instance.put(
    `/users/me`,
    data,
    {
      headers: {
        ...headerJson,
        [xParseSessionTokenKey]: sessionToken,
      },
    }
  );

  return response.data;
}


export async function deleteUser(objectId: string, sessionToken: string) {
  const response = await instance.delete(`/users/${objectId}`, {
    headers: {
      [xParseSessionTokenKey]: sessionToken,
      ...headerRevocableSession,
    },
  });

  return response.data;
}

export async function logout(sessionToken: string) {
  const response = await instance.post(
    "/logout",
    {},
    {
      headers: {
        [xParseSessionTokenKey]: sessionToken,
      },
    }
  );

  return response.data;
}