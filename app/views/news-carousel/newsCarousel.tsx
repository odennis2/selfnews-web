import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "components/ui/carousel";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { useEffect, useState } from "react";
import type { Article } from "~/model/article";

export interface NewsCarouselProps {
  articles: Article[];
}

export function NewsCarousel({
  articles,
}: NewsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (articles.length === 0) {
    return (
      <div className="bg-card ring-foreground/5 flex aspect-video w-full items-center justify-center shadow-sm ring-1 sm:aspect-[21/9]">
        <span className="text-muted-foreground text-sm">
          Ingen nyheder at vise lige nu.
        </span>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      className="w-full"
      opts={{ loop: articles.length > 1 }}
    >
      <CarouselContent>
        {articles.map((article) => (
          <CarouselItem key={article.link}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <div className="relative overflow-hidden">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt=""
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-[21/9]"
                  />
                ) : (
                  <div className="bg-muted flex aspect-video w-full items-center justify-center sm:aspect-[21/9]">
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      SelfNews
                    </span>
                  </div>
                )}

                {/* Text overlay */}
                <div className="from-foreground/80 via-foreground/40 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-4 sm:p-6">
                  {article.categories?.[0] && (
                    <Badge className="text-primary-foreground/90 mb-2 block">
                      {article.categories[0]}
                    </Badge>
                  )}

                  <h3 className="text-primary-foreground max-w-3xl text-base leading-snug font-semibold text-balance drop-shadow-sm sm:text-xl">
                    {article.title}
                  </h3>
                </div>
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>

      {articles.length > 1 && (
        <>
          <CarouselPrevious className="-left-2 size-8 sm:-left-4" />
          <CarouselNext className="-right-2 size-8 sm:-right-4" />
        </>
      )}

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {articles.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Gå til nyhed ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "bg-border h-1.5 w-6 transition-colors",
              index === current &&
                "bg-primary"
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}
