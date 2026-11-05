import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildPrompt,
  getHelp,
  type TextGenerator,
} from "../src/assistant.js";

test("impact prompt grounds claims in verified experience", () => {
  const prompt = buildPrompt("impact", {
    thoughts: "I improved our algorithm practice workflow",
    experience: "Reduced review time from two days to one day",
    audience: "a hiring manager",
  });

  assert.match(prompt.instructions, /Never invent/);
  assert.match(prompt.instructions, /hiring manager/);
  assert.match(prompt.input, /Reduced review time from two days to one day/);
});

test("missing experience is represented explicitly", () => {
  const prompt = buildPrompt("design", { thoughts: "Help design a cache" });

  assert.match(prompt.input, /No additional experience supplied/);
  assert.match(prompt.instructions, /follow-up questions/);
});

test("getHelp sends the generated prompt to the text generator", async () => {
  const calls: string[][] = [];
  const generator: TextGenerator = {
    async generate(instructions, input) {
      calls.push([instructions, input]);
      return "Polished response";
    },
  };

  const result = await getHelp(generator, "coding", {
    thoughts: "Explain my solution",
  });

  assert.equal(result, "Polished response");
  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /coding help/);
  assert.match(calls[0][1], /Explain my solution/);
});
