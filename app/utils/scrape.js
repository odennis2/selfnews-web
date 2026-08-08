import { createClient } from '@supabase/supabase-js';
import { feeds, fetchFeed, fetchArticle } from './RSSFeed.js';
import 'dotenv/config'; 

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function saveToSupabase(feedName, item, articleData) {
  if (!articleData || !articleData.title || !item.link) return;

  const recordData = {
    title: articleData.title,
    link: item.link, 
    content: articleData.content,
    imageUrl: articleData.imageUrl,
    feedName,
    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
  };

  try {
    const { error } = await supabase
      .from('articles')
      .upsert(recordData, { onConflict: 'link' });

    if (error) throw error;
  } catch (err) {
    console.error(`Error saving to Supabase (${item.link}):`, err.message);
  }
}

(async () => {
  for (const feed of feeds) {
    
    const feedData = await fetchFeed(feed);
    
    if (feedData.error) {
      console.error(`Failed to process feed ${feed.name}:`, feedData.error);
      continue;
    }

    for (const item of feedData.items) {
      const articleData = await fetchArticle(item.link);
      await saveToSupabase(feed.name, item, articleData);
    }
  }
})();