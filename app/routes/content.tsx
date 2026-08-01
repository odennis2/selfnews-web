
import type { Article } from "~/model/article";
import ContentCard from "~/views/content-card/contentCard";
import type { Route } from "./+types/content";



const mockArticles: Article[] = [
  {
    title: "Regeringen fremlægger ny plan for grøn omstilling",
    link: "https://www.dr.dk/nyheder/indland/mock-1",
    pubDate: "2026-08-01T08:15:00Z",
    creator: "DR Nyheder",
    contentSnippet:
      "Regeringen præsenterede i dag en ny klimaplan, der skal reducere udledningen med 30 procent inden 2030.",
    categories: ["Indland", "Politik"],
    imageUrl: "https://avatar.vercel.sh/mock1",
  },
  {
    title: "Storbrand i København under kontrol",
    link: "https://www.dr.dk/nyheder/indland/mock-2",
    pubDate: "2026-08-01T06:42:00Z",
    creator: "DR Nyheder",
    contentSnippet:
      "Brandvæsenet melder, at branden på et lager i Nordhavn nu er under kontrol efter flere timers indsats.",
    categories: ["Indland"],
    imageUrl: "https://avatar.vercel.sh/mock2",
  },
  {
    title: "Dansk landshold klar til EM-kvalifikation",
    link: "https://www.dr.dk/sporten/mock-3",
    pubDate: "2026-07-31T19:30:00Z",
    creator: "DR Sporten",
    contentSnippet:
      "Landstræneren udtager truppen til de kommende kvalifikationskampe, hvor flere unge spillere får debut.",
    categories: ["Sporten"],
    imageUrl: "https://avatar.vercel.sh/mock3",
  },
];

export async function loader() {
  const articles: Article[] = mockArticles//await getArticles(); required setup, pocketbase to fetch and store articles serve through cloudlfare tunnel for static ip
  return { articles };
}

export default function Content({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article: { link: any; title: any; contentSnippet: any; imageUrl: any; categories: any[]; }) => (
        <ContentCard
          key={article.link}
          title={article.title}
          description={article.contentSnippet ?? ""}
          imageUrl={article.imageUrl ?? "https://avatar.vercel.sh/placeholder"}
          link={article.link}
          badge={article.categories?.[0]}
        />
      ))}
    </div>
  );
}