export interface Card {
  id: string;
  title?: string;
  year: string;
  src?: string;
  width?: number;
  height?: number;
  slug: string;
  content: React.ComponentType;
}
