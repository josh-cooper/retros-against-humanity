import "server-only";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function chatCompletion(
  promptText: string,
  validateResponse?: (text: string) => boolean,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
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

      const result =
        response.content[0].type === "text"
          ? response.content[0].text.trim()
          : "";

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
          "Failed to get a valid response from Claude Haiku after multiple attempts"
        );
      }
    }
  }

  throw new Error(
    "Failed to get a valid response from Claude Haiku after exhausting all retries"
  );
}
