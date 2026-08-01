// app/services/articles.server.ts

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

  // Important for Cloudflare Workers
  pb.autoCancellation(false);

  return pb;
}

export async function getArticles(
  feedName?: string,
): Promise<Article[]> {
  const pb = createPocketBase();

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

  return result.items.map((article) => ({
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
}