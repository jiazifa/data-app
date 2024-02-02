import { getDB } from "./db";
import { v4 as uuidv4 } from "uuid";

export type CreateUserReq = {
  userName: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  image?: string;
};

export async function addUser(req: CreateUserReq) {
  const createdAt = new Date();
  const updatedAt = new Date();
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");
  const user = await db.user.create({
    data: {
      userName: req.userName,
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

export async function getUserByIdentifier(identifier: string) {
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

export async function updateUserByIdentifier(req: UpdateUserReq) {
  const db = getDB();
  const res = await db.user.update({
    where: {
      identifier: req.identifier,
    },
    data: {
      userName: req.userName,
      phone: req.phone,
      email: req.email,
      gender: req.gender,
      birthday: req.birthday,
      image: req.image,
    },
  });
  return res;
}
