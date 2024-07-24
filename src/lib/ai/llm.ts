import "server-only";
import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = wrapOpenAI(
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export async function chatCompletion(
  promptText: string,
  validateResponse?: (text: string) => boolean,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText,
              },
            ],
          },
        ],
      });

      const result = response.choices[0].message.content || "";

      if (!validateResponse || validateResponse(result)) {
        return result;
      }

      console.warn(`Invalid response on attempt ${attempt + 1}: "${result}"`);
    } catch (error) {
      console.error(
        `Error calling Claude Haiku on attempt ${attempt + 1}:`,
        error
      );
      if (attempt === maxRetries - 1) {
        throw new Error(
          "Failed to get a valid response from GPT-4o-mini after multiple attempts"
        );
      }
    }
  }

  throw new Error(
    "Failed to get a valid response from GPT-4o-mini after exhausting all retries"
  );
}

export async function moderationResponse(text: string): Promise<boolean> {
  try {
    const response = await openai.moderations.create({ input: text });
    return !response.results[0].flagged;
  } catch (error) {
    console.error("Error calling OpenAI moderation API:", error);
    return false; // Assume unsafe if there's an error
  }
}
