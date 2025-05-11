import { z } from "zod";

export const ParamNameSpace = z.string().describe("The kubernetes namespace");
export const ParamPodName = z
  .string()
  .describe(
    "The kubernetes pod name. Fetches logs for all pods that start with the name. Include full pod name for logs from 'a' pod or just prefix for all pods of the deployment"
  );
export const ParamCursor = z
  .string()
  .describe("The cursor to load more logs for an existing search");
