# speak-my-thought

An MCP server that uses OpenAI to turn your verified experience into:

- resume bullets, interview stories, and professional impact statements;
- coding explanations and next steps; and
- software-design recommendations and trade-off discussions.

The assistant is instructed to ask for missing evidence rather than inventing
projects, metrics, or outcomes.

## Setup

Requires Node.js 20 or newer and an OpenAI API key.

```bash
npm install
npm run build
export OPENAI_API_KEY="your-key"
```

Optional configuration:

```bash
export OPENAI_MODEL="gpt-5-mini"
export SPEAK_MY_THOUGHT_CONTEXT_FILE="/absolute/path/to/experiences.md"
```

Copy `experiences.example.md` outside version control (or to the ignored
`experiences.md`) and add facts from repositories such as `algorithm-prep`.
The server reads only the file you explicitly configure; it does not scan other
repositories.

## MCP client configuration

After building, add the server to an MCP client:

```json
{
  "mcpServers": {
    "speak-my-thought": {
      "command": "node",
      "args": ["/absolute/path/to/speak-my-thought/dist/src/index.js"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "SPEAK_MY_THOUGHT_CONTEXT_FILE": "/absolute/path/to/experiences.md"
      }
    }
  }
}
```

The server exposes `articulate_impact`, `coding_help`, and `design_help`. Each
tool accepts rough `thoughts` plus optional `experience`, `audience`, and
`tone`.

## Development

```bash
npm test
npm run typecheck
npm run build
```
