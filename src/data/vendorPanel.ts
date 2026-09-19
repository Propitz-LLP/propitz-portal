import type { LegalDoc } from "./legal";

/* ------------------------------------------------------------------ */
/*  Recommended Vendor Panel: selection, fees and ranking.             */
/*                                                                     */
/*  Wording from Part III of the legal pack                            */
/*  (PropITZ_Updated_Terms_Privacy_Website_Wording_FINAL.docx),        */
/*  published verbatim. It must stay in step with Terms of Use          */
/*  section 6 and with how professionals are actually ordered: if the  */
/*  ranking changes materially, update this disclosure too.            */
/* ------------------------------------------------------------------ */

export const VENDOR_PANEL_PATH = "/vendor-panel-ranking-disclosure";

/** The short public disclosure block (Part III, "Professional Network"). */
export const vendorPanelSummary = {
  heading: "How professionals are selected and shown",
  text: "Professionals are assessed before admission to the PropITZ Recommended Vendor Panel. Where a listing fee applies, it is payable only after admission. The fee pays for Platform presence and does not buy admission, a higher organic ranking or customer leads. Organic ranking is based, in descending order, on service relevance, location/service coverage, applicable qualifications or registrations and scope fit, availability/responsiveness, service performance/customer feedback where sufficient data exists, and profile completeness. Listing fees are not a ranking factor. Sponsored placements, if introduced, will be clearly labelled.",
};

/** Label and explanation for professional cards (Part III, "Professional profile cards"). */
export const vendorPanelBadge = {
  label: "Recommended Vendor Panel",
  note: "Assessed for panel admission. Independent provider.",
  link: "See how selection and ranking work.",
};

/** The standalone page (Part III, "Recommended standalone Vendor Panel & Ranking Disclosure"). */
export const vendorPanelDisclosure: LegalDoc = {
  title: "Vendor Panel & Ranking Disclosure",
  intro: [
    "PropITZ operates a Recommended Vendor Panel of independent property professionals and service providers. Admission is based on PropITZ’s applicable assessment and onboarding criteria. Assessment occurs before payment.",
    "Where a listing or participation fee applies, the fee pays for Platform presence and panel-related services after admission. It does not buy admission, a higher organic rank, a guaranteed number of leads or a customer engagement.",
    "Organic ranking / matching factors, in descending order of importance, are: (1) service relevance to the user’s stated requirement; (2) geographic or service-area fit; (3) applicable qualifications, registrations or credentials and scope fit; (4) availability and responsiveness; (5) prior service performance, verified customer feedback and complaint history where sufficient data exists; and (6) completeness and currency of the profile.",
    "Listing fees are not an organic ranking factor. If sponsored placements are introduced, they will be clearly labelled and kept distinct from organic ranking.",
    "Professionals remain independent and responsible for their own advice, reports, licences, conduct and deliverables. Panel admission or “Recommended” status is not a guarantee of a particular outcome.",
  ],
  sections: [],
};
