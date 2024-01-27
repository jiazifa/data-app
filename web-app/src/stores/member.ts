import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { User } from "@/types/models";

export interface MemberDataState {
  entities: {
    [key: string]: User;
  };
  mySelf: string;
}

export interface MemberStore {
  getMember: (idf: string) => Promise<User | undefined>;
  getMySelf: () => Promise<User | undefined>;
  addMember: (user: User) => void;
  setMySelf: (id: string) => void;
}

export const useMemberStore = create<MemberStore & MemberDataState>()(
  devtools(
    immer((set, get) => ({
      entities: {},
      mySelf: "",
      getMember: async (idf: string) => {
        return get().entities[idf];
      },
      getMySelf: async () => {
        return get().getMember(get().mySelf);
      },
      addMember: (user: User) => {
        set({ entities: { ...get().entities, [user.identifier]: user } });
      },
      setMySelf: (id: string) => {
        set({ mySelf: id });
      },
      // end
    }))
  )
);
