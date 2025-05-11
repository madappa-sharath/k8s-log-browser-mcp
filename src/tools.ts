import type { ToolHandlers } from "./types";
import { ApiError, OpensearchClient } from "./opensearchClient";
import { formatOpensearchResult } from "./formatLogs";
import { rewriteCursor, lookupCursor } from "./cursorUtils";

export const TOOL_HANDLERS = {
  k8_pod_logs: async (context, { namespace, podNamePrefix }) => {
    const opensearchClient = new OpensearchClient(
      context.opensearchHost,
      context.opensearchUsername,
      context.opensearchPassword
    );
    const sqlQuery = `select kubernetes,log_processed from ${namespace}-* where kubernetes.pod_name like '${podNamePrefix}%' and not isnull(log_processed.message) order by \`log_processed.@timestamp\` desc`;
    try {
      let queryResult = await opensearchClient.getSQLQueryResult(sqlQuery);
      queryResult = rewriteCursor(queryResult);
      return formatOpensearchResult(queryResult, sqlQuery);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          `Request failed with status code ${error.status}. The error message is ${error.message}. The query used was ${sqlQuery}`,
          error.status
        );
      }
      throw error;
    }
  },
  load_more_logs: async (context, { cursor }) => {
    const opensearchClient = new OpensearchClient(
      context.opensearchHost,
      context.opensearchUsername,
      context.opensearchPassword
    );
    const actualCursor = lookupCursor(cursor);
    const sqlQuery = `select more results using cursor: ${cursor}`;
    try {
      let queryResult = await opensearchClient.getSQLCursorResult(actualCursor);
      queryResult = rewriteCursor(queryResult);
      return formatOpensearchResult(queryResult, sqlQuery);
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(
          `Request failed with status code ${error.status}. The error message is ${error.message}. The query used was ${sqlQuery}`,
          error.status
        );
      }
      throw error;
    }
  },
} satisfies ToolHandlers;
