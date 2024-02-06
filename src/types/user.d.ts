export enum Gender {
  UNKNOWN = "unknown",
  MALE = "male",
  FEMALE = "female",
}

export interface User {
  id: number;
  identifier: string;
  user_name?: string;
  gender: Gender;
  email?: string;
  phone?: string;
}
