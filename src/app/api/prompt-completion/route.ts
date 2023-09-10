import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PromptCompletionRequestPayload {
    prompt: string;
    open_ai_model: string;
}

export interface PromptCompletionResponsePayload {
    completion: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    console.log('POST /api/prompt-completion');

    // extract payload from request
    const requestPayload: PromptCompletionRequestPayload = await request.json();
    if (requestPayload.prompt.trim().length === 0) {
        throw new Error('Found empty prompt input');
    }

    // execute prompt
    console.log('Executing prompt...');
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: requestPayload.prompt }],
        model: requestPayload.open_ai_model
    });

    // construct response
    console.log('Prompt complete');
    const responsePayload: PromptCompletionResponsePayload = {
        completion: completion.choices[0].message.content ?? '',
    };

    // return response
    return NextResponse.json(responsePayload);
}