import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { loadExperienceContext } from "../src/context.js";

test("loads experience from an explicitly configured file", async () => {
  const directory = await mkdtemp(join(tmpdir(), "speak-my-thought-"));
  const path = join(directory, "experience.md");
  await writeFile(path, "Solved graph problems in algorithm-prep.", "utf8");

  assert.equal(
    await loadExperienceContext(path),
    "Solved graph problems in algorithm-prep.",
  );
});

test("rejects context that is too large", async () => {
  const directory = await mkdtemp(join(tmpdir(), "speak-my-thought-"));
  const path = join(directory, "experience.md");
  await writeFile(path, "x".repeat(50_001), "utf8");

  await assert.rejects(loadExperienceContext(path), /50,000-character limit/);
});
