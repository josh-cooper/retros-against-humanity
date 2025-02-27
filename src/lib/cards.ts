import promptCardsData from "@/data/prompts.lines";
import answerCardsData from "@/data/answers.lines";

export const promptCards: string[] = promptCardsData
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => line.replace(/<blank>/g, "_____"));

export const answerCards: string[] = answerCardsData
  .split("\n")
  .filter((line) => line.trim() !== "");

// export const promptCards: string[] = [
//   "Ain't nobody got time for _____",
//   "_____ is the hero we deserve, but not the one we need right now",
//   "I'm not saying it was _____, but it was _____",
//   "_____ : Ain't no party like a _____ party",
//   "Nobody puts _____ in the corner",
// ];

// export const answerCards: string[] = [
//   "Pair programming",
//   "Standups that last forever",
//   "The mythical man-month",
//   "Technical debt",
//   "Agile manifesto",
//   "Sprint planning",
//   "Retrospectives",
//   "User stories",
//   "Burndown charts",
//   "Scrum master",
//   "[BLANK]",
//   "[BLANK]",
// ];
