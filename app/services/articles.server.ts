import PocketBase from "pocketbase";
import type { Article } from "~/model/article";

interface PocketBaseArticle {
  id: string;
  title: string;
  link: string;
  content: string;
  imageUrl: string;
  feedName: string;
  pubDate: string;
  created: string;
  updated: string;
}

function createPocketBase() {
  const pb = new PocketBase(
    process.env.POCKETBASE_URL ?? "http://127.0.0.1:8090",
  );

  pb.autoCancellation(false);

  return pb;
}

export async function getArticles(feedName?: string): Promise<{
  articles: Article[];
  unavailable: boolean;
}> {
  const pb = createPocketBase();

  try {
    const result = await pb
      .collection("articles")
      .getList<PocketBaseArticle>(1, 30, {
        sort: "-pubDate",
        ...(feedName
          ? {
              filter: `feedName = "${feedName}"`,
            }
          : {}),
      });

    const articles = result.items.map((article) => ({
      title: article.title,
      link: article.link,
      pubDate: article.pubDate,
      creator: article.feedName,
      contentSnippet: article.content
        ? article.content.slice(0, 200)
        : "",
      categories: article.feedName
        ? [article.feedName]
        : [],
      imageUrl: article.imageUrl,
    }));

    return {
      articles,
      unavailable: false,
    };
  } catch (error) {
    console.error("Failed to fetch articles from PocketBase:", error);

    return {
      articles: [],
      unavailable: true,
    };
  }
}