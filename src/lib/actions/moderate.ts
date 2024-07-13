"use server";

import { moderationResponse } from "@/lib/ai/llm";
import { moderationPrompt } from "@/lib/ai/prompts";

export async function moderateContent(
  prompt: string,
  answer: string
): Promise<boolean> {
  const promptText = moderationPrompt(prompt, answer).trim();
  return await moderationResponse(promptText);
}
