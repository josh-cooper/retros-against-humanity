"use server";

import { chatCompletion } from "@/lib/ai/llm";
import { suggestDiscussionTopicsPrompt } from "@/lib/ai/prompts";
import { traceable } from "langsmith/traceable";

function validateDiscussionTopics(text: string): boolean {
  const lines = text.trim().split("\n");
  const validLines = lines.filter((line) => /^\s*-\s*.+/.test(line));
  return validLines.length >= 2 && validLines.length <= 3;
}

export const suggestDiscussionTopics = traceable(async function (
  prompt: string,
  answer: string
): Promise<string[]> {
  const promptText = suggestDiscussionTopicsPrompt(prompt, answer);
  const result = await chatCompletion(promptText, validateDiscussionTopics);
  return result
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .map((line) => line.slice(1).trim());
});
