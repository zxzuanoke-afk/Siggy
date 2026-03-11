import { NextRequest } from 'next/server';
import { groq, GROQ_MODEL, GROQ_FALLBACK_MODEL, MAX_TOKENS, MAX_HISTORY } from '@/lib/groq';
import { buildPromptWithContext } from '@/lib/prompts';
import { retrieve, formatContext, getSources } from '@/lib/rag/retriever';
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/lib/constants';
import type { ChatRequest, ChatHistory } from '@/types';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { message, persona, history } = body;

  if (!message || !persona) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: message, persona' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Sanitize message
  const sanitizedMessage = message.slice(0, 2000).trim();
  if (!sanitizedMessage) {
    return new Response(JSON.stringify({ error: 'Empty message' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // RAG: retrieve relevant context
  let contextString: string | null = null;
  let sources: string[] = [];

  try {
    const results = retrieve(sanitizedMessage);
    if (results && results.length > 0) {
      contextString = formatContext(results);
      sources = getSources(results);
    }
  } catch (e) {
    // Non-fatal: continue without RAG context
    console.warn('RAG retrieval failed:', e);
  }

  // Build system prompt with retrieved context
  const systemPrompt = buildPromptWithContext(persona, sanitizedMessage, contextString);

  // Trim history to last MAX_HISTORY messages
  const trimmedHistory: ChatHistory[] = (history || []).slice(-MAX_HISTORY);

  // Build messages array
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...trimmedHistory.map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user' as const, content: sanitizedMessage },
  ];

  // Stream response from Groq
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const completion = await groq.chat.completions.create({
          model: GROQ_MODEL,
          messages,
          max_tokens: MAX_TOKENS,
          temperature: 0.8,
          stream: true,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            sendEvent({ token: delta });
          }
        }

        sendEvent({ done: true, sources });
      } catch (err: unknown) {
        console.error('Groq streaming error:', err);

        // Try fallback model
        try {
          const fallback = await groq.chat.completions.create({
            model: GROQ_FALLBACK_MODEL,
            messages,
            max_tokens: MAX_TOKENS,
            temperature: 0.8,
            stream: true,
          });

          for await (const chunk of fallback) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              sendEvent({ token: delta });
            }
          }

          sendEvent({ done: true, sources });
        } catch (fallbackErr) {
          console.error('Fallback model also failed:', fallbackErr);
          sendEvent({
            error: 'Siggy is having a moment... please try again shortly.',
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
