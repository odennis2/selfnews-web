import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { cn } from "lib/utils";

export interface ContentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
  badge?: string;
}

export default function ContentCard({
  title,
  description,
  imageUrl,
  link,
  badge,
}: ContentCardProps) {
  return (
    <Card className="h-full pt-0">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="bg-muted flex aspect-video w-full items-center justify-center">
            <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              SelfNews
            </span>
          </div>
        )}
      </a>

      <CardHeader className="flex-1">
        {badge && (
          <CardAction>
            <Badge variant="secondary">{badge}</Badge>
          </CardAction>
        )}
        <CardTitle>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {title}
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          render={
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          View Article
        </Button>
      </CardFooter>
    </Card>
  );
}
