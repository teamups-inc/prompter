import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface PromptCompletionRequestPayload {
    prompt: string;
    open_ai_model: string;
}

interface PromptCompletionResponsePayload {
    completion: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    // extract payload from request
    const requestPayload: PromptCompletionRequestPayload = await request.json();

    // execute prompt
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: requestPayload.prompt }],
        model: requestPayload.open_ai_model
    });

    // construct response
    const responsePayload: PromptCompletionResponsePayload = {
        completion: completion.choices[0].message.content ?? '',
    };

    // return response
    return NextResponse.json(responsePayload);
}