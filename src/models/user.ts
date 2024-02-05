import { User } from "@prisma/client";
import { getDB } from "./db";
import { v4 as uuidv4 } from "uuid";
import { PageRequest, PageResponse, sql_page_option } from "@/types";

export type CreateUserReq = {
  name: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  image?: string;
};

export async function addUser(req: CreateUserReq): Promise<User> {
  const createdAt = new Date();
  const updatedAt = new Date();
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");
  const user = await db.user.create({
    data: {
      userName: req.name,
      identifier: simplifiedUuid,
      phone: req.phone,
      email: req.email,
      gender: req.gender,
      birthday: req.birthday,
      image: req.image,
      createdAt,
      updatedAt,
    },
  });
  return user;
}

export async function getUserByIdentifier(
  identifier: string
): Promise<User | null> {
  const db = getDB();
  const res = await db.user.findUnique({
    where: {
      identifier,
    },
  });
  return res;
}

export interface UpdateUserReq extends CreateUserReq {
  identifier: string;
}

export async function updateUserByIdentifier(
  req: UpdateUserReq
): Promise<User> {
  const db = getDB();
  const res = await db.user.update({
    where: {
      identifier: req.identifier,
    },
    data: {
      userName: req.name,
      phone: req.phone,
      email: req.email,
      gender: req.gender,
      birthday: req.birthday,
      image: req.image,
    },
  });
  return res;
}

export type QueryUserOptions = {
  identifiers?: string[];
  page: PageRequest;
};

export async function queryUserByOptions(
  option: QueryUserOptions
): Promise<PageResponse<User>> {
  const db = getDB();
  const page = sql_page_option(option.page);
  const res = await db.user.findMany({
    where: option?.identifiers && {
      identifier: {
        in: option?.identifiers ?? [],
      },
    },
    ...page,
  });
  const count = await db.user.count({
    where: option?.identifiers && {
      identifier: {
        in: option?.identifiers ?? [],
      },
    },
  });
  return {
    data: res,
    total_page: Math.floor(count / option.page.pageSize),
    cur_page: option.page.page,
    page_size: option.page.pageSize,
  };
}

export async function removeUserByIdentifier(
  identifiers: string[]
): Promise<number> {
  const db = getDB();
  const res = await db.user.deleteMany({
    where: {
      identifier: {
        in: identifiers,
      },
    },
  });
  return res.count;
}
