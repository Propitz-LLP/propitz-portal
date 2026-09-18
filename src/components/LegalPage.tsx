import PageHero from "@/components/PageHero";
import { IMG } from "@/data/site";
import { LEGAL_UPDATED, type LegalDoc, type LegalSection } from "@/data/legal";

/** One clause: its heading, text, list and any sub-clauses (one level down). */
function Section({ s, level }: { s: LegalSection; level: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  const List = s.ordered ? "ol" : "ul";

  return (
    <div>
      <Heading>{s.heading}</Heading>
      {s.body?.map((p, i) => <p key={`b${i}`}>{p}</p>)}
      {s.list && (
        <List>
          {s.list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </List>
      )}
      {s.after?.map((p, i) => <p key={`a${i}`}>{p}</p>)}
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
        subtitle={`Last updated ${LEGAL_UPDATED}`}
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="prose-content mx-auto max-w-3xl break-words">
            <p>{doc.intro}</p>
            {doc.sections.map((s) => (
              <Section key={s.heading} s={s} level={2} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
