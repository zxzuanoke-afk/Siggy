/**
 * Script: generate-embeddings.ts
 * Reads scraped docs, chunks them, generates TF-IDF embeddings,
 * and saves the vector store to disk.
 * Run with: npm run embed
 */

import fs from 'fs';
import path from 'path';
import { chunkText } from '../src/lib/rag/chunks';
import { buildEmbeddingModel, embedText } from '../src/lib/rag/embeddings';
import { buildVectorStore, saveVectorStore } from '../src/lib/rag/vectorStore';
import type { DocumentChunk } from '../src/types';

const DOCS_DIR = path.join(process.cwd(), 'src', 'data', 'documents');

function parseDocFile(filePath: string): { title: string; url: string; slug: string; content: string } {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  const title = lines[0]?.replace('TITLE: ', '').trim() || '';
  const url = lines[1]?.replace('URL: ', '').trim() || '';
  const slug = lines[2]?.replace('SLUG: ', '').trim() || '';
  const contentStart = raw.indexOf('---\n\n') + 5;
  const content = raw.slice(contentStart).trim();

  return { title, url, slug, content };
}

async function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ No documents found. Run `npm run scrape` first.');
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.txt'));

  if (files.length === 0) {
    console.error('❌ No .txt files found in', DOCS_DIR);
    process.exit(1);
  }

  console.log(`\n🐱 Siggy Embedding Generator — processing ${files.length} documents\n`);

  // Parse all docs
  const allChunks: DocumentChunk[] = [];
  const allTexts: string[] = [];

  for (const file of files) {
    const { title, url, slug, content } = parseDocFile(path.join(DOCS_DIR, file));

    if (!content || content.length < 100) {
      console.log(`  ⚠️  Skipping ${file} (too short)`);
      continue;
    }

    const chunks = chunkText(content, slug, title, url);
    console.log(`  📄 ${slug}: ${chunks.length} chunks`);

    allChunks.push(...chunks);
    allTexts.push(...chunks.map((c) => c.content));
  }

  console.log(`\n📊 Total chunks: ${allChunks.length}`);
  console.log('🧠 Building TF-IDF vocabulary...');

  // Build embedding model from all chunk texts
  const model = buildEmbeddingModel(allTexts);
  console.log(`   Vocabulary size: ${model.vocabulary.length} terms`);

  // Generate embeddings
  console.log('⚡ Generating embeddings...');
  const embeddings = allChunks.map((chunk) => embedText(chunk.content, model));

  // Build and save vector store
  const store = buildVectorStore(allChunks, embeddings, model);
  saveVectorStore(store);

  console.log('\n✨ Knowledge base ready! You can now run `npm run dev`.\n');
}

main().catch(console.error);
