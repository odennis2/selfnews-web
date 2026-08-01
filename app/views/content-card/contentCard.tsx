// app/views/content-card/content-card.tsx
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
import { NavLink } from "react-router";

export interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
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
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={imageUrl}
        alt={title}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        {badge && (
          <CardAction>
            <Badge variant="secondary">{badge}</Badge>
          </CardAction>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <NavLink to={link} target="_blank" rel="noopener noreferrer">
            <Button variant="Ghost" className="w-full" asChild>
                View Article
            </Button> 
        </NavLink>
      </CardFooter>
    </Card>
  );
}