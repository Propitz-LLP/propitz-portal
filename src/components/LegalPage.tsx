import { Fragment, type ReactNode } from "react";
import PageHero from "@/components/PageHero";
import { IMG } from "@/data/site";
import { LEGAL_EFFECTIVE, LEGAL_UPDATED, type LegalDoc, type LegalSection } from "@/data/legal";

/** Turns email addresses in legal text into mailto links. */
function linkify(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+\.[\w.-]+)/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`} className="font-semibold text-brand underline-offset-4 hover:underline">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/**
 * A table as a real table from `sm` up; below that, each row becomes a card
 * with its column labels, so three columns stay readable on a phone.
 */
function LegalTable({ table }: { table: NonNullable<LegalSection["table"]> }) {
  const [first, ...rest] = table.columns;
  return (
    <div className="mb-6">
      <div className="hidden overflow-hidden rounded-2xl ring-1 ring-line sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-alt text-ink">
            <tr>
              {table.columns.map((c) => (
                <th key={c} className="px-4 py-3 font-semibold">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface text-body">
            {table.rows.map((row) => (
              <tr key={row[0]} className="align-top">
                {row.map((cell, i) => (
                  <td key={i} className={`px-4 py-3 leading-relaxed ${i === 0 ? "font-semibold text-ink" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {table.rows.map((row) => (
          <div key={row[0]} className="rounded-2xl bg-surface p-4 text-sm ring-1 ring-line">
            <p className="font-semibold text-ink">
              <span className="sr-only">{first}: </span>
              {row[0]}
            </p>
            <dl className="mt-2 space-y-2">
              {rest.map((label, i) => (
                <div key={label}>
                  <dt className="text-xs font-bold uppercase tracking-[0.06em] text-faint">{label}</dt>
                  <dd className="mt-0.5 leading-relaxed text-body">{row[i + 1]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One clause: its heading, text, list, table and any sub-clauses (one level down). */
function Section({ s, level }: { s: LegalSection; level: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  const List = s.ordered ? "ol" : "ul";

  return (
    <div>
      <Heading>{s.heading}</Heading>
      {s.body?.map((p, i) => <p key={`b${i}`}>{linkify(p)}</p>)}
      {s.list && (
        <List>
          {s.list.map((li) => (
            <li key={li}>{linkify(li)}</li>
          ))}
        </List>
      )}
      {s.after?.map((p, i) => <p key={`a${i}`}>{linkify(p)}</p>)}
      {s.table && <LegalTable table={s.table} />}
      {s.subsections?.map((sub) => (
        <Section key={sub.heading} s={sub} level={3} />
      ))}
    </div>
  );
}

/** Renders the Terms of Use or Privacy Policy from src/data/legal.ts. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero
        title={doc.title}
        crumb={doc.title}
        subtitle={`Effective date: ${LEGAL_EFFECTIVE} | Last updated: ${LEGAL_UPDATED}`}
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="prose-content mx-auto max-w-3xl break-words">
            {doc.intro?.map((p, i) => <p key={`i${i}`}>{linkify(p)}</p>)}
            {doc.sections.map((s) => (
              <Section key={s.heading} s={s} level={2} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
