import { OpenAI } from 'openai';

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('=== API Request Start ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    const { messages, model } = body;

    console.log('Creating OpenAI stream with model:', model || 'gpt-4');
    const stream = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant integrated into a text editor. Help the user.',
        },
        ...messages,
      ],
    });

    console.log('Stream created, setting up readable stream');
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting to process stream chunks');
          for await (const chunk of stream) {
            console.log('Raw chunk:', JSON.stringify(chunk));
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              console.log('Processing chunk text:', text);
              // Format: "0:string\n" for text chunks
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
            }
          }
          console.log('Stream processing complete');
          // Send finish message with usage info
          const finishMessage = {
            finishReason: 'stop',
            usage: {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            }
          };
          controller.enqueue(new TextEncoder().encode(`d:${JSON.stringify(finishMessage)}\n`));
          controller.close();
        } catch (error) {
          console.error('Stream processing error:', error);
          controller.error(error);
        }
      },
    });

    console.log('=== API Request End ===');
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'x-vercel-ai-data-stream': 'v1' // Required header for Vercel AI SDK
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 