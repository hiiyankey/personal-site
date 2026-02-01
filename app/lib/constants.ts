export const baseCollections = {
  prototypes: {
    cards: [
      {
        year: "1959-03-06",
        title: "Line Graph",
        width: 280,
      },
      {
        year: "1959-03-06",
        title: "Minimap",
        width: 240,
        height: 180,
      },
      {
        year: "1959-03-06",
        title: "Motion Blur",
        width: 240,
      },
      {
        year: "1959-03-06",
        title: "Elastic Slider",
        width: 270,
        height: 150,
      },
      {
        year: "1959-03-06",
        title: "Test Image",
        src: "/test-image.jpg",
        width: 320,
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
