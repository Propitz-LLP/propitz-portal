"use client";

import { useState, type ReactNode } from "react";
import { IconChevron, IconClose, IconSearch } from "@/components/Icon";

/** Shared pieces of the two marketplace filter rails, so both tabs behave alike. */

export function FilterHeading({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
      {children}
    </p>
  );
}

/** Results update as you type; submitting just closes the phone keyboard. */
export function SearchBar({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur();
      }}
      className="mb-7 flex h-14 items-center gap-3 rounded-full border border-line-strong bg-surface pl-5 pr-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15"
    >
      <IconSearch size={18} className="shrink-0 text-faint" />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-full min-w-0 grow bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-bg-alt hover:text-ink"
        >
          <IconClose size={14} />
        </button>
      )}
      <button
        type="submit"
        className="hidden shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white sm:block"
      >
        Search
      </button>
    </form>
  );
}

/** A real checkbox, drawn as the rail's rounded square. */
export function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${
          checked ? "bg-ok text-white" : "border-[1.5px] border-line-strong bg-surface"
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="m4 8.2 2.4 2.4L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-[13.5px] ${checked ? "font-semibold text-ink" : "text-body"}`}>{label}</span>
    </label>
  );
}

/** Phones and tablets: the rail hides behind this so results come first. */
export function FilterToggle({
  open,
  onToggle,
  active,
}: {
  open: boolean;
  onToggle: () => void;
  active: number;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className="mb-4 flex w-full items-center justify-between rounded-[16px] border border-line-strong bg-surface px-5 py-3.5 text-[15px] font-bold text-ink lg:hidden"
    >
      <span className="flex items-center gap-2">
        Filters
        {active > 0 && (
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-[12px] text-white">
            {active}
          </span>
        )}
      </span>
      <IconChevron size={12} className={open ? "rotate-180" : ""} />
    </button>
  );
}

export function SortSelect({
  options,
  value,
  onChange,
}: {
  options: readonly { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <label className="relative ml-auto inline-flex items-center">
      <span className="sr-only">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-line-strong bg-surface py-2.5 pl-4 pr-9 text-[13.5px] font-semibold text-body focus:border-brand focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            Sort: {o.label}
          </option>
        ))}
      </select>
      <IconChevron size={11} className="pointer-events-none absolute right-4 text-body" />
    </label>
  );
}

/**
 * Show a long result list a page at a time. `resetKey` is the current
 * filter state: when it changes, the list starts again from the first page.
 * Filtering still runs over every item; only rendering is paged.
 */
export function usePaged<T>(items: T[], resetKey: string, pageSize: number) {
  const [state, setState] = useState({ key: resetKey, limit: pageSize });
  // Filters changed: forget the old limit, so returning to an earlier
  // filter combination starts from the first page too.
  if (state.key !== resetKey) setState({ key: resetKey, limit: pageSize });
  const limit = state.key === resetKey ? state.limit : pageSize;
  return {
    visible: items.slice(0, limit),
    remaining: Math.max(0, items.length - limit),
    showMore: () => setState({ key: resetKey, limit: limit + pageSize }),
  };
}

export function ShowMore({
  shown,
  total,
  remaining,
  pageSize,
  noun,
  onClick,
}: {
  shown: number;
  total: number;
  remaining: number;
  pageSize: number;
  noun: string;
  onClick: () => void;
}) {
  if (remaining <= 0) return null;
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted">
        Showing {shown} of {total} {noun}
      </p>
      <button type="button" onClick={onClick} className="btn-ghost justify-center px-6 py-3 text-sm">
        Show {Math.min(pageSize, remaining)} more
      </button>
    </div>
  );
}
