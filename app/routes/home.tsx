import type { Route } from "./+types/home";
import { NewsCarousel } from "~/views/news-carousel/newsCarousel";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { getArticles } from "~/services/articles.server";
import { RiArrowRightLine } from "@remixicon/react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SelfNews" },
    {
      name: "description",
      content:
        "Fetch the news that YOU want to see",
    },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const env = process.env as {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };

  const result = await getArticles(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY
  );

  return {
    articles: result.articles.slice(0, 8),
  };
}

export default function Home({
  loaderData,
}: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10 py-8 sm:py-12">
        {/* Hero */}
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Badge variant="outline">
            Based on DRTV RSS Feed
          </Badge>

          <h1 className="text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
            Fetch the news that YOU want to see
          </h1>

          <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
            Freedom to select the news that you find
            relevant
          </p>

          <Button size="lg" render={<Link to="/content" />}>
            Read the news
            <RiArrowRightLine data-icon="inline-end" />
          </Button>
        </section>

        {/* Latest news preview */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-sm font-semibold tracking-widest uppercase">
              Latest news
            </h2>

            <Link
              to="/content"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              View all
              <RiArrowRightLine className="size-3" />
            </Link>
          </div>

          <NewsCarousel articles={articles} />
        </section>
      </div>
    </div>
  );
}
