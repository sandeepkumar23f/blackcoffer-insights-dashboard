import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

type Props = {
  id: string;
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledReason?: string;
};

export function MultiSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "All",
  disabled,
  disabledReason,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={disabled ? disabledReason : undefined}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      >
        <span className="truncate">
          {disabled
            ? "Unavailable"
            : value.length === 0
              ? placeholder
              : value.length === 1
                ? value[0]
                : `${value.length} selected`}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
      </button>
      {value.length > 0 && !disabled ? (
        <button
          type="button"
          className="absolute right-8 top-8 rounded p-0.5 text-slate-400 hover:text-slate-700"
          aria-label={`Clear ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onChange([]);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
      {open && !disabled ? (
        <div
          className="absolute z-30 mt-1 max-h-72 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
          role="listbox"
          aria-multiselectable="true"
        >
          <div className="border-b border-slate-100 p-2 dark:border-slate-800">
            <input
              className="w-full rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-teal-600 dark:border-slate-700"
              placeholder={`Search ${label.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={`Search ${label}`}
            />
          </div>
          <ul className="max-h-52 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-500">No matches</li>
            ) : (
              filtered.map((opt) => {
                const selected = value.includes(opt);
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      onClick={() => toggle(opt)}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selected
                            ? "border-teal-700 bg-teal-700 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="truncate">{opt}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
