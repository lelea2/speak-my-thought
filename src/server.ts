import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

import {
  getHelp,
  OpenAITextGenerator,
  type HelpMode,
  type HelpRequest,
  type TextGenerator,
} from "./assistant.js";
import { loadExperienceContext } from "./context.js";

const inputSchema = {
  thoughts: z.string().min(1).describe("Rough thoughts, question, or draft"),
  experience: z
    .string()
    .optional()
    .describe("Relevant facts or examples from your own work"),
  audience: z.string().optional().describe("Who will read the response"),
  tone: z.string().optional().describe("Desired communication style"),
};

interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  mode: HelpMode;
}

const tools: ToolDefinition[] = [
  {
    name: "articulate_impact",
    title: "Articulate professional impact",
    description:
      "Turn verified experience into resume bullets, interview stories, or impact statements.",
    mode: "impact",
  },
  {
    name: "coding_help",
    title: "Get coding help",
    description:
      "Work through a coding problem using lessons and patterns from your own practice.",
    mode: "coding",
  },
  {
    name: "design_help",
    title: "Get design help",
    description:
      "Develop a software design and explain its trade-offs using your own experience.",
    mode: "design",
  },
];

export function createServer(
  generatorFactory: () => TextGenerator = () => new OpenAITextGenerator(),
): McpServer {
  const server = new McpServer({
    name: "speak-my-thought",
    version: "1.0.0",
  });

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema,
      },
      async (request: HelpRequest) => {
        try {
          const fileContext = await loadExperienceContext();
          const experience = [fileContext, request.experience]
            .filter(Boolean)
            .join("\n\n");
          const text = await getHelp(generatorFactory(), tool.mode, {
            ...request,
            experience,
          });
          return { content: [{ type: "text", text }] };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unexpected assistant error.";
          return {
            isError: true,
            content: [{ type: "text", text: message }],
          };
        }
      },
    );
  }

  return server;
}
