import ContentCard from "~/views/content-card/contentCard";
import { Skeleton } from "components/ui/skeleton";
import { Button } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { cn } from "lib/utils";
import { RiRefreshLine } from "@remixicon/react";

import {
  mainFeeds,
  regionalFeeds,
} from "~/constants/feeds";
import { getArticles } from "~/services/articles.server";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import type { Route } from "./+types/content";

export async function loader({ request }: Route.LoaderArgs) {
  const env = process.env as {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  };

  const url = new URL(request.url);
  const feed = url.searchParams.get("feed");
  const selectedFeed =
    feed && feed !== "all" ? feed : undefined;

  const result = await getArticles(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    selectedFeed
  );

  return {
    ...result,
    selectedFeed,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Content — SelfNews" },
    {
      name: "description",
      content: "Browse the latest news picked for you",
    },
  ];
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
          Vi kunne ikke indlæse nyhederne. Prøv at
          genindlæse siden.
        </p>
      </div>
    </div>
  );
}

const REGIONAL_VALUE = "__regional__";

export default function Content() {
  const { articles, unavailable, selectedFeed } =
    useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === "/content";

  const isRegionalSelected =
    selectedFeed !== undefined &&
    (regionalFeeds as readonly string[]).includes(
      selectedFeed
    );

  const selectedRegionalFeed = isRegionalSelected
    ? selectedFeed
    : REGIONAL_VALUE;

  function selectFeed(feed: string) {
    if (feed === "all") {
      setSearchParams({}, { preventScrollReset: false });
      return;
    }

    setSearchParams({ feed });
  }

  function selectRegionalFeed(
    feed: string | null
  ) {
    if (!feed || feed === REGIONAL_VALUE)
      return;
    selectFeed(feed);
  }

  if (unavailable) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-2xl py-24 text-center">
          <h1 className="text-2xl font-bold">
            Nyhederne er ikke tilgængelige
          </h1>

          <p className="text-muted-foreground mt-2">
            Vi kunne ikke hente artiklerne lige nu.
            Prøv igen om lidt.
          </p>

          <Button
            variant="outline"
            className="mt-6"
            render={<a href="/content" />}
          >
            <RiRefreshLine data-icon="inline-start" />
            Prøv igen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-wider uppercase sm:text-3xl">
            Content
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isLoading
              ? "Henter artikler…"
              : `${articles.length} artikler${
                  selectedFeed
                    ? ` i ${selectedFeed}`
                    : " fra alle kilder"
                }`}
          </p>
        </div>

        {/* Feed navigation */}
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Vælg nyhedsfeed"
            className="flex flex-1 flex-wrap items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectFeed("all")}
              aria-pressed={!selectedFeed}
              className={cn(
                "rounded-full",
                !selectedFeed &&
                  "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
                isLoading && "opacity-60"
              )}
            >
              Alle
            </Button>

            {mainFeeds.map((feed) => (
              <Button
                key={feed}
                variant="outline"
                size="sm"
                onClick={() => selectFeed(feed)}
                aria-pressed={selectedFeed === feed}
                className={cn(
                  "rounded-full",
                  selectedFeed === feed &&
                    "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
                  isLoading && "opacity-60"
                )}
              >
                {feed}
              </Button>
            ))}
          </nav>

          {/* Regional feeds dropdown */}
          <Select
            value={selectedRegionalFeed}
            onValueChange={selectRegionalFeed}
          >
            <SelectTrigger
              size="sm"
              aria-label="Regionale nyhedsfeeds"
              className={cn(
                "rounded-full border px-3",
                isRegionalSelected &&
                  "border-primary text-primary",
                isLoading && "opacity-60"
              )}
            >
              <SelectValue placeholder="Regionale" />
            </SelectTrigger>

            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Regionale</SelectLabel>

                {regionalFeeds.map((feed) => (
                  <SelectItem key={feed} value={feed}>
                    {feed}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Article grid / loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-card space-y-4 p-0 shadow-sm ring-1 ring-foreground/5"
              >
                <Skeleton className="aspect-video w-full rounded-none" />

                <div className="space-y-2.5 px-6 pb-6">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ContentCard
                key={article.link}
                title={article.title}
                description={
                  article.contentSnippet ?? ""
                }
                imageUrl={article.imageUrl}
                link={article.link}
                badge={article.categories?.[0]}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-24 text-center">
            <p className="text-lg font-semibold">
              Ingen artikler fundet
            </p>

            <p className="text-muted-foreground mt-1 text-sm">
              Der er endnu ingen artikler i dette
              feed.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => selectFeed("all")}
            >
              Se alle nyheder
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
