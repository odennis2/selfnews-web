import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";

const parser = new Parser({ timeout: 10000 });

export const feeds = [
  { name: "Seneste nyt", url: "https://www.dr.dk/nyheder/service/feeds/senestenyt" },
  { name: "Indland", url: "https://www.dr.dk/nyheder/service/feeds/indland" },
  { name: "Udland", url: "https://www.dr.dk/nyheder/service/feeds/udland" },
  { name: "Penge", url: "https://www.dr.dk/nyheder/service/feeds/penge" },
  { name: "Politik", url: "https://www.dr.dk/nyheder/service/feeds/politik" },
  { name: "Sporten", url: "https://www.dr.dk/nyheder/service/feeds/sporten" },
  { name: "Seneste sport", url: "https://www.dr.dk/nyheder/service/feeds/senestesport" },
  { name: "Viden", url: "https://www.dr.dk/nyheder/service/feeds/viden" },
  { name: "Kultur", url: "https://www.dr.dk/nyheder/service/feeds/kultur" },
  { name: "Musik", url: "https://www.dr.dk/nyheder/service/feeds/musik" },
  { name: "Vejret", url: "https://www.dr.dk/nyheder/service/feeds/vejret" },
  { name: "Regionale", url: "https://www.dr.dk/nyheder/service/feeds/regionale" },
  { name: "DR Hovedstadsområdet", url: "https://www.dr.dk/nyheder/service/feeds/regionale/kbh" },
  { name: "DR Bornholm", url: "https://www.dr.dk/nyheder/service/feeds/regionale/bornholm" },
  { name: "DR Syd og Sønderjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/syd" },
  { name: "DR Fyn", url: "https://www.dr.dk/nyheder/service/feeds/regionale/fyn" },
  { name: "DR Midt- og Vestjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/vest" },
  { name: "DR Nordjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/nord" },
  { name: "DR Trekantområdet", url: "https://www.dr.dk/nyheder/service/feeds/regionale/trekanten" },
  { name: "DR Sjælland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/sjaelland" },
  { name: "DR Østjylland", url: "https://www.dr.dk/nyheder/service/feeds/regionale/oestjylland" },
];

export const testFeed = [
  { name: "Seneste nyt", url: "https://www.dr.dk/nyheder/service/feeds/senestenyt" }
];

export async function fetchArticle(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(data);

    return {
      title: $("h1").text().trim(),
      imageUrl:
        $('div[itemprop="image"] meta[itemprop="url"]').attr("content") ||
        $('img[itemprop="image"]').first().attr("src") ||
        null,
      content: $('[itemprop="articleBody"] p')
        .map((_, p) => $(p).text().trim())
        .get()
        .join("\n\n"),
    };
  } catch (err) {
    console.error(`Failed to scrape article body for ${url}:`, err.message);
    return null;
  }
}

export async function fetchFeed(feed) {
  try {
    const rss = await parser.parseURL(feed.url);
    return {
      name: feed.name,
      url: feed.url,
      title: rss.title,
      description: rss.description,
      updated: rss.lastBuildDate || rss.pubDate,
      items: rss.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        creator: item.creator,
        contentSnippet: item.contentSnippet,
        categories: item.categories || [],
      })),
    };
  } catch (err) {
    return {
      name: feed.name,
      url: feed.url,
      error: err.message,
    };
  }
}