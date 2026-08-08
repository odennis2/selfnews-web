import { createClient, createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import type { Article } from "~/model/article";

interface SupabaseArticle {
  id: string;
  title: string;
  link: string;
  content: string | null;
  imageUrl: string | null;
  feedName: string | null;
  pubDate: string;
  created_at: string;
}

export async function getArticles(
  supabaseUrl: string,
  supabaseAnonKey: string,
  feedName?: string
): Promise<{
  articles: Article[];
  unavailable: boolean;
}> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    let query = supabase
      .from("articles")
      .select("*");

    if (feedName) {
      query = query.eq("feedName", feedName);
    }

    const { data, error } = await query
      .order("pubDate", { ascending: false })
      .limit(30);

    if (error) throw error;

    const articles = (data as SupabaseArticle[]).map((article) => ({
      title: article.title || "Untitled",
      link: article.link,
      pubDate: article.pubDate,
      creator: article.feedName || "Unknown",
      contentSnippet: article.content ? article.content.slice(0, 200) : "",
      categories: article.feedName ? [article.feedName] : [],
      imageUrl: article.imageUrl || "",
    }));

    return { articles, unavailable: false };
  } catch (error: any) {
    console.error("Failed to fetch articles from Supabase:", error);
    // TEMPORARY DEBUGGING: Return the error message
    return { 
      articles: [],
      unavailable: true,
    };
  }
}