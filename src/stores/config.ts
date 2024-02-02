import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfigStore {
  direction: "ltr" | "rtl";
  colorScheme: "light" | "dark";
  setDirection: (direction: "ltr" | "rtl") => void;
  setColorScheme: (colorScheme: "light" | "dark") => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      direction: "ltr",
      colorScheme: "light",
      setDirection: (direction: "ltr" | "rtl") => set({ direction }),
      setColorScheme: (colorScheme: "light" | "dark") => set({ colorScheme }),
    }),
    { name: "config-storage" }
  )
);
