import ContentCard from "~/views/content-card/contentCard";
import { getArticles } from "~/services/articles.server";
import {
  mainFeeds,
  regionalFeeds,
} from "~/constants/feeds";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";

import { useSearchParams } from "react-router";
import type { Route } from "./+types/content";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const feed = url.searchParams.get("feed");

  return getArticles(
    feed && feed !== "all"
      ? feed
      : undefined,
  );
}

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  console.error(error);

  return (
    <div className="flex min-h-100 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Noget gik galt
        </h1>

        <p className="mt-2 text-muted-foreground">
          Vi kunne ikke indlæse nyhederne.
          Prøv at genindlæse siden.
        </p>
      </div>
    </div>
  );
}

export default function Content({
  loaderData,
}: Route.ComponentProps) {
  const {
    articles,
    selectedFeed,
  } = loaderData;

  const [, setSearchParams] = useSearchParams();

  function selectFeed(feed: string) {
    if (feed === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      feed,
    });
  }

  return (
    <div className="space-y-6 p-6">

      {/* Feed navigation */}
      <div className="w-full overflow-x-auto">
        <nav className="flex w-max min-w-full items-center gap-2 border-b pb-2 justify-center">

          {/* All */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectFeed("all")}
            className={cn(
              "shrink-0 rounded-full",
              !selectedFeed &&
                "bg-accent text-accent-foreground",
            )}
          >
            Alle
          </Button>

          {/* Main feeds */}
          {mainFeeds.map((feed) => (
            <Button
              key={feed}
              variant="ghost"
              size="sm"
              onClick={() => selectFeed(feed)}
              className={cn(
                "shrink-0 rounded-full",
                selectedFeed === feed &&
                  "bg-accent text-accent-foreground",
              )}
            >
              {feed}
            </Button>
          ))}

        {/* Regional feeds */}
          {regionalFeeds.map((feed) => (
            <Button
              key={feed}
              variant="ghost"
              size="sm"
              onClick={() => selectFeed(feed)}
              className={cn(
                "shrink-0 rounded-full",
                selectedFeed === feed &&
                  "bg-accent text-accent-foreground",
              )}
            >
              {feed}
            </Button>
          ))}

        </nav>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ContentCard
            key={article.link}
            title={article.title}
            description={
              article.contentSnippet ?? ""
            }
            imageUrl={
              article.imageUrl ??
              "https://avatar.vercel.sh/placeholder"
            }
            link={article.link}
            badge={article.categories?.[0]}
          />
        ))}
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          Ingen artikler fundet.
        </div>
      )}
    </div>
  );
}