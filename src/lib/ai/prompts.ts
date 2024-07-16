export const suggestDiscussionTopicsPrompt = (
  prompt: string,
  answer: string
) => `
We are playing a "Retros Against Humanity" game.
The prompt is "${prompt}".
The winning answer is "${answer}".
Output 2-3 dot points of discusion suggestions for this retro item. These should be phrased as concise, direct questions to the players. Output just the suggestions, each preceeded by "-".
`;

export const moderationPrompt = (prompt: string, answer: string) => `
Prompt: "${prompt}"
Answer: "${answer}"
`;
