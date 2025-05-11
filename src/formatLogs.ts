export const formatOpensearchResult = (result: any, query: string) => {
  const output: string[] = [];
  const dataRows = <any[][]>result.datarows;
  if (Array.isArray(dataRows) && dataRows.length) {
    output.push(
      `Most recent ${result.size}/${result.total} lines retrived from opensearch below:`
    );
    output.push(`<query>\n${query}\n</query>`);
    output.push(
      `<format>\n[pod_name] [timestamp] [log_level] [logger_name] [message]\n</format>`
    );
    output.push("<results>");
    dataRows.forEach(([kubernetes, log_processed]) => {
      output.push(
        `${kubernetes.pod_name} ${log_processed["@timestamp"]} ${log_processed.level} ${log_processed.logger_name} ${log_processed.message}`
      );
    });
    output.push("</results>");
    if (result.cursor) {
      output.push(
        `<load-more>There are more logs, request the 'load_more_logs' with the below cursor:`
      );
      output.push(result.cursor);
      output.push(
        "If you are done looking up, close the search context using the clear-cursor tool.</load-more>"
      );
    }
  } else {
    output.push(`No logs found in opensearch for the query ${query}`);
  }
  return output.join("\n");
};
