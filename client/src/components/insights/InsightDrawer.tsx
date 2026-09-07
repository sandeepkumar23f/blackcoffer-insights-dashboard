import { X } from "lucide-react";
import { useEffect } from "react";
import type { Insight } from "../../types/api";
import { displayText } from "../../utils/format";

export function InsightDrawer({
  insight,
  onClose,
}: {
  insight: Insight | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!insight) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [insight, onClose]);

  if (!insight) return null;

  const rows: [string, string][] = [
    ["Topic", displayText(insight.topic)],
    ["Sector", displayText(insight.sector)],
    ["Country", displayText(insight.country)],
    ["City", "—"],
    ["Region", displayText(insight.region)],
    ["Start year", displayText(insight.start_year)],
    ["End year", displayText(insight.end_year)],
    ["Intensity", displayText(insight.intensity)],
    ["Likelihood", displayText(insight.likelihood)],
    ["Relevance", displayText(insight.relevance)],
    ["Impact", displayText(insight.impact)],
    ["PESTLE", displayText(insight.pestle)],
    ["SWOT", "—"],
    ["Source", displayText(insight.source)],
    ["Added", displayText(insight.added)],
    ["Published", displayText(insight.published)],
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" className="absolute inset-0 bg-slate-950/40" aria-label="Close details" onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-drawer-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 id="insight-drawer-title" className="text-base font-semibold leading-snug text-slate-900 dark:text-white">
            {displayText(insight.title)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-4 text-sm">
          <p className="text-slate-600 dark:text-slate-300">{displayText(insight.insight)}</p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
            {rows.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="truncate text-slate-800 dark:text-slate-100">{v}</dd>
              </div>
            ))}
          </dl>
          {insight.url ? (
            <a
              href={insight.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Open original source
            </a>
          ) : (
            <p className="text-slate-500">No source URL</p>
          )}
        </div>
      </aside>
    </div>
  );
}
