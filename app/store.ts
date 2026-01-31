import { create } from "zustand";

import type { CollectionType } from "@/lib/constants";

interface CardStore {
  selectedCardId: string;
  collection: CollectionType;
  setSelectedCardId: (selectedCardId: string) => void;
  setCollection: (collection: CollectionType) => void;
  reset: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  selectedCardId: "",
  collection: "prototypes" as CollectionType,
  setSelectedCardId: (selectedCardId: string) => set({ selectedCardId }),
  setCollection: (collection: CollectionType) => {
    set({ collection, selectedCardId: "" });
  },
  reset: () => set({ selectedCardId: "" }),
}));
