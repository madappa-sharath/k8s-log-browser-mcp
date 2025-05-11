#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startStdio } from "./transports/stdio";

let opensearchHost: string | undefined = process.env.OPENSEARCH_HOST;
let opensearchUsername: string | undefined = process.env.OPENSEARCH_USERNAME;
let opensearchPassword: string | undefined = process.env.OPENSEARCH_PASSWORD;

const command = "k8s-log-browser-mcp";

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--host=")) {
    opensearchHost = arg.split("=")[1];
  } else if (arg.startsWith("--username=")) {
    opensearchUsername = arg.split("=")[1];
  } else if (arg.startsWith("--password=")) {
    opensearchPassword = arg.split("=")[1];
  }
}

if (!opensearchHost) {
  console.error(
    "Error: Opensearch host was not provided. Pass one with `--host` or via `OPENSEARCH_HOST`."
  );
  console.error(
    `Usage: ${command} --host=<opensearch-host> --username=<opensearch-username> --password=<opensearch-password>`
  );
  process.exit(1);
}

if (!opensearchUsername) {
  console.error(
    "Error: Opensearch username was not provided. Pass one with `--username` or via `OPENSEARCH_USERNAME`."
  );
  console.error(
    `Usage: ${command} --host=<opensearch-host> --username=<opensearch-username> --password=<opensearch-password>`
  );
  process.exit(1);
}

if (!opensearchPassword) {
  console.error(
    "Error: Opensearch username was not provided. Pass one with `--password` or via `OPENSEARCH_PASSWORD`."
  );
  console.error(
    `Usage: ${command} --host=<opensearch-host> --username=<opensearch-username> --password=<opensearch-password>`
  );
  process.exit(1);
}

const server = new McpServer({
  name: "K8s Log MCP",
  version: "0.0.1",
});

startStdio(server, {
  opensearchHost,
  opensearchUsername,
  opensearchPassword,
}).catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
