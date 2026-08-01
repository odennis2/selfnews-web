export interface Article {
  title: string;
  link: string;
  pubDate?: string;
  creator?: string;
  contentSnippet?: string;
  categories?: string[];
  imageUrl?: string;
}