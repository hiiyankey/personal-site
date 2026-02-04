import { ElasticSlider } from "@/ui/prototypes/elastic-slider";

export const baseCollections = {
  prototypes: {
    cards: [
      {
        year: "1959-03-06",
        title: "Line Graph",
        src: "/run4.mp4",
        width: 280,
      },
      {
        year: "1959-03-06",
        title: "Minimap",
        src: "/exclusion-tabs-dark.mp4",
        width: 240,
        height: 180,
      },
      {
        year: "1959-03-06",
        title: "Motion Blur",
        src: "/wheel.mp4",
        width: 290,
        height: 170,
      },
      {
        year: "2026-02-02",
        title: "Elastic Slider",
        src: "/adaptive-precision-5.mp4",
        width: 240,
        content: ElasticSlider,
      },
    ],
  },

  essays: {
    cards: [],
  },
};

export const collections = Object.fromEntries(
  Object.entries(baseCollections).map(([key, value]) => [
    key,
    {
      ...value,
      cards: value.cards.map((card: any, index) => ({
        ...card,
        id: card.id || `${key}-${index}`,
        slug: card.title.toLowerCase().split(" ").join("-"),
      })),
    },
  ])
);

export type CollectionType = keyof typeof baseCollections;

export const collectionTypes = Object.keys(collections) as CollectionType[];

export const cards = Object.values(collections).flatMap(
  (collection) => collection.cards
);
