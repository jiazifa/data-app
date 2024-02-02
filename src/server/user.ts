import { Gender, PageResponse, PageRequest, User } from "@/types/models";
import useSWR from "swr";
import { POSTFetcher } from "./global/api";

export interface CreateUserOptions {
  name: string;
  gender: Gender;
  email?: string;
  phone?: string;
}
// create user
const createUser = async (user: CreateUserOptions): Promise<User> => {
  return POSTFetcher("/api/user/add", { ...user });
};

export interface GetUserOptions {
  identifiers?: string[];
  page?: PageRequest;
}

// get user
const query_user_by_options = async (
  option?: GetUserOptions
): Promise<PageResponse<User>> => {
  return await POSTFetcher("/api/backend/user/query", {
    payload: option ?? {},
  });
};

const getUserByIdentifier = async (uid: string): Promise<User> => {
  return (await query_user_by_options({ identifiers: [uid] })).data[0];
};

export interface UpdateUserOptions {
  identifier: string;
  email?: string;
}

// update user
const updateUser = async (user: UpdateUserOptions): Promise<User> => {
  return await POSTFetcher("api/backend/user/update", { payload: user });
};

export interface GetUserIsExistsPayload {
  name?: string;
  phone?: string;
}

const user_fetcher = async (option?: GetUserOptions, page?: PageRequest) => {
  option = { page: page, ...option };
  return query_user_by_options(option);
};

const useUserList = (option?: GetUserOptions, page?: PageRequest) => {
  const params = new URLSearchParams();
  if (option) {
    params.append("option", JSON.stringify(option));
  }
  if (page) {
    params.append("page", JSON.stringify(page));
  }
  return useSWR(`user-list?${params.toString()}`, () =>
    user_fetcher(option, page)
  );
};

export {
  createUser,
  query_user_by_options,
  getUserByIdentifier,
  updateUser,
  useUserList,
};
