/* ------------------------------------------------------------------ */
/*  Terms of Use and Privacy Policy.                                   */
/*                                                                     */
/*  Source: PropITZ_Updated_Terms_Privacy_Website_Wording_FINAL.docx   */
/*  (19 September 2026): Part I (Terms of Use) and Part II (Privacy     */
/*  Policy), published verbatim. Two changes from the document:        */
/*    - Privacy 18: the "[CREATE AND INSERT privacy@propitz.com…]"      */
/*      placeholder is replaced with enquire@propitz.com, the privacy  */
/*      and grievance contact the document itself gives in section 23. */
/*    - Privacy 23: "Grievences" corrected to "Grievances".            */
/*                                                                     */
/*  To adopt a later .docx, map it onto these types:                   */
/*    - numbered headings (1., 2.)      -> a section's `heading`        */
/*    - sub-headings / sub-clauses      -> that section's `subsections` */
/*    - paragraphs                      -> `body` (or `after` a list)   */
/*    - bullet points                   -> `list`                       */
/*    - numbered points (a, b / i, ii)  -> `list` with `ordered: true`  */
/*    - tables                          -> `table`                      */
/*  Then update LEGAL_UPDATED and LEGAL_VERSION (recorded against each  */
/*  new account at sign-up).                                            */
/* ------------------------------------------------------------------ */

/** Stored on each account at sign-up, so we know which text was accepted. */
export const LEGAL_VERSION = "2026-09-19";

export const LEGAL_UPDATED = "19 September 2026";

/** The date these pages were published on the site (the document's "[INSERT PUBLICATION DATE]"). */
export const LEGAL_EFFECTIVE = "19 September 2026";

export type LegalSection = {
  heading: string;
  /** Paragraphs before the list. */
  body?: string[];
  list?: string[];
  /** Number the list (a, b, c…) instead of using bullets. */
  ordered?: boolean;
  /** Paragraphs after the list. */
  after?: string[];
  /** A table, e.g. the retention schedule. The first column labels each row. */
  table?: { columns: string[]; rows: string[][] };
  /** Sub-clauses or sub-headings under this section. */
  subsections?: LegalSection[];
};

export type LegalDoc = {
  title: string;
  /** Optional lead paragraphs above the first section. */
  intro?: string[];
  sections: LegalSection[];
};

