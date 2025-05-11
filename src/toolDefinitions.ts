import { ParamCursor, ParamNameSpace, ParamPodName } from "./schema";

export const TOOL_DEFINITIONS = [
  {
    name: "k8_pod_logs" as const,
    description: [
      "Look up logs for a Kubernetes Pod (or multiple in case of deployment)",
      "",
      "Use this tool when you need to:",
      "- Fetch logs for a kubernetes pod/deployment in a particular namespace",
    ].join("\n"),
    paramsSchema: {
      namespace: ParamNameSpace.nonempty(),
      podNamePrefix: ParamPodName.nonempty(),
    },
  },
  {
    name: "load_more_logs" as const,
    description: [
      "Load more logs related to a previous 'k8_pod_logs' too call",
      "",
      "Use this tool when you have already initiated a search and are looking to load the next page of results ",
    ].join("\n"),
    paramsSchema: {
      cursor: ParamCursor.nonempty(),
    },
  },
];
