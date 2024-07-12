const suggestDiscussionTopicsPrompt = (prompt: string, answer: string) => `
We are playing a "Retros Against Humanity" game.
The prompt is "${prompt}".
The winning answer is "${answer}".
Output 2-3 dot points of discusion suggestions for this retro item. Output just the suggestions, each preceeded by "-".
`;