export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  sections: [
    {
      heading: "1. About these Terms",
      body: [
        "These Terms of Use (“Terms”) govern access to and use of the PropITZ website, any mobile or web application, account area, property marketplace, professional/vendor panel, digital tools, communication channels, and services made available under the PropITZ brand (collectively, the “Platform”). The Platform is operated by Peri Gold Developers Pvt Ltd, with registered office at Villa No 4, Sri Harsha, 30, Church Main Road, Perungudi, Chennai, Tamil Nadu 600096 (“PropITZ”, “Company”, “we”, “us” or “our”).",
        "These Terms are an electronic record under the Information Technology Act, 2000 and applicable rules. By creating an account, submitting a service request, purchasing a paid service, listing or enquiring about a property, applying to or participating in a professional/vendor panel, or otherwise using the Platform after being presented with these Terms, you agree to be bound by them, the Privacy Policy and any service-specific terms accepted by you.",
        "If a quotation, order form, statement of work, professional engagement letter, vendor-panel agreement, refund policy or other written term conflicts with these Terms, the service-specific or relationship-specific term prevails for that service or relationship to the extent of the conflict."
      ]
    },
    {
      heading: "2. Eligibility and authority",
      body: [
        "You must be at least 18 years old, competent to contract under the Indian Contract Act, 1872, and legally authorised to undertake the relevant property or service activity.",
        "If you use the Platform for a company, partnership, HUF, trust, association or another person, you represent that you have authority to act for and, where applicable, bind that person.",
        "You must provide accurate, current and complete information and keep account and contact information updated.",
        "You are responsible for maintaining the confidentiality of your login credentials and for activity carried out through your account, except to the extent caused by a security failure attributable to PropITZ."
      ]
    },
    {
      heading: "3. What PropITZ is and regulatory status",
      body: [
        "PropITZ is a property-services, facilitation and coordination platform. Depending on the service selected, PropITZ may explain process requirements, organise information and documents, coordinate independent professionals, provide case management, facilitate communications, provide digital tools, arrange on-ground assistance, enable seller and buyer enquiries, or host property and professional listings.",
        "PropITZ is not a law firm, surveying practice, valuation firm, architectural practice, accounting firm or government authority. Legal opinions, surveys, valuations, architectural or engineering advice, tax advice and other regulated or specialist deliverables are issued by the relevant independent professional, who remains responsible for that professional work.",
        "The regulatory requirements applicable to a service may depend on the property, transaction, parties and activity actually performed. Where a service or activity requires a licence, registration, professional qualification or other approval, PropITZ will provide or facilitate that activity only in accordance with applicable law and, where appropriate, through duly qualified or registered professionals or entities.",
        "The Platform does not represent that PropITZ holds any particular statutory registration unless the relevant registration details are expressly displayed on the Platform. Nothing on the Platform overrides a registration, licensing or regulatory requirement imposed by applicable law."
      ]
    },
    {
      heading: "4. Services",
      body: [
        "The Platform may offer property registration assistance; document and checklist guidance; property verification coordination; SRO process assistance; property advisory and requirement support; professional network access; transactional structuring support; negotiation and deal support; property marketplace and seller onboarding; free tools and property information resources; account features; and, when launched, Digital Property Workspace functions.",
        "PropITZ may add, change, suspend or discontinue features or services. Material changes affecting a paid service already accepted by you will be handled under the applicable service order and mandatory consumer law."
      ]
    },
    {
      heading: "5. Independent professionals",
      body: [
        "A professional introduced through PropITZ may be independent and not an employee, partner or agent of PropITZ unless expressly stated otherwise in writing.",
        "PropITZ may help define the scope, share context, schedule work, track progress and facilitate payment where agreed, but each professional remains responsible for their qualifications, registrations, licences, advice, reports and deliverables.",
        "Where a separate professional engagement letter or fee quote is required, you may need to accept it directly with the professional.",
        "A professional opinion may be limited by the records supplied, public records available, site access, search period and agreed scope. PropITZ does not convert a limited professional review into a guarantee.",
        "Confidential or privileged legal communications may need to be shared directly with the engaged advocate. PropITZ may receive copies needed for coordination unless you or the advocate direct otherwise."
      ]
    },
    {
      heading: "6. Recommended Vendor Panel, listing fees and ranking",
      body: [
        "The Platform may maintain a Recommended Vendor Panel or similar directory of independent professionals and service providers. Admission to the Panel is subject to PropITZ’s applicable assessment and onboarding process.",
        "Assessment precedes payment. A vendor or professional is not admitted merely because they are willing to pay a fee. Where a listing, subscription or participation fee applies, that fee becomes payable only after admission or conditional admission has been communicated.",
        "A listing or participation fee pays for the agreed Platform presence and related panel services. It does not guarantee admission, continued admission, a particular ranking or position, lead volume, engagement by a customer, renewal, endorsement of every service, or any commercial outcome.",
        "The label “Recommended” or “Empanelled” means that the professional or vendor satisfied PropITZ’s applicable panel criteria at the time of assessment or review. It is not a guarantee of quality, outcome, availability or error-free professional work, and it does not transfer professional responsibility to PropITZ.",
        "Where PropITZ orders, ranks, recommends or matches professionals, the principal organic ranking or matching parameters are, in descending order of importance unless a specific search context reasonably changes their relevance: (1) relevance of the professional category and service capability to the user’s stated requirement; (2) geographic/service-area fit; (3) qualifications, registrations or credentials applicable to the service and fit to the requested scope; (4) availability and responsiveness; (5) prior service performance, verified customer feedback and complaint history where sufficient information exists; and (6) completeness and currency of the professional profile.",
        "Listing, subscription or participation fees are not organic ranking factors. Paying a higher fee does not buy a higher organic position.",
        "If PropITZ introduces sponsored or promoted placement in future, the placement will be clearly identified as “Sponsored”, “Promoted” or equivalent and will be distinguished from organic ranking. Sponsored placement does not alter any assessment required for Panel admission.",
        "PropITZ may periodically reassess, suspend or remove a vendor or professional for expired or inaccurate credentials, material complaints, poor service performance, legal or regulatory issues, breach of panel terms, or other reasonable quality and platform-integrity grounds.",
        "Vendor-specific commercial terms, fee amounts, renewal terms, performance standards and removal consequences may be set out in a separate Vendor Panel Agreement."
      ]
    },
    {
      heading: "7. Property marketplace, seller onboarding and regulatory compliance",
      body: [
        "The property marketplace is intended to provide information and facilitate contact, verification coordination and transaction support. Property information may be supplied by owners, authorised representatives, promoters, developers, agents, professionals or other users.",
        "Any person listing a property represents that they own the property or are duly authorised to list it and communicate with prospective buyers.",
        "Property listings, seller onboarding, buyer coordination and transaction support are provided subject to applicable law and any registration requirements relevant to the property or transaction.",
        "Where the Real Estate (Regulation and Development) Act, 2016, Tamil Nadu RERA requirements or another law applies, the project, promoter, agent or other registration details required by law must be provided and remain valid.",
        "No user may list, market or facilitate a project that is legally required to be registered but is not registered, or make false claims regarding approvals, affiliation, title, authority or registration.",
        "PropITZ may request ownership, identity, authority, project, approval or regulatory documents and may refuse, suspend or remove a listing if information is missing, inconsistent, misleading, unverifiable or potentially unlawful.",
        "A listing is not an offer by PropITZ to sell property and does not by itself create a binding property transaction. Sale terms are agreed by the actual parties through appropriate agreements and registered instruments where required by law."
      ]
    },
    {
      heading: "8. Verification labels, reports and limitations",
      body: [
        "Any badge, status or wording such as “EC reviewed”, “Patta cross-checked”, “approval reviewed”, “legal opinion available”, “site survey completed” or “verified” applies only to the specific checks shown, the records available, the professional scope and the review date.",
        "A verification label does not mean that PropITZ guarantees marketable title, future approvals, possession, absence of litigation, boundary accuracy, unregistered claims or investment performance.",
        "Users must read the underlying scope or report, inspect the property where appropriate, confirm current government records and obtain independent professional advice before committing funds or entering into a transaction."
      ]
    },
    {
      heading: "9. Government records, public sources and free tools",
      body: [
        "PropITZ may assist with or explain information from TNREGINET, revenue records, local bodies, CMDA/DTCP, TNRERA, survey and revenue departments and other public sources. Unless expressly stated, PropITZ is not affiliated with or authorised to speak for a government department.",
        "Calculators, converters, guides and similar tools provide estimates or general information, not official assessments or professional advice.",
        "Government rates, guideline values, jurisdiction boundaries, fees, concessions and procedures may change. The applicable law, notification, government portal, office or authority prevails over a PropITZ summary or estimate."
      ]
    },
    {
      heading: "10. Accounts and security",
      body: [
        "You must use accurate registration information and maintain a secure password.",
        "You may not create an account using another person’s identity or access another user’s account without authority.",
        "Notify us promptly if you suspect unauthorised access or account compromise.",
        "We may require email or mobile verification, or additional identity checks for particular services where lawful and reasonably necessary.",
        "We may suspend an account to protect users, investigate fraud, comply with law or address a material breach of these Terms."
      ]
    },
    {
      heading: "11. User content, documents and authority to share",
      body: [
        "“User Content” includes property information, photographs, documents, messages, listings, reviews, comments, identity or authority documents and other materials submitted through the Platform.",
        "You retain ownership of your User Content, but grant PropITZ a limited, non-exclusive licence to host, reproduce, process, transmit and display it only as reasonably necessary to operate the Platform and provide the requested service.",
        "You represent that you have the right and lawful authority to submit the User Content and that doing so does not violate confidentiality, privacy, intellectual-property, contractual or other legal rights.",
        "If a property file contains personal data of co-owners, family members, sellers, buyers, witnesses or others, you must have lawful authority to share it for the requested property purpose.",
        "Do not upload forged, manipulated or misleading documents. PropITZ may preserve and disclose records where required by law or for fraud or security investigation."
      ]
    },
    {
      heading: "12. Prohibited conduct",
      body: [
        "You must not impersonate another person; submit false ownership, authority, approval, qualification, licence or registration claims; list a property without authority; knowingly conceal material facts; upload unlawful, defamatory, privacy-invasive, infringing or fraudulent material; use the Platform for unlawful payments, bribery, money laundering or document fraud; misuse contact details; scrape or disrupt the Platform; or otherwise violate applicable law, these Terms or a regulator’s order."
      ]
    },
    {
      heading: "13. Service requests, quotations and scope",
      body: [
        "Submitting “Start a Request”, contacting PropITZ on WhatsApp, asking for a callback, sending documents or creating an account does not by itself create a paid engagement. We may first review the requirement and provide a scope, quotation or service order.",
        "A quotation will identify, where applicable, the PropITZ service fee, known professional or pass-through charges, government fees, taxes, scope assumptions and expected timeline or dependencies.",
        "Government fees, stamp duty, registration charges, professional fees and third-party charges may be separate from the PropITZ fee unless the quotation expressly states otherwise.",
        "Timelines involving government authorities, third-party professionals, record availability or user responses are estimates and are not guaranteed.",
        "Material scope changes may require revised fees or timelines. We will communicate a revised scope before additional paid work is undertaken."
      ]
    },
    {
      heading: "14. Payments, taxes and invoices",
      body: [
        "Paid services must be paid using the methods shown in the quotation, invoice or Platform.",
        "Online payments may be processed by third-party payment providers. Unless the Platform expressly states otherwise, PropITZ does not receive or store complete card credentials, UPI PINs or banking authentication secrets.",
        "Applicable GST or other taxes will be added or included as stated on the invoice.",
        "Government fees or third-party professional fees paid through PropITZ may be collected as pass-through amounts where the quotation states so.",
        "A payment is not proof that a government filing, registration, approval, professional opinion or other statutory outcome has been granted."
      ]
    },
    {
      heading: "15. Cancellation and refunds",
      body: [
        "Unless a service-specific cancellation or refund policy states otherwise, the following principles apply, subject to mandatory consumer law.",
        "Before substantive work starts, you may request cancellation. PropITZ will refund the unearned PropITZ service fee after deducting any disclosed, lawful non-refundable charge or third-party amount already committed or paid on your instruction.",
        "After work starts, any refund will be based on the unperformed portion of the PropITZ scope after deducting work already performed and non-recoverable third-party or government costs.",
        "Government fees, stamp duty, registration fees and third-party professional charges are refundable only if the relevant authority or professional actually refunds them or the quotation expressly provides otherwise.",
        "If PropITZ cancels a paid service without user breach and cannot provide an agreed substitute, PropITZ will refund the unearned PropITZ service fee.",
        "Nothing in this clause limits non-waivable rights for deficient services, unfair trade practices or other rights under applicable consumer law."
      ]
    },
    {
      heading: "16. Communications and marketing",
      body: [
        "By submitting a service request, you authorise PropITZ to send service-related communications by email, phone, SMS, WhatsApp or another channel you select. Transactional communications may include request updates, document requirements, appointment information, security alerts, invoices and support messages.",
        "Marketing and promotional communications are separate from service communications and will be sent only where permitted by applicable law and your preference or consent. You may opt out of promotional communications using the method provided or by contacting us. Service-related communications necessary to fulfil an active request may continue while the service remains open."
      ]
    },
    {
      heading: "17. Reviews, feedback and complaints",
      body: [
        "If you submit a review or feedback, it must reflect your genuine experience and must not be fabricated, incentivised without disclosure, defamatory or misleading.",
        "PropITZ may moderate or remove reviews that violate law, these Terms, platform rules or reasonable authenticity standards.",
        "Customer feedback and complaint history may be used as one of several quality and ranking inputs for the Recommended Vendor Panel where sufficient and reliable information exists."
      ]
    },
    {
      heading: "18. Third-party sites and services",
      body: [
        "The Platform may link to government portals, maps, messaging applications, payment providers, professional websites or other third-party services. Those third parties operate under their own terms and privacy practices. PropITZ is not responsible for third-party availability, security, content or decisions, except to the extent liability cannot lawfully be excluded."
      ]
    },
    {
      heading: "19. Intellectual property",
      body: [
        "The PropITZ name, logos, interface, original text, software, design, databases, graphics and other Platform materials are owned by or licensed to PropITZ and are protected by applicable intellectual-property laws.",
        "You may use Platform content for personal or internal business use in connection with the services, but may not commercially exploit, scrape, republish or create derivative databases without permission."
      ]
    },
    {
      heading: "20. Automated or AI-assisted information",
      body: [
        "If PropITZ provides an AI assistant, automated checklist, generated summary or similar feature, the output is informational and may be incomplete or wrong. It is not a substitute for an advocate, surveyor, valuer, architect, engineer, accountant, government authority or other qualified professional.",
        "Material decisions must be verified using the relevant source records and professional advice."
      ]
    },
    {
      heading: "21. No guarantee of transaction or government outcome",
      body: [
        "PropITZ does not guarantee that a buyer or seller will transact, a price will be achieved, title will be accepted by every professional or lender, an SRO will accept a document, a government authority will issue or approve a record, a professional will reach a particular conclusion, or a property will appreciate.",
        "Outcomes depend on facts, documents, parties, market conditions, professionals and authorities outside PropITZ’s control."
      ]
    },
    {
      heading: "22. Disclaimer of warranties",
      body: [
        "To the maximum extent permitted by law, the Platform is provided on an “as available” basis. PropITZ does not warrant uninterrupted access, error-free operation, completeness of third-party information, or that public or government data will always be current.",
        "Nothing in these Terms excludes a warranty, statutory duty or consumer right that cannot lawfully be excluded."
      ]
    },
    {
      heading: "23. Limitation of liability",
      body: [
        "To the maximum extent permitted by law, PropITZ will not be liable for indirect, special, incidental, punitive or consequential loss, or for loss caused by materially inaccurate information supplied by a user or third party, a professional’s independent advice, a government delay or decision, market movement, cyber events outside reasonable control, or a user’s failure to conduct required due diligence.",
        "For a claim arising from a specific paid PropITZ service, PropITZ’s aggregate contractual liability will not exceed the PropITZ service fee actually paid for that specific service, except where a higher liability is required by law.",
        "Nothing in these Terms limits liability for fraud, wilful misconduct, liability that cannot lawfully be limited, or non-waivable rights under consumer or other applicable law."
      ]
    },
    {
      heading: "24. Indemnity",
      body: [
        "You agree to indemnify PropITZ against third-party claims, penalties, losses and reasonable costs arising from your unlawful use of the Platform, false listing or ownership or authority claims, forged or misleading documents, infringement of third-party rights, breach of regulatory requirements applicable to you, or material breach of these Terms.",
        "This indemnity does not apply to loss caused by PropITZ’s own unlawful or wrongful conduct."
      ]
    },
    {
      heading: "25. Suspension, removal and termination",
      body: [
        "PropITZ may suspend or remove content, listings, vendors or accounts where reasonably necessary for security, fraud prevention, legal compliance, professional quality, platform integrity or a material breach of these Terms or applicable relationship-specific terms.",
        "Where practicable, we will provide notice and an opportunity to correct a remediable issue unless immediate action is required by law, safety, fraud or security concerns.",
        "You may stop using the Platform and request account closure, subject to lawful retention of records and completion or settlement of open services.",
        "Provisions concerning payment, intellectual property, liability, disputes, records and other matters that by their nature need to continue will survive termination."
      ]
    },
    {
      heading: "26. Grievances, complaints and takedown requests",
      body: [
        "Consumer and Platform grievances may be submitted to the Grievance Officer identified below.",
        "Where the Consumer Protection (E-Commerce) Rules, 2020 apply, PropITZ will acknowledge consumer complaints within the period required by applicable law and work to redress them within the statutory period.",
        "For alleged intellectual-property infringement, privacy violation, impersonation, unlawful content or unauthorised listing, the complaint must include the relevant URL or listing, basis of the complaint, available supporting evidence and contact information sufficient for investigation."
      ]
    },
    {
      heading: "27. Consumer rights, governing law and dispute resolution",
      body: [
        "These Terms are governed by the laws of India.",
        "Nothing in these Terms restricts a consumer from approaching a competent Consumer Commission, regulator, statutory authority or court, or from exercising any non-waivable statutory remedy.",
        "Before commencing formal proceedings, the parties may attempt good-faith resolution through written notice and discussion, unless urgent relief or a statutory remedy is required.",
        "Subject to any mandatory or non-excludable jurisdiction, competent courts and tribunals at Chennai, Tamil Nadu will have jurisdiction over disputes arising from these Terms or the Platform.",
        "These public Terms do not create a general mandatory arbitration agreement. If PropITZ and a vendor, professional, business customer or other non-consumer party enter into a separate written agreement containing a valid arbitration clause, that clause will govern disputes under that separate agreement only."
      ]
    },
    {
      heading: "28. Changes to these Terms",
      body: [
        "We may update these Terms to reflect new services, legal requirements or operational changes. The “Last updated” date will be revised.",
        "Where a change materially affects registered users or an active paid service, PropITZ will provide additional notice where required by law or reasonably appropriate."
      ]
    },
    {
      heading: "29. General provisions",
      body: [
        "If a provision is held invalid, the remaining provisions continue in effect.",
        "A delay in enforcing a provision is not a waiver.",
        "PropITZ may assign these Terms as part of a lawful corporate restructuring, merger or transfer of the business, subject to applicable privacy and consumer law.",
        "These Terms, the Privacy Policy and accepted service-specific or relationship-specific terms constitute the agreement for use of the Platform and the relevant service or relationship."
      ]
    },
    {
      heading: "30. Contact and grievance details",
      body: [
        "PropITZ / Peri Gold Developers Pvt Ltd",
        "Registered office: Villa No 4, Sri Harsha, 30, Church Main Road, Perungudi, Chennai, Tamil Nadu 600096",
        "General enquiries & Grievances: enquire@propitz.com | WhatsApp: +91 89258 76765 | Website: www.propitz.com"
      ]
    }
  ],
};

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  sections: [
    {
      heading: "1. Who we are and scope",
      body: [
        "This Privacy Policy explains how Peri Gold Developers Pvt Ltd, operating the PropITZ platform (“PropITZ”, “we”, “us”, “our”), collects, uses, shares, stores and protects personal data when you visit www.propitz.com, create an account, use a tool, submit a property or service request, upload documents, list or enquire about property, apply to or participate in the Recommended Vendor Panel, communicate with us, or use services offered through PropITZ.",
        "This Policy is intended to comply with the Information Technology Act, 2000 and currently applicable Indian data-protection requirements. The Digital Personal Data Protection Act, 2023 is being brought into force in phases, and PropITZ will update its notices, consent flows and rights processes as additional provisions become operative."
      ]
    },
    {
      heading: "2. Personal data we collect",
      body: [
        "Depending on how you use the Platform, we may collect identity and contact data such as name, email, mobile number, WhatsApp number, address, preferred language or contact channel and account identifiers.",
        "We may collect account and authentication data such as login email or mobile number, password hash or authentication tokens, verification status and security events.",
        "We may collect property and service data such as property location, survey number, extent, property type, ownership or transaction details, requirements, seller or buyer preferences, asking or offer information, service scope and case status.",
        "We may collect property documents such as title or parent deeds, Encumbrance Certificates, Patta or related revenue records, FMB or survey material, approvals, tax receipts, agreements, identity and PAN documents, legal-heir or power-of-attorney documents and other records reasonably required for a requested service.",
        "We may collect professional and vendor data such as qualifications, registrations or licence information, firm details, service categories, service areas, experience, profile information, photographs, availability, communications, service-performance information, customer feedback, complaint records, panel status, listing fee or subscription information and ranking or matching inputs.",
        "We may collect transaction and payment data such as quotations, invoices, payment status, refunds, GST or tax information and transaction references. Complete card credentials, UPI PINs and banking authentication secrets are ordinarily handled by the relevant payment provider rather than PropITZ.",
        "We may collect communications such as emails, WhatsApp messages, callback preferences, support messages, complaints and call notes or recordings where lawful and appropriately notified.",
        "We may collect technical and usage data such as IP address, device and browser information, login and security events, cookies, page interactions, referral source and diagnostic logs.",
        "We may collect city, locality or property location and, only where a feature requires it and you permit it, device-based location.",
        "We may keep records of Terms and Privacy acceptance, communication preferences, marketing choices, consent withdrawal and related compliance records.",
        "PropITZ does not ordinarily require biometric data, health information or similarly unrelated sensitive data for its property-services model. Do not upload unnecessary sensitive information. Where identity proof is genuinely required, use masked or limited identification where appropriate and lawful."
      ]
    },
    {
      heading: "3. Where we get personal data",
      body: [
        "We obtain personal data directly from you when you register, submit a form, upload a file, list property, request a service, apply to the Vendor Panel or communicate with us.",
        "We may receive data from a person authorised by you, such as a family member, employee, broker, advocate or representative; from sellers, buyers, promoters, professionals or service partners involved in a case; from lawfully accessible public or government records relevant to a service; automatically from devices, security logs, cookies and analytics tools; and from payment, identity-verification, communication, CRM or other vendors used to provide the service."
      ]
    },
    {
      heading: "4. Why we use personal data",
      body: [
        "We use personal data to create and secure accounts; respond to enquiries and provide quotations; identify service scope and property or document requirements; coordinate independent professionals; carry out property and document verification workflows; manage SRO, registration and document processes; provide case updates; enable property listings, seller and buyer enquiries and marketplace communications; assess and administer professional or vendor-panel participation; match and rank professionals according to disclosed parameters; provide tools and resources; process payments, invoices, refunds and tax records; prevent fraud and maintain cybersecurity; handle complaints and legal claims; comply with legal or regulatory requests; improve the Platform using appropriately limited analytics; and send marketing only where permitted by law and your communication choices."
      ]
    },
    {
      heading: "5. Consent and other lawful processing",
      body: [
        "Where applicable law requires consent, PropITZ will seek a clear affirmative choice for the specified purpose. Consent for an account or requested property service is separate from consent for unrelated marketing.",
        "Some processing may be necessary to take steps at your request, perform a service you ordered, comply with law, prevent fraud or security incidents, respond to emergencies, establish or defend legal claims, or rely on another lawful basis recognised by applicable law.",
        "As additional operative provisions of the Digital Personal Data Protection Act, 2023 take effect, PropITZ will apply the notice, consent, legitimate-use and rights requirements then in force."
      ]
    },
    {
      heading: "6. Property documents and third-party personal data",
      body: [
        "Property files often contain personal data about people other than the person uploading them. If you upload documents containing data of a co-owner, seller, buyer, family member, witness, attorney, tenant or another person, you confirm that you are authorised to share the document for the requested property purpose.",
        "PropITZ requests documents that are reasonably relevant to the requested service. Access to case material is limited to personnel and independent professionals who need the information for the relevant service or authorised operational purpose.",
        "Property documents and identity documents are not used for unrelated marketing.",
        "Where confidential material can be shared directly with an independent professional, PropITZ may facilitate direct sharing.",
        "Users must avoid uploading unnecessary identity numbers, unrelated pages or data that is not needed for the requested service."
      ]
    },
    {
      heading: "7. Recommended Vendor Panel and ranking data",
      body: [
        "For a professional or vendor applying to or participating in the Recommended Vendor Panel, PropITZ may process identity, business, qualification, registration or licence, service-area, experience, profile, fee, payment, availability, performance, customer-feedback, complaint and panel-status information.",
        "PropITZ uses relevant professional or vendor data to assess eligibility, administer panel participation, present public profiles, respond to customer requests, match professionals to requirements, maintain quality standards, investigate complaints and determine organic ranking or prominence using the parameters disclosed in the Terms and on the Platform.",
        "Listing or participation fee information is used for billing and panel administration. Listing fees are not used as an organic ranking factor.",
        "Public professional profiles may display business or professional information reasonably necessary for customers to understand the provider, such as name, profession or category, service area, experience, qualifications or registrations where appropriate, profile photograph, service description and feedback or rating where the Platform provides it."
      ]
    },
    {
      heading: "8. When we share personal data",
      body: [
        "We may share personal data only as reasonably necessary with independent professionals engaged or introduced for a requested service; the other transaction party or authorised representative when you ask us to facilitate contact; government offices or authorities where you instruct us to coordinate a lawful process; technology providers supporting hosting, database, authentication, CRM, email, analytics, messaging, maps, document storage, cybersecurity and support; payment gateways, banks, accountants and tax or compliance providers where paid services are enabled; insurers, auditors, professional advisers or prospective corporate transferees under appropriate confidentiality obligations; and courts, regulators, law-enforcement agencies, CERT-In or other authorities where disclosure is required or permitted by law.",
        "If you ask PropITZ to introduce you to a property owner, buyer, seller, professional or vendor, the Platform may share the contact and requirement information reasonably necessary to make that introduction. Before or at the point of sharing, the Platform will identify the recipient or relevant recipient category where appropriate for the service.",
        "We do not sell personal data to advertisers. Independent professionals and service providers are not permitted to use PropITZ case information for unrelated marketing unless they have their own lawful basis and, where required, your consent."
      ]
    },
    {
      heading: "9. Independent professionals as separate data handlers",
      body: [
        "An advocate, surveyor, valuer, architect, accountant or other professional may independently determine how they process data necessary for their professional engagement and may have separate legal or professional confidentiality duties. Their own privacy notice or engagement terms may apply to that professional service.",
        "PropITZ remains responsible for personal-data processing carried out by PropITZ itself."
      ]
    },
    {
      heading: "10. Payments",
      body: [
        "Where online payments are enabled, payment providers may collect card, UPI, bank or authentication information under their own privacy and security terms.",
        "PropITZ ordinarily receives transaction amount, status, reference and payer or invoice information needed for reconciliation, support, fraud prevention and legal or tax records rather than complete payment credentials."
      ]
    },
    {
      heading: "11. Cookies, analytics and similar technologies",
      body: [
        "The Platform may use strictly necessary cookies for login, session security and essential functions; preference cookies to remember settings; analytics tools to understand use and improve services; and marketing or advertising technologies only if enabled and lawfully used.",
        "If non-essential tracking is enabled, PropITZ will provide any consent or preference controls required by applicable law. Continued browsing will not be treated as blanket consent where affirmative consent is required."
      ]
    },
    {
      heading: "12. WhatsApp, email, SMS and calls",
      body: [
        "If you contact PropITZ on WhatsApp or choose WhatsApp, callback, SMS or email as your preferred channel, communications are also processed through the relevant telecommunications or messaging provider under that provider’s terms.",
        "PropITZ may use the selected channel for an active request. Promotional communications remain subject to applicable law and your communication choices."
      ]
    },
    {
      heading: "13. Data storage and international processing",
      body: [
        "PropITZ may use cloud, communication, analytics and support providers that process data in India or other jurisdictions.",
        "PropITZ will comply with applicable Indian restrictions or requirements concerning data processing and cross-border transfer as they apply from time to time, and will use contractual and security measures appropriate to the vendor and data involved."
      ]
    },
    {
      heading: "14. How long we keep personal data",
      body: [
        "PropITZ keeps personal data only for as long as reasonably necessary for the stated purpose, service delivery, legal obligations, fraud and security, accounting and tax records, complaint handling and defence of legal claims. We apply different periods to different categories rather than treating all records as subject to one retention period.",
        "Where a legal proceeding, complaint, investigation, audit, tax matter or regulatory hold is open, relevant records may be retained until the matter and any required preservation period are complete.",
        "When retention ends, PropITZ will securely delete, de-identify or irreversibly anonymise the data unless further retention is required by law."
      ],
      subsections: [
        {
          heading: "Indicative retention schedule",
          table: {
            columns: [
              "Data / record category",
              "Baseline retention",
              "Notes"
            ],
            rows: [
              [
                "Enquiry / callback lead",
                "Up to 24 months after the last meaningful interaction",
                "Delete earlier where no continuing purpose exists; convert to case record if a service opens."
              ],
              [
                "Account profile",
                "While active + up to 3 years after closure",
                "Shorten on valid deletion request unless legal, security or dispute retention is required."
              ],
              [
                "Service case management records",
                "Up to 5 years after case closure",
                "Operational period for complaints and claim defence; extend only for an open dispute, legal hold or specific statutory duty."
              ],
              [
                "Uploaded property / identity documents",
                "Active case + ordinarily up to 12 months after closure",
                "Retain longer only for an active service, user-requested Workspace storage, dispute/legal hold, or specific legal requirement."
              ],
              [
                "Digital Property Workspace documents",
                "While the Workspace/property record remains active or until user deletion",
                "Subject to legal holds and records that must be preserved separately."
              ],
              [
                "Vendor / professional panel records",
                "During panel participation + up to 5 years after exit",
                "Supports complaints, credential history and quality/compliance records; financial records follow statutory periods."
              ],
              [
                "Invoices / accounting / tax records",
                "For the applicable statutory period; corporate books may require at least 8 financial years",
                "GST and income-tax periods differ and may extend where proceedings are open."
              ],
              [
                "Marketing preference / opt-out",
                "Until the preference changes; minimal suppression record as needed",
                "Maintains the user’s opt-out and prevents accidental re-marketing."
              ],
              [
                "Security / ICT logs",
                "At least 180 days within India where CERT-In directions apply",
                "May be longer for an active incident or investigation."
              ],
              [
                "Abandoned uploads / incomplete drafts",
                "Normally 30–90 days",
                "Delete if not needed for recovery, security or fraud investigation."
              ]
            ]
          }
        }
      ]
    },
    {
      heading: "15. Security practices",
      body: [
        "PropITZ maintains reasonable administrative, technical and organisational security practices designed to protect personal data against unauthorised access, disclosure, alteration, loss or misuse.",
        "Access to property and identity documents is restricted according to role and service need. PropITZ maintains authentication, access-control, logging, backup and incident-response measures appropriate to the relevant system and risk.",
        "No internet or storage system can be guaranteed to be completely secure. Users must use strong credentials, secure devices and avoid sending unnecessary sensitive material."
      ]
    },
    {
      heading: "16. Security incidents",
      body: [
        "PropITZ maintains a process for identifying, assessing and responding to information-security and personal-data incidents.",
        "Where an incident triggers reporting or notification duties under CERT-In directions, the Information Technology Act framework, the Digital Personal Data Protection framework when applicable, or another law, PropITZ will follow the legally required process and timeframe. User notification will be provided where required by law or reasonably necessary to reduce material risk."
      ]
    },
    {
      heading: "17. Your choices and rights",
      body: [
        "Subject to applicable law and the stage of commencement of the Digital Personal Data Protection Act, you may ask to access or obtain information about personal data held by PropITZ, correct or update inaccurate data, request erasure where the data is no longer required and no legal retention ground applies, withdraw consent for consent-based processing, stop promotional communications, close your account and raise a grievance.",
        "Withdrawal of consent does not affect processing lawfully completed before withdrawal and may prevent PropITZ from continuing a service that requires the relevant data.",
        "As additional DPDP rights become legally operative, PropITZ will update its processes to support the rights then in force."
      ]
    },
    {
      heading: "18. Account deletion and privacy requests",
      body: [
        "Privacy and account requests may be submitted to enquire@propitz.com or through a privacy or account-deletion form when available.",
        "PropITZ may verify your identity before providing access, correction or deletion to protect against unauthorised requests.",
        "We will respond within the period required by applicable law and will explain if a lawful retention exception prevents immediate deletion."
      ]
    },
    {
      heading: "19. Children",
      body: [
        "The Platform is intended for adults who can enter into property and service contracts. PropITZ does not knowingly offer account-based property services to persons under 18.",
        "If PropITZ learns that a child’s personal data has been collected in circumstances that do not comply with applicable law, PropITZ will take appropriate steps to delete, restrict or otherwise regularise the processing as required."
      ]
    },
    {
      heading: "20. Legal and regulatory disclosures",
      body: [
        "PropITZ may preserve or disclose information when reasonably necessary to comply with a court order, statutory notice, government or regulatory request, tax or accounting duty, RERA or consumer-law obligation, cybersecurity direction, investigation of fraud or impersonation, or to establish, exercise or defend legal claims.",
        "PropITZ will limit disclosure to information reasonably relevant to the lawful request or purpose."
      ]
    },
    {
      heading: "21. Third-party websites and services",
      body: [
        "Links to TNREGINET, TNRERA, government sites, Google Maps, WhatsApp, payment gateways or other third-party services are governed by those third parties’ privacy practices. PropITZ does not control their privacy or security practices."
      ]
    },
    {
      heading: "22. Changes to this Policy",
      body: [
        "We may update this Policy for legal, operational or service changes. The “Last updated” date will be revised.",
        "Where a change materially alters how previously collected personal data is used and applicable law requires additional notice or consent, PropITZ will provide it."
      ]
    },
    {
      heading: "23. Privacy and grievance contacts",
      body: [
        "Peri Gold Developers Pvt Ltd / PropITZ",
        "Registered office: Villa No 4, Sri Harsha, 30, Church Main Road, Perungudi, Chennai, Tamil Nadu 600096",
        "Privacy contact & Grievances: enquire@propitz.com",
        "General contact: enquire@propitz.com | WhatsApp: +91 89258 76765",
        "Where applicable law provides a right to approach a Consumer Commission, Data Protection Board, regulator or other authority, nothing in this Policy restricts that right."
      ]
    }
  ],
};
