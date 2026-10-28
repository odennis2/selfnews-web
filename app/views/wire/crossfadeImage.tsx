import { useEffect, useState } from "react";
import { cn } from "lib/utils";

export interface CrossfadeImageProps {
  sources: { src: string; alt: string }[];
  intervalMs?: number;
  className?: string;
}

/**
 * The direction's signature move: a photograph that quietly
 * changes to the next of the same framing. Pauses on hidden tab,
 * shows only the first image under reduced motion.
 */
export function CrossfadeImage({
  sources,
  intervalMs = 6000,
  className,
}: CrossfadeImageProps) {
  const [index, setIndex] = useState(0);

  const count = sources.length;

  useEffect(() => {
    if (count <= 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  if (count === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {sources.map((source, i) => (
        <img
          key={source.src}
          src={source.src}
          alt={i === 0 ? source.alt : ""}
          loading={i === 0 ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
