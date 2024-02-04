export enum Gender {
  UNKNOWN = "unknown",
  MALE = "male",
  FEMALE = "female",
}

export interface User {
  id: number;
  identifier: string;
  userName?: string;
  gender: Gender;
  email?: string;
  phone?: string;
}
