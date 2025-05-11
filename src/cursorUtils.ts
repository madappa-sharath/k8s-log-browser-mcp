import ExpiryMap from "expiry-map";

/**
 * Open search cursors are huge blurbs of text. LLMs weren't doing well with looking it up from one tool call and passing it to the next.
 * To simplify usagae, we assign a uuid to cursor and hold the cursor in memory for 6 minutes. LLMs thus only have to deal with a UUID
 */

const CURSORS_LOOKUP_MAP = new ExpiryMap(6 * 60 * 1000);

export const rewriteCursor = (queryResult: any) => {
  if (queryResult.cursor) {
    const uuid = crypto.randomUUID();
    CURSORS_LOOKUP_MAP.set(uuid, queryResult.cursor);
    return {
      ...queryResult,
      cursor: uuid,
    };
  }
  return queryResult;
};

export const lookupCursor = (cursorId: string) => {
  if (CURSORS_LOOKUP_MAP.has(cursorId)) {
    return CURSORS_LOOKUP_MAP.get(cursorId);
  }
  throw Error(`Could not look up state for the cursor: ${cursorId}.`);
};
