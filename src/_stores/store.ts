import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MindettaState {
  appLoadingState: "loading" | "loaded";
  setAppLoadingState: (
    appLoadingState: MindettaState["appLoadingState"],
  ) => void;
  bears: number;
  increase: (by: number) => void;
}

const useMindettaState = create<MindettaState>()(
  devtools(
    persist(
      (set) => ({
        appLoadingState: "loaded",
        setAppLoadingState: (appLoadingState) => set({ appLoadingState }),
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: "bearStore" },
    ),
  ),
);

export default useMindettaState;
