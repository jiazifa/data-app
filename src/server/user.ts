import { Gender, PageResponse, PageRequest, User } from "@/types";
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
  return POSTFetcher("/api/user/add", { payload: user });
};

export interface GetUserOptions {
  identifiers?: string[];
  page: PageRequest;
}

// get user
const query_user_by_options = async (
  option: GetUserOptions
): Promise<PageResponse<User>> => {
  return await POSTFetcher("/api/user/query", { payload: option });
};

const getUserByIdentifier = async (uid: string): Promise<User> => {
  return (
    await query_user_by_options({
      identifiers: [uid],
      page: { page: 1, pageSize: 1 },
    })
  ).data[0];
};

export interface UpdateUserOptions {
  identifier: string;
  email?: string;
}

// update user
const updateUser = async (user: UpdateUserOptions): Promise<User> => {
  return await POSTFetcher("/api/user/update", { payload: user });
};

export interface GetUserIsExistsPayload {
  name?: string;
  phone?: string;
}

const user_fetcher = async (option: GetUserOptions) => {
  return query_user_by_options(option);
};

const useUserList = (option: GetUserOptions) => {
  const params = new URLSearchParams();
  if (option) {
    params.append("option", JSON.stringify(option));
  }
  return useSWR<PageResponse<User>>(`user-list?${params.toString()}`, () =>
    user_fetcher(option)
  );
};

export {
  createUser,
  query_user_by_options,
  getUserByIdentifier,
  updateUser,
  useUserList,
};
