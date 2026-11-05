#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server.js";

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await createServer().connect(transport);
  console.error("speak-my-thought MCP server running on stdio");
}

main().catch((error: unknown) => {
  console.error("Server error:", error);
  process.exitCode = 1;
});
