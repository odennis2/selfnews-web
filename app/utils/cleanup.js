import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Find the exact path to the current file to reliably load .env from the root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupOldArticles() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffISO = cutoff.toISOString();

  console.log(`[Cleanup] Targeting articles older than: ${cutoffISO}`);

  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .or(`pubDate.lt.${cutoffISO},created_at.lt.${cutoffISO}`);

    if (error) throw error;

    console.log(`[Cleanup] Successfully purged old articles.`);
  } catch (err) {
    console.error("[Cleanup] Failed to delete old articles:", err.message);
    process.exit(1);
  }
}

cleanupOldArticles();