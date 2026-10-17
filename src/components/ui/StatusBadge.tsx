import { statusLabels, statusMeanings, statusTokens, type ProjectStatus } from "@/content";

interface Props {
  status: ProjectStatus;
  /** Shows the one-line explanation of what the status promises. */
  withMeaning?: boolean;
}

/**
 * A project's honesty label.
 *
 * The dot is decorative; the status is always spelled out in words, so the
 * meaning never depends on colour. (docs/constitution.md §5.4)
 */
export function StatusBadge({ status, withMeaning = false }: Props) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span
        className={`inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-[0.14em] ${statusTokens[status]}`}
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
        {statusLabels[status]}
      </span>
      {withMeaning ? (
        <span className="text-micro text-ink-faint">{statusMeanings[status]}</span>
      ) : null}
    </span>
  );
}
