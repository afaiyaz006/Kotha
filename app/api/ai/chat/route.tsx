import { CoreMessage, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { headers } from 'next/headers';

// Simple in-memory store for rate limiting - only tracking count now
const rateLimit = new Map<string, number>();

export const maxDuration = 30;

export async function POST(req: Request) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  
  // Skip rate limiting if DEBUG is enabled
  const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'TRUE';
  //const isDebug = false;
  if (!isDebug) {
    const currentCount = rateLimit.get(ip) || 0;
    
    if (currentCount >= 10) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue('Maximum request limit reached for this IP address');
          controller.close();
        },
      });
      
      return new Response(stream, {
        status: 429,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
    
    rateLimit.set(ip, currentCount + 1);
  }

  const { messages }: { messages: CoreMessage[] } = await req.json();
  
  const groq = createGroq({
    baseURL: process.env.GROQ_API_URL || '',
    apiKey: process.env.GROQ_API_KEY || ''
  });
  
  const result = await streamText({
    model: groq('mixtral-8x7b-32768'),
    system: 'You are a helpful assistant that analyzes chat between two users.One is the user defined as `You` another is the other party suggest probable replies for `You` and be helpful.',
    messages,
  });

  return result.toDataStreamResponse();
}