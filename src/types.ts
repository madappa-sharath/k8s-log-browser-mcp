import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { TOOL_DEFINITIONS } from "./toolDefinitions";
import type { z } from "zod";
import type { Notification } from "@modelcontextprotocol/sdk/types.js";

type ZodifyRecord<T extends Record<string, any>> = {
  [K in keyof T]: z.infer<T[K]>;
};

export type ToolName = (typeof TOOL_DEFINITIONS)[number]["name"];

export type ToolDefinition<T extends ToolName> = Extract<
  (typeof TOOL_DEFINITIONS)[number],
  { name: T }
>;

export type ToolParams<T extends ToolName> = ToolDefinition<T> extends {
  paramsSchema: Record<string, any>;
}
  ? ZodifyRecord<ToolDefinition<T>["paramsSchema"]>
  : Record<string, never>;

export type ToolHandler<T extends ToolName> = (
  params: ToolParams<T>
) => Promise<string>;

export type ToolHandlerExtended<T extends ToolName> = (
  context: ServerContext,
  params: ToolParams<T>,
  extra: RequestHandlerExtra<Request, Notification>
) => Promise<string>;

export type ToolHandlers = {
  [K in ToolName]: ToolHandlerExtended<K>;
};

export type ServerContext = {
  opensearchHost: string;
  opensearchUsername: string;
  opensearchPassword: string;
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonArray extends Array<JsonValue> {}
export interface JsonObject {
  [key: string]: JsonValue;
}
