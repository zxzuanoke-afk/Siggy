/**
 * Script: scrape-docs.ts
 * Scrapes Ritual Foundation documentation pages and saves them as markdown files.
 * Run with: npm run scrape
 */

import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'src', 'data', 'documents');

const RITUAL_DOCS = [
  { slug: 'what-is-ritual', title: 'What is Ritual?', url: 'https://www.ritualfoundation.org/docs/overview/what-is-ritual' },
  { slug: 'crypto-x-ai', title: 'Crypto × AI', url: 'https://www.ritualfoundation.org/docs/overview/crypto-x-ai' },
  { slug: 'evm-sidecars-overview', title: 'EVM++ Sidecars Overview', url: 'https://www.ritualfoundation.org/docs/whats-new/evm++-sidecars/overview' },
  { slug: 'scheduled-transactions', title: 'Scheduled Transactions', url: 'https://www.ritualfoundation.org/docs/architecture/scheduled-transactions' },
  { slug: 'enshrined-ai-models', title: 'Enshrined AI Models', url: 'https://www.ritualfoundation.org/docs/whats-new/ai-primitives/enshrined-ai-models' },
  { slug: 'resonance', title: 'Resonance', url: 'https://www.ritualfoundation.org/docs/whats-new/resonance' },
  { slug: 'symphony', title: 'Symphony', url: 'https://www.ritualfoundation.org/docs/whats-new/symphony' },
  { slug: 'infernet-to-chain', title: 'Infernet ↔ Chain', url: 'https://www.ritualfoundation.org/docs/architecture/infernet-to-chain' },
  { slug: 'node-specialization', title: 'Node Specialization', url: 'https://www.ritualfoundation.org/docs/whats-new/node-specialization' },
  { slug: 'verifiable-provenance', title: 'Verifiable Provenance', url: 'https://www.ritualfoundation.org/docs/whats-new/ai-primitives/verifiable-provenance' },
  { slug: 'modular-storage', title: 'Modular Storage', url: 'https://www.ritualfoundation.org/docs/whats-new/modular-storage' },
  { slug: 'account-abstraction', title: 'Account Abstraction', url: 'https://www.ritualfoundation.org/docs/whats-new/evm++/account-abstraction' },
  { slug: 'guardians', title: 'Guardians', url: 'https://www.ritualfoundation.org/docs/whats-new/guardians' },
  { slug: 'model-marketplace', title: 'Model Marketplace', url: 'https://www.ritualfoundation.org/docs/beyond-crypto-x-ai/model-marketplace' },
  { slug: 'prover-networks', title: 'Prover Networks', url: 'https://www.ritualfoundation.org/docs/beyond-crypto-x-ai/prover-networks' },
];

async function fetchAndClean(url: string): Promise<string> {
  const { default: fetch } = await import('node-fetch');
  const { load } = await import('cheerio');

  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiggyBot/1.0)' },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const html = await res.text();
  const $ = load(html);

  // Remove navigation, headers, footers
  $('nav, header, footer, script, style, .navigation, [class*="sidebar"]').remove();

  // Extract main content — Mintlify docs use article or main
  const mainEl = $('article').first() || $('main').first();
  const rawText = (mainEl.length ? mainEl : $('body')).text();

  // Clean up whitespace
  return rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  console.log(`\n🐱 Siggy Doc Scraper — scraping ${RITUAL_DOCS.length} pages\n`);

  let success = 0;
  let failed = 0;

  for (const doc of RITUAL_DOCS) {
    try {
      const content = await fetchAndClean(doc.url);
      const filePath = path.join(DOCS_DIR, `${doc.slug}.txt`);

      const fileContent = `TITLE: ${doc.title}\nURL: ${doc.url}\nSLUG: ${doc.slug}\n\n---\n\n${content}`;
      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log(`  ✅ ${doc.slug} (${content.length} chars)`);
      success++;

      // Be polite to the server
      await new Promise((r) => setTimeout(r, 800));
    } catch (e) {
      console.error(`  ❌ ${doc.slug}: ${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\n📦 Done! ${success} scraped, ${failed} failed.`);
  console.log(`📁 Saved to: ${DOCS_DIR}`);
  console.log(`\nNext: run 'npm run embed' to generate embeddings.\n`);
}

main().catch(console.error);
