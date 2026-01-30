import { create } from "zustand";

import type { CollectionType } from "@/lib/constants";

interface CardStore {
  selectedCardId: string;
  collection: CollectionType;
  isZoomed: boolean;
  zoomEnabled: boolean;
  toggleZoomed: () => void;
  setZoomed: (zoomed: boolean) => void;
  setSelectedCardId: (selectedCardId: string) => void;
  setZoomEnabled: (zoomEnabled: boolean) => void;
  setCollection: (collection: CollectionType) => void;
  reset: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  selectedCardId: "",
  collection: "prototypes" as CollectionType,
  isZoomed: false,
  zoomEnabled: false,
  toggleZoomed: (force?: boolean) => {
    set((state) => ({
      isZoomed: force !== undefined ? force : !state.isZoomed,
    }));
  },
  setZoomed: (zoomed: boolean) => set({ isZoomed: zoomed }),
  setSelectedCardId: (selectedCardId: string) => set({ selectedCardId }),
  setZoomEnabled: (zoomEnabled: boolean) => set({ zoomEnabled }),
  setCollection: (collection: CollectionType) => {
    set({ collection, selectedCardId: "" });
  },
  reset: () => set({ isZoomed: false, zoomEnabled: false, selectedCardId: "" }),
}));
