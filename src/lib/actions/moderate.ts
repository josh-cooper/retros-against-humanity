"use server";

import { moderationResponse } from "@/lib/ai/llm";
import { moderationPrompt } from "@/lib/ai/prompts";
import { traceable } from "langsmith/traceable";

export const moderateContent = traceable(async function (
  prompt: string,
  answer: string
): Promise<boolean> {
  const promptText = moderationPrompt(prompt, answer).trim();
  return await moderationResponse(promptText);
});
