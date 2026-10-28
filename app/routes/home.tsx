import type { Route } from "./+types/home";
import { WireRow } from "~/views/wire/wireRow";
import { CrossfadeImage } from "~/views/wire/crossfadeImage";
import { Button } from "components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import { Link } from "react-router";
import { getArticles } from "~/services/articles.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SelfNews" },    {
      name: "description",
      content:
        "Vælg selv de nyhedssektioner, du vil følge. Bygget på DRs live-nyhedstråd.",
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

  // Hero picture: the stories that carry a photograph, one per image.
  const pictures = Array.from(
    new Map(
      result.articles
        .filter((a) => a.imageUrl)
        .slice(0, 12)
        .map((a) => [a.imageUrl, { src: a.imageUrl!, alt: a.title }]),
    ).values(),
  ).slice(0, 4);

  // The wire: the freshest headlines with timestamps.
  const wire = result.articles.slice(0, 6);

  return { pictures, wire, total: result.articles.length };
}

export default function Home({
  loaderData,
}: Route.ComponentProps) {
  const { pictures, wire, total } = loaderData;
  const lead = wire[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Hero: the printed card beside the wire */}
      <section className="grid gap-3 lg:grid-cols-2">
        {/* The card */}
        <div className="reveal bg-background flex flex-col justify-between border p-6 sm:p-10 lg:min-h-[560px] [--reveal-order:0]">
          <div className="wire-stripe" aria-hidden>
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="py-8 sm:py-12 lg:py-16">
            <h1 className="max-w-[24ch] text-[32px] font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl">
              Vælg de nyheder som du selv vil se
            </h1>

            <p className="text-muted-foreground mt-6 max-w-[38ch] text-lg leading-relaxed">
              Vælg selv mellem {total} aktuelle nyheder fra DRs
              live-tråd, og følg kun de sektioner, du finder
              relevante.
            </p>

            <Button size="lg" className="mt-8" render={<Link to="/content" />}>
              Læs nyhederne
              <RiArrowRightLine data-icon="inline-end" />
            </Button>
          </div>

          <p className="text-muted-foreground text-[13px]">
            Seneste opdatering:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {wire[0] ? "I dag" : "—"}
            </span>
          </p>
        </div>

        {/* The wire: the product's own picture, full height */}
        <div className="reveal flex flex-col gap-3 [--reveal-order:1]">
          {pictures.length > 0 && (
            <figure className="relative min-h-0 flex-1">
              <CrossfadeImage
                sources={pictures}
                className="h-full min-h-[320px] w-full lg:absolute lg:inset-0"
              />
              {lead && (
                <figcaption className="sr-only">{lead.title}</figcaption>
              )}
            </figure>
          )}

          <div
            className="bg-background border"
            data-ui
          >
            <p className="text-muted-foreground border-b px-4 py-3 text-[13px] sm:px-6">
              Sidst fra tråden
            </p>

            <div className="divide-y">
              {wire.map((article) => (
                <WireRow
                  key={article.link}
                  title={article.title}
                  link={article.link}
                  pubDate={article.pubDate}
                  className="px-4 sm:px-6"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
