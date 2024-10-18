import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MindettaState {
  appLoadingState: "loading" | "loaded";
  videosSortOrder: "asc" | "desc";
  videosSortBy: "publishedAt" | "ingestedAt";
  videosSortCount: string;
  setVideosSortOrder: (
    videosSortOrder: MindettaState["videosSortOrder"],
  ) => void;
  setVideosSortBy: (videosSortBy: MindettaState["videosSortBy"]) => void;
  setVideosSortCount: (
    videosSortCount: MindettaState["videosSortCount"],
  ) => void;
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
        videosSortOrder: "desc",
        videosSortBy: "publishedAt",
        videosSortCount: "25",
        setVideosSortCount: (videosSortCount) => set({ videosSortCount }),
        setVideosSortOrder: (videosSortOrder) => set({ videosSortOrder }),
        setVideosSortBy: (videosSortBy) => set({ videosSortBy }),
        setAppLoadingState: (appLoadingState) => set({ appLoadingState }),
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: "bearStore" },
    ),
  ),
);

export default useMindettaState;
