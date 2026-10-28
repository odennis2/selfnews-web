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

import { mainFeeds, regionalFeeds } from "~/constants/feeds";
import { getArticles } from "~/services/articles.server";
import { wireStamp } from "~/utils/wire";
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
  const selectedFeed = feed && feed !== "all" ? feed : undefined;

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
      content: "Vælg sektion og læs de nyeste artikler fra DRs live-tråd.",
    },
  ];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error(error);

  return (
    <div className="flex min-h-100 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Noget gik galt</h1>

        <p className="text-muted-foreground mt-2">
          Vi kunne ikke indlæse nyhederne. Prøv at genindlæse siden.
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
  const [searchParams, setSearchParams] = useSearchParams();

  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === "/content";

  const isRegionalSelected =
    selectedFeed !== undefined &&
    (regionalFeeds as readonly string[]).includes(selectedFeed);

  const selectedRegionalFeed = isRegionalSelected
    ? selectedFeed
    : REGIONAL_VALUE;

  function selectFeed(feed: string) {
    setSearchParams(
      feed === "all" ? {} : { feed },
      { preventScrollReset: true },
    );
  }

  function selectRegionalFeed(feed: string | null) {
    if (!feed || feed === REGIONAL_VALUE) return;
    selectFeed(feed);
  }

  if (unavailable) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="max-w-md py-24">
          <h1 className="text-2xl font-semibold">
            Tråden kunne ikke hentes
          </h1>

          <p className="text-muted-foreground mt-2 leading-relaxed">
            Artiklerne kunne ikke hentes. Prøv igen om lidt.
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
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Title row: the screen's one question, answer beside it */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>

        <p
          className={cn(
            "text-[13px] text-muted-foreground tabular-nums",
            isLoading && "opacity-60",
          )}
        >
          {isLoading
            ? "Henter …"
            : `${articles.length} artikler${selectedFeed ? ` i ${selectedFeed}` : ""}`}
        </p>
      </div>

      {/* Section rail + list */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Rail: the reader's own tabs */}
        <nav
          aria-label="Nyhedssektioner"
          className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectFeed("all")}
            aria-pressed={!selectedFeed}
            className={cn(
              "shrink-0 justify-start lg:w-full",
              !selectedFeed && "bg-foreground text-background hover:bg-foreground hover:text-background",
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
                "shrink-0 justify-start lg:w-full",
                selectedFeed === feed &&
                  "bg-foreground text-background hover:bg-foreground hover:text-background",
              )}
            >
              {feed}
            </Button>
          ))}

          {/* Regional feeds fold into the rail */}
          <Select
            value={selectedRegionalFeed}
            onValueChange={selectRegionalFeed}
          >
            <SelectTrigger
              size="sm"
              aria-label="Regionale nyhedssektioner"
              className={cn(
                "mt-1 w-fit shrink-0 border px-4 lg:w-full",
                isRegionalSelected &&
                  "border-foreground text-foreground",
              )}
            >
              <SelectValue placeholder="Regionale" />
            </SelectTrigger>

            <SelectContent align="start">
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
        </nav>

        {/* The list: alternating tone bands, time on its fixed column */}
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-background flex items-center gap-4 p-5"
              >
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <ul className="space-y-1">
            {articles.map((article, index) => {
              const stamp = wireStamp(article.pubDate);

              return (
                <li key={article.link}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group grid grid-cols-[56px_1fr_auto] items-baseline gap-x-4 p-5 sm:grid-cols-[64px_1fr_auto]",
                      index % 2 === 0
                        ? "bg-background"
                        : "bg-background/60",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    <time
                      className="text-primary text-[13px] font-medium tabular-nums"
                      dateTime={article.pubDate}
                    >
                      {stamp ?? "—"}
                    </time>

                    <span className="min-w-0">
                      <span className="group-hover:text-primary transition-colors block truncate leading-snug sm:whitespace-normal">
                        {article.title}
                      </span>

                      {article.contentSnippet && (
                        <span className="text-muted-foreground mt-1 hidden truncate text-[13px] leading-relaxed sm:block">
                          {article.contentSnippet}
                        </span>
                      )}
                    </span>

                    {article.categories?.[0] && (
                      <span className="text-muted-foreground hidden shrink-0 text-[13px] md:block">
                        {article.categories[0]}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          /* Empty state keeps its frame */
          <div className="bg-background p-10 text-center">
            <p className="font-medium">Ingen artikler i denne sektion</p>

            <p className="text-muted-foreground mt-1 text-[13px]">
              Tråden har ikke slået noget op endnu.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-5"
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
