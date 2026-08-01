import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Input } from "components/ui/input"

export function Hero() {
  return (
    <div>
      {/* Hero */}
      <main className="flex flex-col">
        <section className="bg-muted py-16 sm:py-20 lg:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
            <Badge variant="outline">Based on DR TV RSS feed</Badge>

            <h1 className="text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">
              Select news to only see the articles that you want to see
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg sm:text-xl">
              Test
            </p>

            <div className="border-1 border-gray-250 rounded-2xl flex w-full max-w-md items-center justify-around gap-3 p-2">
              <Input placeholder="Your email" />
              <Button variant="ghost" className="">
                Access data source
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
