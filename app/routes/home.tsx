import { env } from "cloudflare:workers";
import type { Route } from "./+types/home";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SelfNews" },
    { name: "description", content: "Welcome to SelfNews" },
  ];
}

export function loader() {
  return { message: env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <main className="flex flex-col">
        <section className="sm:py-20 lg:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
            <Badge variant="outline">Based on DRTV RSS Feed</Badge>

            <h1 className="text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
              Fetch the news that YOU want to see
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
              Freedom to select the news that you find relevant
            </p>

            <div className="flex w-full max-w-md items-center gap-3 pt-2">
              <Input placeholder="Your email" type="email" />
              <Button variant="ghost" className="shrink-0">
                Contact
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
