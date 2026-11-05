import { readFile } from "node:fs/promises";

const MAX_CONTEXT_LENGTH = 50_000;

export async function loadExperienceContext(
  path = process.env.SPEAK_MY_THOUGHT_CONTEXT_FILE,
): Promise<string | undefined> {
  if (!path) {
    return undefined;
  }

  const context = await readFile(path, "utf8");
  if (context.length > MAX_CONTEXT_LENGTH) {
    throw new Error(
      "Experience context exceeds the 50,000-character limit.",
    );
  }
  return context;
}
