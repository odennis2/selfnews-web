import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { createClient as createSupabaseServerClient } from "~/utils/supabase.server";
import type { Article } from "~/model/article";

export interface SupabaseArticle {
  id?: string | number;
  title: string;
  link: string;
  content: string | null;
  imageUrl: string | null;
  feedName: string | null;
  pubDate: string | null;
}

function getSupabaseClient(request?: Request) {
  if (request) {
    return createSupabaseServerClient(request).supabase;
  }

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or Key in environment configuration.");
  }

  return createSupabaseJsClient(supabaseUrl, supabaseKey);
}

export async function getArticles(
  feedName?: string,
  request?: Request
): Promise<{
  articles: Article[];
  unavailable: boolean;
}> {
  try {
    const supabase = getSupabaseClient(request);

    let query = supabase
      .from("articles")
      .select("title, link, pubDate, feedName, content, imageUrl")
      .order("pubDate", { ascending: false })
      .limit(30);

    if (feedName) {
      query = query.eq("feedName", feedName);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const articles: Article[] = ((data as SupabaseArticle[]) || []).map(
      (article) => ({
        title: article.title,
        link: article.link,
        pubDate: article.pubDate ?? undefined,
        creator: article.feedName ?? undefined,
        contentSnippet: article.content
          ? article.content.slice(0, 200)
          : "",
        categories: article.feedName ? [article.feedName] : [],
        imageUrl: article.imageUrl ?? undefined,
      })
    );

    return {
      articles,
      unavailable: false,
    };
  } catch (error) {
    console.error("Failed to fetch articles from Supabase:", error);

    return {
      articles: [],
      unavailable: true,
    };
  }
}