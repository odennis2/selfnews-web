import { cn } from "lib/utils";
import { wireStamp } from "~/utils/wire";

/**
 * The product's own picture: a row of the live wire.
 * Time in the accent on its fixed column, headline in full ink.
 */
export interface WireRowProps {
  title: string;
  link: string;
  pubDate?: string;
  className?: string;
}

export function WireRow({ title, link, pubDate, className }: WireRowProps) {
  const stamp = wireStamp(pubDate);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group grid grid-cols-[64px_1fr] items-baseline gap-x-4 py-3",
        className,
      )}
    >
      <time
        className="text-primary text-[13px] font-medium tabular-nums"
        dateTime={pubDate}
      >
        {stamp ?? "—"}
      </time>

      <span className="group-hover:text-primary transition-colors leading-snug text-balance">
        {title}
      </span>
    </a>
  );
}
