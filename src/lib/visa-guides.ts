/**
 * Global Mobilis — Visa Step-by-Step Guides
 *
 * Real visa pathways for the featured destinations: document checklists,
 * timelines, costs (local currency) and official government links.
 * The `destinationId` matches the destination IDs in src/lib/destinations.ts.
 */
export type Difficulty = "easy" | "moderate" | "hard";

export interface VisaStep {
  stepNumber: number;
  title: string;
  description: string;
  documents: string[];
  timeframe: string;
  cost: string;
  tips: string;
  officialUrl: string;
}

export interface VisaGuide {
  id: string;
  destinationId: string; // matches destinations.ts IDs; "" = general
  city: string;
  country: string;
  flag: string;
  visaType: string;
  overview: string;
  eligibility: string[];
  steps: VisaStep[];
  totalTimeframe: string;
  totalCost: string;
  difficulty: Difficulty;
  lastUpdated: string;
}

export const VISA_GUIDES: VisaGuide[] = [
  // ═══════════════ Toronto — Express Entry (FSW) ═══════════════
  {
    id: "toronto-express-entry",
    destinationId: "1",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    visaType: "Express Entry (Federal Skilled Worker)",
    overview:
      "Canada's flagship points-based system for skilled workers. You build a profile in the Express Entry pool, are ranked by Comprehensive Ranking System (CRS) points, and the highest-ranked candidates receive Invitations to Apply (ITAs) in regular draws. No job offer required — but points for one help.",
    eligibility: [
      "Skilled work experience: at least 1 year (continuous, paid, NOC TEER 0/1/2/3) in the last 10 years",
      "Language: CLB 7 minimum in English (IELTS) or French (TEF/TEF Canada)",
      "Education: Canadian credential or foreign credential assessed (ECA)",
      "Funds: proof of settlement funds (~CAD 14,690 for one person, 2026)",
      "Age 18+; under 30 earns maximum age points",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Take an approved language test",
        description:
          "Book IELTS (General Training) or CELPIP for English, or TEF Canada for French. Results are valid 2 years and convert into CRS points.",
        documents: ["IELTS or CELPIP result", "Passport (all pages)"],
        timeframe: "1–2 weeks to book, results in ~3–13 days",
        cost: "$300–$350 CAD",
        tips: "Aim for CLB 9+ (IELTS 8/7/7/7) — the jump from CLB 7 to 9 is worth up to 50+ CRS points.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/language-requirements.html",
      },
      {
        stepNumber: 2,
        title: "Get your education assessed (ECA)",
        description:
          "Have your foreign degree or diploma assessed by a designated organization (WES, ICAS, IQAS…) to prove it equals a Canadian credential.",
        documents: ["Degree/diploma transcripts", "Degree certificate", "WES application receipt"],
        timeframe: "4–8 weeks",
        cost: "$200–$400 CAD",
        tips: "WES is the most common choice; order a duplicate transcript from your university first — it's the slowest part.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html",
      },
      {
        stepNumber: 3,
        title: "Create your Express Entry profile",
        description:
          "Submit an online profile in the Express Entry system within 60 days of completing language + ECA. You'll be ranked in the pool and can update the profile anytime before an ITA.",
        documents: ["Passport", "Language test results", "ECA report", "National ID"],
        timeframe: "Same day (profile goes live immediately)",
        cost: "Free",
        tips: "Be 100% accurate — any discrepancy found later can result in a refusal and a 5-year ban for misrepresentation.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      },
      {
        stepNumber: 4,
        title: "Receive an Invitation to Apply (ITA)",
        description:
          "IRCC holds draws roughly every 2 weeks. If your CRS score clears the cutoff, you get an ITA — you then have 60 days to submit a full application.",
        documents: ["ITA letter", "Profile documents (updated)"],
        timeframe: "Varies — draws every ~2 weeks",
        cost: "Free",
        tips: "Watch cutoff trends (2024–2025 cutoffs hovered ~500–540). A provincial nomination adds 600 CRS points — look at Ontario's HCP streams.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile.html",
      },
      {
        stepNumber: 5,
        title: "Submit your full application & pay fees",
        description:
          "Complete the online application within 60 days: upload all documents, pay processing + Right of Permanent Residence fees, and book biometrics.",
        documents: [
          "Police certificates (all countries lived in 6+ months since 18)",
          "Medical exam (panel physician)",
          "Proof of funds (bank statements, 6 months)",
          "Employment reference letters (NOC duties + hours)",
          "Digital photos",
        ],
        timeframe: "60 days to submit; processing ~4–6 months",
        cost: "$1,525 CAD processing + $515 CAD RPRF + $170 CAD biometrics",
        tips: "Reference letters must list duties matching the NOC description — vague letters are the #1 cause of refusals.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/apply-permanent-residence.html",
      },
      {
        stepNumber: 6,
        title: "Get approved & land in Canada",
        description:
          "Once approved you receive a Confirmation of Permanent Residence (COPR) and must 'land' in Canada before the COPR expiry date to activate PR status.",
        documents: ["COPR", "Valid passport", "Proof of funds (on arrival)"],
        timeframe: "COPR valid until passport expiry or 1 year",
        cost: "Free",
        tips: "You can land at any Canadian port of entry. Toronto Pearson is the easiest if you're already flying there — do a 'flagpole' only if experienced.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants.html",
      },
    ],
    totalTimeframe: "6–12 months from profile to PR",
    totalCost: "$2,500–$5,000 CAD (incl. tests & ECA)",
    difficulty: "moderate",
    lastUpdated: "2026-06",
  },

  // ═══════════════ Toronto — Study → PGWP → PR ═══════════════
  {
    id: "toronto-study-pgwp-pr",
    destinationId: "1",
    city: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    visaType: "Study Permit → PGWP → Permanent Residence",
    overview:
      "The classic study-then-work pathway. Study at a Designated Learning Institution (DLI), work during and after your studies on a Post-Graduation Work Permit (PGWP), then convert Canadian study + work experience into PR via Express Entry (Canadian Experience Class).",
    eligibility: [
      "Letter of acceptance from a Designated Learning Institution (DLI)",
      "Proof of funds: tuition + living costs (~CAD 20,635/yr for one person, 2026)",
      "Intention to leave Canada at the end of the stay (for study permit)",
      "PGWP requires graduating from a DLI program ≥ 8 months (eligible programs only)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Get accepted into a DLI program",
        description:
          "Apply to an eligible program (≥ 8 months, PGWP-eligible) at a Canadian DLI. Conestoga, Seneca, Humber, U of T, Ryerson/TMU — check the DLI list for PGWP eligibility.",
        documents: ["Application form", "Transcripts", "IELTS/TOEFL score", "Statement of purpose", "Passport"],
        timeframe: "3–6 months before intake",
        cost: "Application fees $50–$250 CAD; tuition $15k–$45k CAD/yr",
        tips: "Programs ≥ 2 years earn a 3-year PGWP — the sweet spot for PR points.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html",
      },
      {
        stepNumber: 2,
        title: "Apply for the study permit",
        description:
          "Apply online for a study permit with your letter of acceptance, proof of funds, and a letter of explanation. Attend biometrics and possibly an interview at a visa office.",
        documents: ["Letter of acceptance", "Proof of funds (tuition + living)", "Medical exam (if required)", "Police certificate (if required)", "Letter of explanation"],
        timeframe: "Processing 4–14 weeks (varies by country)",
        cost: "$150 CAD permit + $85 CAD biometrics",
        tips: "Apply the day you have your acceptance letter — processing can be slow in high-volume seasons (summer).",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html",
      },
      {
        stepNumber: 3,
        title: "Study & work part-time",
        description:
          "Study full-time. You can work up to 24 hrs/week off-campus during term and full-time during breaks (2024+ rules) — the experience counts toward your future PR application.",
        documents: ["Study permit", "SIN number (Service Canada)", "Enrolment letter"],
        timeframe: "1–4 years of study",
        cost: "Tuition as above",
        tips: "Get your Social Insurance Number (SIN) in your first week — you can't legally work without it.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html",
      },
      {
        stepNumber: 4,
        title: "Graduate & apply for the PGWP",
        description:
          "Within 180 days of graduation, apply for the Post-Graduation Work Permit. It's valid up to 3 years depending on program length. You can work full-time while it's processing.",
        documents: ["Completion letter / transcript", "Proof of program length", "Study permit", "Passport"],
        timeframe: "Processing ~3–5 months (work full-time meanwhile)",
        cost: "$255 CAD + $85 CAD biometrics",
        tips: "The PGWP is an open work permit — you can work for any employer in any occupation.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html",
      },
      {
        stepNumber: 5,
        title: "Gain skilled work experience",
        description:
          "Work 12+ months in a NOC TEER 0/1/2/3 job to qualify for Canadian Experience Class under Express Entry.",
        documents: ["Employment reference letters", "Pay stubs", "T4 / Notice of Assessment"],
        timeframe: "12–24 months",
        cost: "Free",
        tips: "Canadian work experience is worth 40 CRS points per year (up to 80) and is the single strongest CRS lever you control.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/canadian-experience-class.html",
      },
      {
        stepNumber: 6,
        title: "Apply for permanent residence",
        description:
          "Create an Express Entry profile with your Canadian experience, get an ITA, and submit your PR application — same process as the FSW guide.",
        documents: ["Same as Express Entry application set", "Canadian experience proof", "Language test (CLB 7+)"],
        timeframe: "6–12 months",
        cost: "$1,525 CAD + $515 CAD RPRF",
        tips: "Most international students go this route — start your Express Entry profile as soon as you hit 12 months of skilled work.",
        officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      },
    ],
    totalTimeframe: "2–4 years (study) + 1–2 years (work) + 6–12 months (PR)",
    totalCost: "$30,000–$90,000 CAD (tuition + fees)",
    difficulty: "moderate",
    lastUpdated: "2026-06",
  },

  // ═══════════════ Berlin — Freelance Visa (Freiberufler) ═══════════════
  {
    id: "berlin-freiberufler",
    destinationId: "4",
    city: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    visaType: "Freelance Visa (Freiberufler, §21 AufenthG)",
    overview:
      "A residence permit for self-employed and freelance workers in Germany — perfect for creatives, IT professionals, consultants, and other 'freiberufliche' (liberal profession) activities. Berlin's Ausländerbehörde is famously freelancer-friendly.",
    eligibility: [
      "A freelance occupation recognised in Germany (IT, design, consulting, writing, art, teaching…)",
      "A viable business plan with concrete client prospects (German/EU clients preferred)",
      "Proof of income to cover living costs (~€1,200+/month after fixed costs)",
      "Valid health insurance (public or private) covering Germany",
      "EU/EEA/Swiss nationals don't need this permit",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Prepare your freelance portfolio & client list",
        description:
          "Compile proof of your work: CV, portfolio, certificates, and — critically — letters of intent or contracts from clients (German and international). Concrete client interest is what wins the permit.",
        documents: ["CV", "Portfolio/work samples", "Client letters of intent / contracts", "Degree or work certificates"],
        timeframe: "2–4 weeks",
        cost: "Free",
        tips: "Ask German clients for a simple signed 'Auftragsbestätigung' — a German client letter is worth more than 10 foreign ones.",
        officialUrl: "https://service.berlin.de/dienstleistung/120687/",
      },
      {
        stepNumber: 2,
        title: "Book your appointment at the Ausländerbehörde",
        description:
          "Book an appointment with Berlin's immigration office (Landesamt für Einwanderung, LEA). Appointments are scarce — book as early as possible, or try the walk-in hours / email slot release.",
        documents: ["Completed application form", "Passport + 2 biometric photos", "Proof of address (Anmeldung)"],
        timeframe: "4–12 weeks for an appointment",
        cost: "Appointment free",
        tips: "Check the LEA website at 8am on appointment-release days — slots go in minutes. An immigration lawyer can sometimes get earlier slots.",
        officialUrl: "https://www.berlin.de/einwanderung/en/",
      },
      {
        stepNumber: 3,
        title: "Sort out health insurance & finances",
        description:
          "Take out German health insurance (public e.g. TK, or private like Feather/Care Concept for the start). Open a German bank account — the LEA wants to see your money in Germany.",
        documents: ["Health insurance certificate", "Bank statements (3–6 months)", "Tax registration (Finanzamt form)"],
        timeframe: "1–2 weeks",
        cost: "Insurance from ~€120–€400/month",
        tips: "Start with a cheap private plan (e.g. Care Concept ~€85/mo) then switch to public once income is steady — TK (Techniker Krankenkasse) is freelancer-friendly.",
        officialUrl: "https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/17-gk-gesundheitsversicherung/606712",
      },
      {
        stepNumber: 4,
        title: "Attend the appointment & submit your application",
        description:
          "Present your portfolio, client letters, insurance and financial proof. The officer checks viability; you may be asked questions about your business plan. Fee is paid at the office.",
        documents: ["All prepared documents", "Business plan (recommended)", "Proof of pension liability (optional)"],
        timeframe: "Same day; decision usually on the spot or within weeks",
        cost: "€100–€110 permit fee",
        tips: "Bring TWO copies of everything. If you lack a client, an 'ich werde beraten' letter from a tax advisor helps.",
        officialUrl: "https://service.berlin.de/dienstleistung/120687/",
      },
      {
        stepNumber: 5,
        title: "Register with the tax office & invoice",
        description:
          "Once approved, register with your Finanzamt (tax office), get a tax number, and start invoicing. Freelancers submit quarterly VAT returns (Umsatzsteuervoranmeldung).",
        documents: ["Residence permit", "Anmeldung certificate", "Tax registration form (Fragebogen)"],
        timeframe: "1–2 weeks for tax number",
        cost: "Free (taxes depend on income)",
        tips: "The Finanzamt letter takes 2–6 weeks — invoice with your tax number once it arrives; you can invoice before with 'USt-IdNr. wird nachgereicht'.",
        officialUrl: "https://www.berlin.de/sen/finanzen/steuern/",
      },
      {
        stepNumber: 6,
        title: "Renew & build toward permanent residence",
        description:
          "Freelance permits are usually issued for 1–3 years. After 4+ years (and pension contributions) you may qualify for permanent residence (Niederlassungserlaubnis).",
        documents: ["Updated client letters", "Tax returns", "Proof of pension contributions"],
        timeframe: "Renewal every 1–3 years",
        cost: "Renewal ~€100",
        tips: "Keep meticulous records of client payments — renewals hinge on showing stable income.",
        officialUrl: "https://www.berlin.de/einwanderung/en/",
      },
    ],
    totalTimeframe: "2–4 months from start to permit",
    totalCost: "€300–€600 + ~€150–400/month insurance",
    difficulty: "moderate",
    lastUpdated: "2026-06",
  },

  // ═══════════════ Dubai — Freelance Permit + Residence Visa ═══════════════
  {
    id: "dubai-freelance",
    destinationId: "8",
    city: "Dubai",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    visaType: "Freelance Permit + Residence Visa",
    overview:
      "Work as an independent contractor in Dubai through a free zone (gofreelance.ae by TECOM, Dubai Media City, Dubai Internet City, or Dubai Development Authority). The freelance permit + 2-year residence visa lets you live in the UAE tax-free with full banking.",
    eligibility: [
      "Freelance occupation within the free zone's allowed categories (media, tech, design, education…)",
      "No local sponsor needed — the free zone sponsors you",
      "Valid passport (6+ months validity)",
      "Clean criminal record (for the security check)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Choose your free zone & freelance category",
        description:
          "Pick a free zone: gofreelance.ae (TECOM) for media/tech, Dubai Development Authority for creative/tech, or IFZA/SHAMS for general. Confirm your occupation is in the allowed list.",
        documents: ["Passport copy", "Passport photos (white background)", "Portfolio / experience certificates"],
        timeframe: "1–2 days",
        cost: "Application check free",
        tips: "gofreelance.ae is the simplest online flow — most people get approved in 3–5 working days.",
        officialUrl: "https://gofreelance.ae/",
      },
      {
        stepNumber: 2,
        title: "Apply for the freelance permit",
        description:
          "Submit your application online with the free zone. They run a background check and issue your freelance license (usually a 'Media Freelance Permit' or 'DDA Permit').",
        documents: ["Passport (6+ months valid)", "Photo", "CV/portfolio", "Existing client contracts (recommended)"],
        timeframe: "3–7 working days",
        cost: "AED 7,500–13,000/year (permit + packages)",
        tips: "Annual packages often bundle medical insurance — compare total cost, not just the permit fee.",
        officialUrl: "https://gofreelance.ae/apply",
      },
      {
        stepNumber: 3,
        title: "Enter the UAE & get your entry permit",
        description:
          "With the freelance license approved, apply for an entry permit (visit visa) to fly into the UAE and start the residence process. Some packages include the entry permit.",
        documents: ["Approved freelance license", "Entry permit application", "Passport"],
        timeframe: "2–5 working days",
        cost: "AED 400–800 (often included)",
        tips: "Entering on the free zone's entry permit (not a tourist visa) lets you convert to residency without leaving the country.",
        officialUrl: "https://www.gdrfad.gov.ae/",
      },
      {
        stepNumber: 4,
        title: "Medical screening & Emirates ID",
        description:
          "Undergo the mandatory medical fitness test (blood panel + chest X-ray) at an approved centre, and apply for your Emirates ID (biometrics).",
        documents: ["Entry permit", "Passport", "Medical test result", "Emirates ID application form"],
        timeframe: "3–5 working days",
        cost: "Medical ~AED 250–500; Emirates ID ~AED 370 (2-year)",
        tips: "Avoid alcohol and heavy meals 24h before the medical — 'unsuitable' results trigger a retest delay.",
        officialUrl: "https://www.emiratesid.ae/",
      },
      {
        stepNumber: 5,
        title: "Stamp your residence visa",
        description:
          "Once medical + ID are approved, your residence visa is stamped into your passport (or issued digitally). You're now a Dubai resident — open a bank account, sign a tenancy, and enjoy zero income tax.",
        documents: ["Passport (for stamping)", "Freelance license", "Medical + Emirates ID results"],
        timeframe: "2–5 working days",
        cost: "Stamping ~AED 800–1,500 (varies by zone)",
        tips: "Use the ICP (Federal Authority for Identity) smart services — most steps can be done online without visiting a typing centre.",
        officialUrl: "https://icp.gov.ae/en/",
      },
    ],
    totalTimeframe: "3–6 weeks from application to residency",
    totalCost: "AED 9,000–15,000 first year (permit + visa + ID)",
    difficulty: "easy",
    lastUpdated: "2026-06",
  },

  // ═══════════════ Lisbon — D8 Digital Nomad Visa ═══════════════
  {
    id: "lisbon-d8",
    destinationId: "15",
    city: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    visaType: "D8 Digital Nomad Visa (Remote Work Visa)",
    overview:
      "Portugal's dedicated visa for remote workers and freelancers earning from abroad. The D8 grants temporary residence (2 years, renewable, then permanent) with a path to citizenship after 5 years — while you keep your foreign income.",
    eligibility: [
      "Remote work: employment contract or freelance work for companies OUTSIDE Portugal",
      "Income: at least €3,480/month (4× the 2026 minimum wage of €870) — averaged over 3 months",
      "Clean criminal record from your country of residence (12+ months)",
      "Proof of accommodation in Portugal (rental contract or intent)",
      "Valid health insurance or private cover (until registered in the SNS)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Gather your remote-work & income proof",
        description:
          "Document your employment or freelance setup abroad: contract, employer letter stating remote work is allowed, and 3 months of bank statements showing the €3,480/month threshold.",
        documents: ["Employment contract / freelance contracts", "Employer letter (remote work allowed)", "3 months bank statements", "Passport (6+ months validity)"],
        timeframe: "1–2 weeks",
        cost: "Free",
        tips: "If your income fluctuates, average 3 months — but every month should reasonably trend toward the threshold.",
        officialUrl: "https://www.aima.gov.pt/en/visas",
      },
      {
        stepNumber: 2,
        title: "Get your criminal record certificate",
        description:
          "Obtain a criminal record certificate from your country of residence, authenticated with an Apostille (and translated into Portuguese if not in EN/FR/ES/PT).",
        documents: ["Criminal record certificate", "Apostille", "Portuguese translation (if needed)"],
        timeframe: "2–6 weeks",
        cost: "$20–$80 depending on country + apostille",
        tips: "You'll need it again for the residence permit later — order two copies.",
        officialUrl: "https://www.aima.gov.pt/en/pedido-de-registo/",
      },
      {
        stepNumber: 3,
        title: "Apply at the Portuguese consulate (D8 visa)",
        description:
          "Book an appointment at the Portuguese embassy/consulate in your country and submit the D8 visa application. Processing is normally 60–90 days.",
        documents: ["Completed visa application form", "Passport + 2 photos", "Remote-work proof (step 1)", "Criminal record (step 2)", "Proof of accommodation", "Travel/health insurance"],
        timeframe: "60–90 days",
        cost: "€90 visa fee (consular fee varies)",
        tips: "Consulates in London, Paris and the US have long wait lists — book the appointment the moment you decide to move.",
        officialUrl: "https://www.portaldascomunidades.mne.gov.pt/",
      },
      {
        stepNumber: 4,
        title: "Travel & register for your residence permit",
        description:
          "Enter Portugal within 4 months of visa issuance, then register with AIMA for the D8 temporary residence permit (2 years, renewable). Book your AIMA appointment early — queues are long.",
        documents: ["D8 visa + passport", "Criminal record (updated, apostilled)", "Proof of accommodation", "NIF (tax number)", "NISS (social security, for freelancers)"],
        timeframe: "Registration 1–2 months; permit card takes several months",
        cost: "Residence permit ~€90–€170 (2026 fee)",
        tips: "Get your NIF (tax number) BEFORE arriving — you need it to sign a lease and open a bank account. NIF is free via a fiscal representative.",
        officialUrl: "https://www.aima.gov.pt/en/",
      },
      {
        stepNumber: 5,
        title: "Settle in & renew",
        description:
          "Register for the SNS (national health service), open a Portuguese bank account, and keep your remote-work proof current. After 2 years, renew; after 5 years, apply for citizenship or permanent residence.",
        documents: ["Residence permit", "Updated income proof", "NIF/NISS records"],
        timeframe: "Renewal every 2 years",
        cost: "Renewal ~€90–€170",
        tips: "Days spent on the D8 count toward the 5-year citizenship clock — keep every stamp and card.",
        officialUrl: "https://www.portugal.gov.pt/en/",
      },
    ],
    totalTimeframe: "3–5 months from application to residence card",
    totalCost: "€500–€1,200 (visa + permits + apostilles + NIF)",
    difficulty: "easy",
    lastUpdated: "2026-06",
  },

  // ═══════════════ London — Skilled Worker Visa ═══════════════
  {
    id: "london-skilled-worker",
    destinationId: "3",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    visaType: "Skilled Worker Visa",
    overview:
      "The main route for non-UK nationals to work in the UK. You need a job offer from a Home Office–approved sponsor, a Certificate of Sponsorship, and a salary meeting the thresholds. Leads to settlement (ILR) after 5 years.",
    eligibility: [
      "Job offer from a licensed sponsor (check the Sponsor Register)",
      "Certificate of Sponsorship (CoS) from your employer",
      "Salary ≥ £38,700/year (2026 general threshold) or the 'going rate' for the role, whichever is higher",
      "Role on the eligible occupations list (many skilled roles qualify)",
      "English: B1 level (pass an SELT test or prove degree taught in English)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Secure a job offer from a licensed sponsor",
        description:
          "Find a role with a Home Office–approved sponsor. Confirm the employer holds a valid sponsor licence and will assign you a Certificate of Sponsorship (CoS).",
        documents: ["Job offer letter", "Sponsor licence number (from employer)", "CV / references"],
        timeframe: "Varies — job hunt dependent",
        cost: "Free (job hunt)",
        tips: "Use the official Register of Licensed Sponsors to verify a company can sponsor before accepting an offer.",
        officialUrl: "https://www.gov.uk/register-of-licensed-sponsors",
      },
      {
        stepNumber: 2,
        title: "Receive your Certificate of Sponsorship",
        description:
          "Your employer assigns a CoS (defined or undefinced) via the sponsor management system, containing your role, salary, and the job's SOC code.",
        documents: ["CoS number (from employer)", "Job description"],
        timeframe: "1–2 weeks (employer action)",
        cost: "CoS fee £239 (usually paid by employer)",
        tips: "Check the SOC code on the CoS matches your actual duties — mismatches cause refusals.",
        officialUrl: "https://www.gov.uk/skilled-worker-visa",
      },
      {
        stepNumber: 3,
        title: "Prove your English (if needed)",
        description:
          "Pass an approved SELT (e.g. IELTS for UKVI) at B1 level, or provide a degree certificate from an English-taught university (via Ecctis check).",
        documents: ["SELT certificate (B1+) or degree + Ecctis statement"],
        timeframe: "1–2 weeks",
        cost: "IELTS for UKVI ~£150–£200; Ecctis check £150–£210",
        tips: "The B1 SELT lasts forever for visa purposes — you never retake it.",
        officialUrl: "https://www.gov.uk/guidance/prove-your-english-language-abilities-with-a-secure-english-language-test-selt",
      },
      {
        stepNumber: 4,
        title: "Apply online & pay the fees",
        description:
          "Submit the online application with your CoS number, pay the visa fee + Immigration Health Surcharge (IHS), and book biometrics at a visa application centre.",
        documents: ["Passport", "CoS number", "English proof", "Financial evidence (if applicable)", "Police certificate (for some roles)"],
        timeframe: "Decision within 3 weeks (priority service 5 working days)",
        cost: "£719 (3 yrs) / £1,420 (5 yrs) + IHS £1,035/year + biometrics ~£180",
        tips: "Pay the IHS — without it your visa is refused; it grants NHS access for the whole visa.",
        officialUrl: "https://www.gov.uk/skilled-worker-visa/apply",
      },
      {
        stepNumber: 5,
        title: "Receive your visa & travel to the UK",
        description:
          "Once approved you get a vignette (sticker) — you can travel to the UK up to 14 days before the start date on your CoS. Collect your BRP/eVisa on arrival.",
        documents: ["Visa vignette", "Passport", "CoS (for reference)"],
        timeframe: "Arrive within 28 days of the CoS start date",
        cost: "Free",
        tips: "Create your UKVI eVisa account early — physical BRPs are being phased out.",
        officialUrl: "https://www.gov.uk/visa-and-immigration",
      },
      {
        stepNumber: 6,
        title: "Work toward settlement (ILR)",
        description:
          "After 5 years on a Skilled Worker visa (time can be on this or other qualifying routes) you can apply for Indefinite Leave to Remain, then citizenship after another year.",
        documents: ["Passport", "5 years of payslips/bank statements", "Life in the UK test pass", "English proof (already held)"],
        timeframe: "ILR: after 5 years; citizenship: +12 months",
        cost: "ILR £2,885; citizenship £1,630",
        tips: "Don't spend more than 180 days/year outside the UK — it resets your continuous residence clock.",
        officialUrl: "https://www.gov.uk/indefinite-leave-to-remain",
      },
    ],
    totalTimeframe: "1–3 months (offer + visa) → 5 years to settlement",
    totalCost: "£4,000–£9,000 over 5 years (incl. IHS)",
    difficulty: "moderate",
    lastUpdated: "2026-06",
  },

  // ═══════════════ Sydney — Skilled Independent Visa 189 ═══════════════
  {
    id: "sydney-189",
    destinationId: "6",
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    visaType: "Skilled Independent Visa (subclass 189)",
    overview:
      "A points-tested permanent visa for skilled workers that does NOT require state nomination or a job offer. You submit an Expression of Interest (EOI) in SkillSelect, and the highest-scoring candidates in your occupation receive invitations in monthly rounds.",
    eligibility: [
      "Occupation on the eligible skilled occupation list (MLTSSL)",
      "Positive skills assessment in your occupation",
      "Points test: at least 65 points (age, English, experience, education…)",
      "Competent English minimum (IELTS 6.0); more points for 7.0+/8.0+",
      "Under 45 years old at invitation",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Confirm your occupation & get a skills assessment",
        description:
          "Check your occupation is on the MLTSSL for 189, then obtain a positive skills assessment from the relevant authority (e.g. ACS for ICT, Engineers Australia, CPA for accounting, VETASSESS for general).",
        documents: ["Degree/transcripts", "Work experience letters (with duties)", "Skills assessment application"],
        timeframe: "4–12 weeks (authority dependent)",
        cost: "$500–$1,100 AUD (authority dependent)",
        tips: "Your work experience must match the ANZSCO description closely — letterhead + duties + hours are all scrutinised.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment",
      },
      {
        stepNumber: 2,
        title: "Take an English test (IELTS/PTE)",
        description:
          "Sit an approved English test. Competent English = 0 points (IELTS 6.0); Proficient (7.0) = 10; Superior (8.0) = 20 points.",
        documents: ["IELTS Academic/General or PTE result"],
        timeframe: "Results in 2–5 days (computer-based)",
        cost: "$410 AUD (IELTS)",
        tips: "Every 0.5 band up is worth 10 points — a Superior score often makes the difference at invitation.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-selective/points-tested/points-table",
      },
      {
        stepNumber: 3,
        title: "Lodge your Expression of Interest (SkillSelect)",
        description:
          "Create an EOI on SkillSelect, declaring your occupation, skills assessment, English score, and claimed points. You'll be ranked against other EOIs in your occupation.",
        documents: ["Skills assessment reference", "IELTS result", "Passport", "Employment history"],
        timeframe: "Same day (EOI live for 2 years)",
        cost: "Free",
        tips: "Be honest — points claims are verified at application; a false claim is a refusal plus ban.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect",
      },
      {
        stepNumber: 4,
        title: "Receive an invitation to apply",
        description:
          "Home Affairs holds invitation rounds (monthly). If your points clear the cutoff for your occupation, you receive an invitation with 60 days to apply for the visa.",
        documents: ["Invitation letter", "Updated evidence for all claimed points"],
        timeframe: "1–12+ months (occupation-dependent)",
        cost: "Free",
        tips: "Cutoffs vary wildly by occupation — ICT and accountancy are competitive; watch published rounds to gauge your odds.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds",
      },
      {
        stepNumber: 5,
        title: "Apply for the visa & health checks",
        description:
          "Submit the full visa application within 60 days: police clearances, medicals, and evidence for every point claimed. Processing for 189 is typically 4–8 months.",
        documents: ["Police clearances (all countries)", "Medical (panel physician)", "Passport scans", "Proof of English, skills, experience", "Character declaration"],
        timeframe: "Processing 4–8 months",
        cost: "$4,640 AUD",
        tips: "Book the medical and police checks IMMEDIATELY — they're the slowest links and the 60-day clock doesn't pause.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-visa-189",
      },
      {
        stepNumber: 6,
        title: "Visa grant & arrive in Australia",
        description:
          "On grant, the 189 is a permanent visa valid for 5 years of travel. Enter Australia to activate it — then you can live and work anywhere in the country.",
        documents: ["Visa grant notice", "Passport"],
        timeframe: "Arrive before travel-facility expiry (5 years)",
        cost: "Free",
        tips: "Activate your visa with a short trip if you're not moving immediately — the 5-year travel window starts on grant.",
        officialUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia",
      },
    ],
    totalTimeframe: "6–18 months (assessment to grant)",
    totalCost: "$6,000–$8,000 AUD (incl. assessment & English)",
    difficulty: "hard",
    lastUpdated: "2026-06",
  },

  // ═══════════════ General — Tourist-to-Residence Pathway ═══════════════
  {
    id: "general-tourist-residence",
    destinationId: "",
    city: "General",
    country: "Various",
    flag: "🌍",
    visaType: "Tourist-to-Residence Pathway (general guidance)",
    overview:
      "A generic playbook for turning a tourist visit into a legal residence anywhere: understand your visa-free limits, never overstay, and switch to a proper residence pathway (work, study, family, investment, or digital-nomad) while your status is still valid. Rules differ by country — always confirm with the destination's official immigration authority.",
    eligibility: [
      "Valid tourist/visa-free entry (usually 30–90 days)",
      "A realistic residence pathway: job offer, study enrolment, family sponsor, investment, or remote-work visa",
      "Clean immigration record (no overstays)",
      "Enough funds to support yourself while your status is pending",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Know your entry rights & visa-free days",
        description:
          "Check the exact number of days you're allowed as a tourist in your destination and whether work is prohibited. Many countries ban any work — including remote work — on tourist status.",
        documents: ["Passport (6+ months validity)", "Return ticket (often checked)", "Travel insurance"],
        timeframe: "Before travel",
        cost: "Varies",
        tips: "Look up your exact allowance on the destination's immigration site or IATA Travel Centre before booking.",
        officialUrl: "https://www.iatatravelcentre.com/world.php",
      },
      {
        stepNumber: 2,
        title: "Pick your residence pathway early",
        description:
          "While in-country (or before), choose the route that fits you: skilled worker, study, family reunification, digital nomad, investor, or startup visa. Each has its own documents and timelines.",
        documents: ["Job offer / enrolment letter / sponsor documents (varies)"],
        timeframe: "Research: 2–4 weeks",
        cost: "Free (research)",
        tips: "Digital-nomad visas (Portugal, Spain, Dubai, Croatia…) are often the fastest for remote workers.",
        officialUrl: "https://www.iatatravelcentre.com/world.php",
      },
      {
        stepNumber: 3,
        title: "Apply to change status before your tourist days run out",
        description:
          "File your residence application while your tourist status is still valid. Overstaying even a day can trigger bans and ruin future applications — never 'wait it out'.",
        documents: ["Valid passport", "Completed residence application", "Pathway-specific documents", "Proof of funds"],
        timeframe: "Application window = remaining tourist days",
        cost: "Varies by country",
        tips: "Some countries allow in-country change of status; others require you to return home and apply at a consulate — check before assuming.",
        officialUrl: "https://www.iatatravelcentre.com/world.php",
      },
      {
        stepNumber: 4,
        title: "Bridge your stay legally",
        description:
          "While the application processes, keep copies of your submission receipt. Many authorities grant implied/conditional status once you've applied — carry the receipt when travelling or registering.",
        documents: ["Application receipt", "Submission confirmation email"],
        timeframe: "Until decision",
        cost: "Free",
        tips: "A submitted application often extends your right to stay — but only if you applied before expiry. Document everything.",
        officialUrl: "https://www.iatatravelcentre.com/world.php",
      },
      {
        stepNumber: 5,
        title: "Receive your residence permit & settle",
        description:
          "Once granted, collect your residence card, register your address, and open a bank account. Keep a calendar of renewal dates — residence permits expire.",
        documents: ["Residence permit/card", "Proof of address", "Bank account"],
        timeframe: "Until first renewal",
        cost: "Varies by country",
        tips: "Set an alarm 3 months before renewal — late renewals can be treated as illegal stays.",
        officialUrl: "https://www.iatatravelcentre.com/world.php",
      },
    ],
    totalTimeframe: "Varies by pathway (1–12 months)",
    totalCost: "Varies by country",
    difficulty: "easy",
    lastUpdated: "2026-06",
  },
];

/** Get all guides, optionally filtered by destination id. */
export function getGuidesForDestination(destinationId: string): VisaGuide[] {
  return VISA_GUIDES.filter((g) => g.destinationId === destinationId);
}

/** Difficulty badge styling + label helpers. */
export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "bg-green-50 text-green-600 border-green-200",
  moderate: "bg-amber-50 text-amber-600 border-amber-200",
  hard: "bg-red-50 text-red-600 border-red-200",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

/** LocalStorage key for a guide's document checklist state. */
export function checklistStorageKey(guideId: string): string {
  return `gm-visa-checklist-${guideId}`;
}
