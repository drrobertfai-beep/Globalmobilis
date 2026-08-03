/**
 * Extended destination resources — schools, community links, job boards, housing.
 * Each destination can have rich resource arrays for the detail page tabs.
 */

export interface School {
  name: string;
  type: "university" | "college" | "high_school" | "primary" | "language" | "other";
  website: string;
  language: string;
  description?: string;
}

export interface CommunityLink {
  name: string;
  platform: "facebook" | "discord" | "whatsapp" | "meetup" | "reddit" | "telegram" | "other";
  url: string;
  memberCount?: string;
  description?: string;
}

export interface JobBoard {
  name: string;
  url: string;
  focus: "general" | "tech" | "remote" | "startup" | "finance" | "healthcare" | "education" | "trades" | "other";
  description?: string;
}

export interface HousingSite {
  name: string;
  url: string;
  type: "rental" | "buy" | "share" | "co-living" | "short-term" | "general";
  description?: string;
}

export interface VisaInfo {
  description: string;
  officialUrl: string;
  commonVisaTypes: string[];
}

export interface HealthcareInfo {
  description: string;
  publicSystem: string;
  insuranceUrl?: string;
}

export interface DestinationResources {
  destinationId: string;
  schools: School[];
  communityLinks: CommunityLink[];
  jobBoards: JobBoard[];
  housingSites: HousingSite[];
  visaInfo: VisaInfo;
  healthcare: HealthcareInfo;
}

/** Full resource data for Toronto — template for all destinations */
export const TORONTO_RESOURCES: DestinationResources = {
  destinationId: "1",
  schools: [
    {
      name: "University of Toronto",
      type: "university",
      website: "https://www.utoronto.ca",
      language: "English",
      description: "Canada's top-ranked university with 700+ undergraduate programs across three campuses.",
    },
    {
      name: "Toronto Metropolitan University (formerly Ryerson)",
      type: "university",
      website: "https://www.torontomu.ca",
      language: "English",
      description: "Career-focused university in downtown Toronto, strong in business, engineering, and media.",
    },
    {
      name: "York University",
      type: "university",
      website: "https://www.yorku.ca",
      language: "English",
      description: "Large comprehensive university with strong law, business, and liberal arts programs.",
    },
    {
      name: "George Brown College",
      type: "college",
      website: "https://www.georgebrown.ca",
      language: "English",
      description: "Applied arts and technology college in downtown Toronto with 170+ programs.",
    },
    {
      name: "Seneca Polytechnic",
      type: "college",
      website: "https://www.senecapolytechnic.ca",
      language: "English",
      description: "One of Canada's largest polytechnics with campuses across the GTA.",
    },
    {
      name: "Humber College",
      type: "college",
      website: "https://www.humber.ca",
      language: "English",
      description: "Polytechnic college with strong creative arts, business, and technology programs.",
    },
    {
      name: "ILAC — International Language Academy of Canada",
      type: "language",
      website: "https://www.ilac.com",
      language: "English",
      description: "Popular English language school for international students, with pathways to partner universities.",
    },
    {
      name: "ESL Toronto",
      type: "language",
      website: "https://www.esltoronto.com",
      language: "English",
      description: "English as a Second Language programs for all levels in downtown Toronto.",
    },
  ],
  communityLinks: [
    {
      name: "Toronto Expat Network",
      platform: "facebook",
      url: "https://www.facebook.com/groups/torontoexpats",
      memberCount: "28K",
      description: "Largest expat group in Toronto — job tips, housing, social events, and newcomer advice.",
    },
    {
      name: "Newcomers to Toronto",
      platform: "facebook",
      url: "https://www.facebook.com/groups/newcomerstotoronto",
      memberCount: "15K",
      description: "Focused on helping recent immigrants navigate life in Toronto.",
    },
    {
      name: "Toronto Expat & Newcomer Meetups",
      platform: "meetup",
      url: "https://www.meetup.com/find/?keywords=expat+toronto",
      memberCount: "5K+",
      description: "Regular in-person social events — pub nights, hiking, cultural outings.",
    },
    {
      name: "r/askTO",
      platform: "reddit",
      url: "https://www.reddit.com/r/askTO/",
      memberCount: "220K",
      description: "Toronto's main Reddit community — great for asking specific questions about neighborhoods, jobs, and life.",
    },
    {
      name: "Toronto Startups & Tech",
      platform: "discord",
      url: "https://discord.gg/torontotech",
      memberCount: "8K",
      description: "Active Discord server for Toronto's tech and startup community.",
    },
  ],
  jobBoards: [
    {
      name: "Indeed Canada",
      url: "https://ca.indeed.com/jobs?l=Toronto%2C+ON",
      focus: "general",
      description: "The largest job aggregator in Canada — great starting point for any industry.",
    },
    {
      name: "LinkedIn Jobs — Toronto",
      url: "https://www.linkedin.com/jobs/toronto-jobs",
      focus: "general",
      description: "Professional networking + job listings. Strong for tech, finance, and corporate roles.",
    },
    {
      name: "MaRS Discovery District Job Board",
      url: "https://www.marsdd.com/careers/",
      focus: "startup",
      description: "Jobs at Toronto startups and innovation-focused companies in the MaRS ecosystem.",
    },
    {
      name: "TorontoJobs.ca",
      url: "https://www.torontojobs.ca",
      focus: "general",
      description: "Toronto-specific job board covering all sectors.",
    },
    {
      name: "WorkInTech — Toronto",
      url: "https://www.workintech.ca",
      focus: "tech",
      description: "Focused on tech roles across the Toronto-Waterloo corridor.",
    },
    {
      name: "CharityVillage",
      url: "https://charityvillage.com/jobs/",
      focus: "other",
      description: "Non-profit and charitable sector jobs across Toronto and Canada.",
    },
  ],
  housingSites: [
    {
      name: "Realtor.ca",
      url: "https://www.realtor.ca/map#view=map&ZoomLevel=11&Center=43.653225%2C-79.383186",
      type: "buy",
      description: "Official MLS listings for buying homes and condos across Toronto.",
    },
    {
      name: "Zumper — Toronto Rentals",
      url: "https://www.zumper.com/apartments-for-rent/toronto-on",
      type: "rental",
      description: "Popular rental platform with map-based search and instant alerts.",
    },
    {
      name: "Rentals.ca — Toronto",
      url: "https://rentals.ca/toronto",
      type: "rental",
      description: "Large database of Toronto rental apartments, condos, and houses.",
    },
    {
      name: "Kijiji — Toronto Rentals",
      url: "https://www.kijiji.ca/b-apartments-condos/gta-greater-toronto-area/c37l1700272",
      type: "rental",
      description: "Classifieds with budget-friendly and sublet options you won't find on mainstream sites.",
    },
    {
      name: "Toronto Home Zone (Facebook Group)",
      url: "https://www.facebook.com/groups/torontohomezone",
      type: "share",
      description: "Active community for finding roommates, sublets, and rental advice in Toronto.",
    },
    {
      name: "Roomies.ca — Toronto",
      url: "https://roomies.ca/rooms/toronto",
      type: "share",
      description: "Find roommates and shared accommodation in Toronto neighborhoods.",
    },
  ],
  visaInfo: {
    description: "Canada offers several pathways for skilled workers, students, and families. Toronto benefits from Ontario's Provincial Nominee Program (OINP) which can fast-track permanent residency for in-demand skills.",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
    commonVisaTypes: [
      "Express Entry (Federal Skilled Worker)",
      "Ontario Provincial Nominee Program (OINP)",
      "Study Permit → Post-Graduation Work Permit",
      "Global Talent Stream (tech workers)",
      "Spousal / Family Sponsorship",
      "International Experience Canada (working holiday)",
    ],
  },
  healthcare: {
    description: "Ontario's public health insurance (OHIP) covers medically necessary doctor visits, hospital stays, and emergency care. There is a 3-month waiting period for new residents — private insurance is recommended during the gap.",
    publicSystem: "Ontario Health Insurance Plan (OHIP)",
    insuranceUrl: "https://www.ontario.ca/page/apply-ohip-and-get-health-card",
  },
};

// =============================================================================
// Tier 1 — Full detail (featured cities)
// =============================================================================

/** London, United Kingdom */
export const LONDON_RESOURCES: DestinationResources = {
  destinationId: "3",
  schools: [
    { name: "University College London (UCL)", type: "university", website: "https://www.ucl.ac.uk", language: "English", description: "World-leading research university in central London, consistently ranked in the global top 10." },
    { name: "Imperial College London", type: "university", website: "https://www.imperial.ac.uk", language: "English", description: "Science, engineering, medicine and business powerhouse in South Kensington." },
    { name: "London School of Economics (LSE)", type: "university", website: "https://www.lse.ac.uk", language: "English", description: "Global leader in social sciences, economics and finance." },
    { name: "King's College London", type: "university", website: "https://www.kcl.ac.uk", language: "English", description: "One of the UK's oldest and most prestigious universities, strong in law, medicine and humanities." },
    { name: "City, University of London", type: "university", website: "https://www.city.ac.uk", language: "English", description: "Career-focused university in Clerkenwell, renowned for business and journalism." },
    { name: "London College of Communication (UAL)", type: "college", website: "https://www.arts.ac.uk/colleges/london-college-of-communication", language: "English", description: "Part of University of the Arts London — design, media and communications." },
  ],
  communityLinks: [
    { name: "Expats in London", platform: "facebook", url: "https://www.facebook.com/groups/expatsinlondon", memberCount: "90K+", description: "One of the largest London expat communities — advice, events and networking." },
    { name: "London Expats Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expats+london", memberCount: "10K+", description: "Regular social, professional and cultural meetups across London." },
    { name: "r/london", platform: "reddit", url: "https://www.reddit.com/r/london/", memberCount: "1.2M", description: "London's main Reddit community — neighbourhoods, jobs, transport and life advice." },
    { name: "InterNations London", platform: "other", url: "https://www.internations.org/london-expats", memberCount: "60K+", description: "Global expat network with regular events, groups and forums in London." },
  ],
  jobBoards: [
    { name: "Indeed UK — London", url: "https://uk.indeed.com/jobs?l=London", focus: "general", description: "The largest UK job aggregator — good starting point for any industry." },
    { name: "LinkedIn Jobs — London", url: "https://www.linkedin.com/jobs/london-jobs", focus: "general", description: "Professional networking plus job listings; strong for finance, tech and corporate roles." },
    { name: "Reed.co.uk", url: "https://www.reed.co.uk/jobs/london", focus: "general", description: "Major UK job board with tens of thousands of London roles across sectors." },
    { name: "Totaljobs — London", url: "https://www.totaljobs.com/jobs/london", focus: "general", description: "One of the UK's biggest job sites with strong admin, retail and office listings." },
    { name: "WorkInStartups", url: "https://workinstartups.com/jobs/london/", focus: "startup", description: "Jobs at London's fast-growing startups and scaleups." },
  ],
  housingSites: [
    { name: "Rightmove", url: "https://www.rightmove.co.uk/property-to-rent/London.html", type: "rental", description: "The UK's largest property portal — rentals, shared accommodation and sales." },
    { name: "Zoopla — London", url: "https://www.zoopla.co.uk/to-rent/property/london/", type: "rental", description: "Big rental and sales listings with neighbourhood insights." },
    { name: "SpareRoom", url: "https://www.spareroom.co.uk/flatshare/london", type: "share", description: "The go-to site for flatshares and rooms in London — budget-friendly." },
    { name: "OpenRent", url: "https://www.openrent.co.uk/properties-to-rent/london", type: "rental", description: "Direct-to-landlord rentals that skip agency fees." },
    { name: "Gumtree London Rentals", url: "https://www.gumtree.com/property-to-rent/london", type: "rental", description: "Classifieds with sublets and short-term options." },
  ],
  visaInfo: {
    description: "The UK points-based immigration system offers clear pathways for skilled workers. After Brexit, EU citizens need a visa like everyone else. The Skilled Worker visa is the main route, with a 'shortage occupation' list that fast-tracks in-demand roles.",
    officialUrl: "https://www.gov.uk/browse/visas-immigration",
    commonVisaTypes: [
      "Skilled Worker visa",
      "Health and Care Worker visa",
      "Graduate visa (post-study)",
      "Global Talent visa",
      "Innovator Founder visa",
      "Student visa (formerly Tier 4)",
      "Family / Partner visa",
    ],
  },
  healthcare: {
    description: "The NHS provides free-at-the-point-of-use healthcare to UK residents. As a visa holder you pay the Immigration Health Surcharge (IHS) as part of your visa fee, which entitles you to NHS care. Dentists and prescriptions carry modest charges.",
    publicSystem: "National Health Service (NHS)",
    insuranceUrl: "https://www.gov.uk/healthcare-immigration-application",
  },
};

/** Berlin, Germany */
export const BERLIN_RESOURCES: DestinationResources = {
  destinationId: "4",
  schools: [
    { name: "Humboldt-Universität zu Berlin", type: "university", website: "https://www.hu-berlin.de", language: "German", description: "Historic research university in the city centre, strong across humanities and sciences." },
    { name: "Freie Universität Berlin", type: "university", website: "https://www.fu-berlin.de", language: "German", description: "One of Germany's elite universities, renowned for research and international programs." },
    { name: "Technische Universität Berlin", type: "university", website: "https://www.tu.berlin", language: "German", description: "Top technical university — engineering, computer science and architecture." },
    { name: "ESMT Berlin", type: "university", website: "https://esmt.berlin", language: "English", description: "Private business school ranked among Europe's best; MBA and executive programs in English." },
    { name: "Berlin School of Economics and Law (HWR)", type: "university", website: "https://www.hwr-berlin.de", language: "German", description: "Applied university strong in business, public administration and law." },
    { name: "Berlin International University of Applied Sciences", type: "college", website: "https://www.biu-berlin.de", language: "English", description: "English-taught bachelor's and master's programs in business, design and architecture." },
  ],
  communityLinks: [
    { name: "Expats in Berlin", platform: "facebook", url: "https://www.facebook.com/groups/expatsinberlin", memberCount: "70K+", description: "Large and active group for newcomers — housing, bureaucracy, jobs and social life." },
    { name: "Berlin Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+berlin", memberCount: "15K+", description: "Networking and social events across the city." },
    { name: "r/berlin", platform: "reddit", url: "https://www.reddit.com/r/berlin/", memberCount: "650K", description: "Berlin's main Reddit community — practical advice in English and German." },
    { name: "InterNations Berlin", platform: "other", url: "https://www.internations.org/berlin-expats", memberCount: "45K+", description: "Global expat network with regular events and interest groups." },
  ],
  jobBoards: [
    { name: "Indeed Deutschland — Berlin", url: "https://de.indeed.com/jobs?l=Berlin", focus: "general", description: "Biggest job aggregator in Germany — filter by English-speaking roles." },
    { name: "StepStone — Berlin", url: "https://www.stepstone.de/jobs/berlin", focus: "general", description: "Major German job board with strong professional and corporate listings." },
    { name: "BerlinStartupJobs", url: "https://berlinstartupjobs.com", focus: "startup", description: "Berlin's startup and tech job board — many roles in English." },
    { name: "LinkedIn Jobs — Berlin", url: "https://www.linkedin.com/jobs/berlin-jobs", focus: "general", description: "Professional networking and jobs, strong for international companies." },
    { name: "English Jobs Germany", url: "https://www.englishjobs.de/jobs/berlin", focus: "general", description: "Job board focused on English-speaking roles in Germany." },
  ],
  housingSites: [
    { name: "ImmobilienScout24", url: "https://www.immobilienscout24.de/Suche/wohnung-mieten/berlin", type: "rental", description: "Germany's largest property portal for rentals and sales." },
    { name: "WG-Gesucht", url: "https://www.wg-gesucht.de/wohnungen-in-berlin.8.2.1.0.html", type: "share", description: "The standard for shared flats (WGs) and rooms in Berlin." },
    { name: "ImmoWelt", url: "https://www.immowelt.de/liste/berlin/wohnungen/mieten", type: "rental", description: "Large rental listings with map search." },
    { name: "HousingAnywhere — Berlin", url: "https://housinganywhere.com/Berlin--Germany", type: "rental", description: "Furnished rooms and flats aimed at internationals and students." },
  ],
  visaInfo: {
    description: "Germany offers EU Blue Card and Skilled Worker pathways. In-demand IT and engineering professionals qualify for accelerated processing. A Job Seeker visa lets you stay 6 months to find work, and freelancers/self-employed (Selbständige) can apply for a residence permit with a viable business plan.",
    officialUrl: "https://www.make-it-in-germany.com/en/visa-residence",
    commonVisaTypes: [
      "EU Blue Card",
      "Skilled Worker visa (Fachkraft)",
      "Job Seeker visa (6 months)",
      "Freelancer / Self-employment permit (Selbstständigkeit)",
      "Student visa",
      "ICT / intra-company transfer",
    ],
  },
  healthcare: {
    description: "Germany has a dual public-private healthcare system. Health insurance is mandatory — most employees join a statutory health insurer (gesetzliche Krankenversicherung) with contributions split between employer and employee; high earners may opt for private insurance. Coverage is comprehensive, including doctor visits, hospitals and most prescriptions.",
    publicSystem: "Statutory health insurance (gesetzliche Krankenversicherung — GKV)",
    insuranceUrl: "https://www.make-it-in-germany.com/en/working-in-germany/health-insurance",
  },
};

/** Sydney, Australia */
export const SYDNEY_RESOURCES: DestinationResources = {
  destinationId: "6",
  schools: [
    { name: "University of Sydney", type: "university", website: "https://www.sydney.edu.au", language: "English", description: "Australia's oldest university and a global top-20 institution." },
    { name: "UNSW Sydney", type: "university", website: "https://www.unsw.edu.au", language: "English", description: "Leading university strong in engineering, business and technology." },
    { name: "University of Technology Sydney (UTS)", type: "university", website: "https://www.uts.edu.au", language: "English", description: "Career-focused university in the city centre, known for innovation." },
    { name: "Macquarie University", type: "university", website: "https://www.mq.edu.au", language: "English", description: "Research university in North Ryde, strong in business, science and IT." },
    { name: "TAFE NSW — Sydney", type: "college", website: "https://www.tafensw.edu.au", language: "English", description: "Government vocational training — trades, business, hospitality and more." },
  ],
  communityLinks: [
    { name: "Expats in Sydney", platform: "facebook", url: "https://www.facebook.com/groups/expatsinsydney", memberCount: "40K+", description: "Active community for newcomers — jobs, housing and social events." },
    { name: "Sydney Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+sydney", memberCount: "8K+", description: "In-person events — harbour walks, pub nights, professional networking." },
    { name: "r/sydney", platform: "reddit", url: "https://www.reddit.com/r/sydney/", memberCount: "400K", description: "Sydney's main Reddit community — great for practical local questions." },
    { name: "InterNations Sydney", platform: "other", url: "https://www.internations.org/sydney-expats", memberCount: "30K+", description: "Global expat network with regular events across Sydney." },
  ],
  jobBoards: [
    { name: "Seek — Sydney", url: "https://www.seek.com.au/jobs-in-sydney-nsw", focus: "general", description: "Australia's biggest job board — the first place to look." },
    { name: "Indeed Australia — Sydney", url: "https://au.indeed.com/jobs?l=Sydney+NSW", focus: "general", description: "Large job aggregator covering all industries." },
    { name: "LinkedIn Jobs — Sydney", url: "https://www.linkedin.com/jobs/sydney-jobs", focus: "general", description: "Professional networking and corporate roles." },
    { name: "Jora Australia", url: "https://au.jora.com/jobs/sydney", focus: "general", description: "Aggregator with strong coverage of casual and entry-level work." },
  ],
  housingSites: [
    { name: "Realestate.com.au — Sydney", url: "https://www.realestate.com.au/rent/in-sydney,+nsw", type: "rental", description: "Australia's most popular property portal for rentals and sales." },
    { name: "Domain — Sydney", url: "https://www.domain.com.au/rent/sydney-nsw/", type: "rental", description: "Major property site with map-based rental search." },
    { name: "Flatmates.com.au", url: "https://www.flatmates.com.au/rooms/sydney", type: "share", description: "Australia's largest share-accommodation network." },
    { name: "Gumtree Sydney Rentals", url: "https://www.gumtree.com.au/s-property-rental/sydney/c18323", type: "rental", description: "Classifieds with budget and short-term options." },
  ],
  visaInfo: {
    description: "Australia's skilled migration program uses a points test. Skilled independent and state-nominated visas lead directly to permanent residency; employer-sponsored and student visas are common entry paths. Working Holiday visas (subclass 417/462) allow many nationalities to work in Australia for up to a year.",
    officialUrl: "https://immi.homeaffairs.gov.au",
    commonVisaTypes: [
      "Skilled Independent visa (subclass 189)",
      "Skilled Nominated visa (subclass 190)",
      "Employer Sponsored / TSS (subclass 482)",
      "Student visa (subclass 500)",
      "Working Holiday visa (subclass 417/462)",
      "Partner / Family visa",
    ],
  },
  healthcare: {
    description: "Medicare, Australia's public healthcare system, covers doctor visits and hospital treatment in public hospitals. Most visa holders pay a Medicare levy; some temporary visa classes need private health insurance instead (check your visa conditions).",
    publicSystem: "Medicare",
    insuranceUrl: "https://www.servicesaustralia.gov.au/medicare",
  },
};

/** Dubai, United Arab Emirates */
export const DUBAI_RESOURCES: DestinationResources = {
  destinationId: "8",
  schools: [
    { name: "American University in Dubai (AUD)", type: "university", website: "https://www.aud.edu", language: "English", description: "Private American-style university in Dubai Media City." },
    { name: "University of Dubai", type: "university", website: "https://www.ud.ac.ae", language: "English", description: "Business and engineering university founded by the Dubai Chamber." },
    { name: "Khalifa University", type: "university", website: "https://www.ku.ac.ae", language: "English", description: "Top-ranked research university in the UAE, strong in STEM." },
    { name: "University of Wollongong in Dubai", type: "university", website: "https://www.uowdubai.ac.ae", language: "English", description: "Australian curriculum and degrees in Dubai Knowledge Park." },
    { name: "Middlesex University Dubai", type: "university", website: "https://www.mdx.ac.ae", language: "English", description: "UK-based university with a large Dubai campus." },
    { name: "Dubai Institute of Design and Innovation (DIDI)", type: "college", website: "https://www.didi.ac.ae", language: "English", description: "Specialist design institute in Dubai Design District." },
  ],
  communityLinks: [
    { name: "Expats in Dubai", platform: "facebook", url: "https://www.facebook.com/groups/expatsindubai", memberCount: "100K+", description: "One of the biggest Dubai expat groups — advice on jobs, visas and daily life." },
    { name: "Dubai Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+dubai", memberCount: "12K+", description: "Social and professional events across Dubai." },
    { name: "r/dubai", platform: "reddit", url: "https://www.reddit.com/r/dubai/", memberCount: "250K", description: "Dubai's main Reddit community — frank advice on salaries, housing and life." },
    { name: "InterNations Dubai", platform: "other", url: "https://www.internations.org/dubai-expats", memberCount: "40K+", description: "Global expat network with regular high-quality events." },
  ],
  jobBoards: [
    { name: "Bayt.com", url: "https://www.bayt.com/en/uae/jobs/dubai/", focus: "general", description: "The largest job site in the Middle East — strong in the UAE." },
    { name: "LinkedIn Jobs — Dubai", url: "https://www.linkedin.com/jobs/dubai-jobs", focus: "general", description: "Key platform for professional roles in the Emirates." },
    { name: "Dubizzle Jobs", url: "https://dubai.dubizzle.com/job/", focus: "general", description: "Dubai's popular classifieds — jobs across all sectors." },
    { name: "GulfTalent", url: "https://www.gulftalent.com/uae/jobs/dubai", focus: "general", description: "Specialist in senior and professional roles in the Gulf." },
  ],
  housingSites: [
    { name: "Property Finder", url: "https://www.propertyfinder.ae/en/rent/property-for-rent/dubai", type: "rental", description: "Dubai's leading property portal for rentals and sales." },
    { name: "Bayut", url: "https://www.bayut.com/to-rent/property/dubai/", type: "rental", description: "Major UAE property platform with detailed listings." },
    { name: "Dubizzle Property", url: "https://dubai.dubizzle.com/property-for-rent/", type: "rental", description: "Classifieds with direct landlord listings and room shares." },
    { name: "Airbnb — Dubai", url: "https://www.airbnb.com/dubai-united-arab-emirates/stays", type: "short-term", description: "Furnished short-term stays while you settle in." },
  ],
  visaInfo: {
    description: "The UAE issues employment visas sponsored by employers (the standard route), plus investor, freelance (green visa) and Golden Visa (long-term residency for investors, highly skilled professionals and exceptional talent) pathways. Dubai has no income tax, which is a major draw. Most visas are employer-sponsored, so job-first is the common strategy.",
    officialUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas",
    commonVisaTypes: [
      "Employment visa (sponsored by employer)",
      "Green Visa (freelancers / self-employed)",
      "Golden Visa (10-year long-term residency)",
      "Investor visa",
      "Student visa",
      "Family / dependent visa",
    ],
  },
  healthcare: {
    description: "Private health insurance is mandatory for all residents in Dubai (sponsored by employer or self-purchased). The Dubai Health Authority (DHA) regulates healthcare, which is high-quality but not free — insurance plans cover most treatment. Public hospitals serve citizens and residents with insurance.",
    publicSystem: "Dubai Health Authority (DHA) — mandatory private insurance model",
    insuranceUrl: "https://www.dha.gov.ae",
  },
};

/** Lisbon, Portugal */
export const LISBON_RESOURCES: DestinationResources = {
  destinationId: "15",
  schools: [
    { name: "Universidade de Lisboa", type: "university", website: "https://www.ulisboa.pt", language: "Portuguese", description: "Portugal's largest and highest-ranked university." },
    { name: "NOVA University Lisbon", type: "university", website: "https://www.unl.pt", language: "Portuguese", description: "Young, dynamic university strong in business (NOVA SBE) and economics." },
    { name: "ISCTE — University Institute of Lisbon", type: "university", website: "https://www.iscte-iul.pt", language: "Portuguese", description: "Public university known for business, sociology and public policy." },
    { name: "Universidade Católica Portuguesa (Lisbon)", type: "university", website: "https://www.ucp.pt", language: "Portuguese", description: "Top private university; Católica Lisbon School of Business is highly ranked." },
    { name: "Instituto Superior Técnico (IST)", type: "university", website: "https://tecnico.ulisboa.pt", language: "Portuguese", description: "Portugal's leading engineering and technology school." },
  ],
  communityLinks: [
    { name: "Expats in Lisbon", platform: "facebook", url: "https://www.facebook.com/groups/expatsinlisbon", memberCount: "60K+", description: "Large, welcoming community for newcomers to Lisbon." },
    { name: "Lisbon Digital Nomads", platform: "facebook", url: "https://www.facebook.com/groups/lisbondigitalnomads", memberCount: "35K+", description: "Huge group of remote workers and nomads based in Lisbon." },
    { name: "r/lisboa", platform: "reddit", url: "https://www.reddit.com/r/lisboa/", memberCount: "90K", description: "Lisbon's Reddit community — local advice in Portuguese and English." },
    { name: "InterNations Lisbon", platform: "other", url: "https://www.internations.org/lisbon-expats", memberCount: "25K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "Indeed Portugal — Lisbon", url: "https://pt.indeed.com/empregos?l=Lisboa", focus: "general", description: "The main job aggregator for Portugal." },
    { name: "LinkedIn Jobs — Lisbon", url: "https://www.linkedin.com/jobs/lisbon-jobs", focus: "general", description: "Strong for tech, startups and multinationals in Lisbon." },
    { name: "SAPO Emprego", url: "https://emprego.sapo.pt/empregos/lisboa", focus: "general", description: "Popular Portuguese job board." },
    { name: "Landing.jobs", url: "https://landing.jobs/jobs?location=Lisbon", focus: "tech", description: "Tech-focused job board with many Lisbon startups." },
  ],
  housingSites: [
    { name: "Idealista — Lisbon", url: "https://www.idealista.pt/en/imoveis/lisboa/", type: "rental", description: "Portugal's most-used property portal." },
    { name: "OLX Portugal", url: "https://www.olx.pt/imoveis/arrendamento/lisboa/", type: "rental", description: "Classifieds with private landlord listings and room shares." },
    { name: "Imovirtual", url: "https://www.imovirtual.com/pt/arrendar/lisboa/", type: "rental", description: "Large rental database with English interface available." },
    { name: "Uniplaces", url: "https://www.uniplaces.com/accommodation/lisbon", type: "rental", description: "Verified student and young-professional rooms, bookable online." },
  ],
  visaInfo: {
    description: "Portugal is a hotspot for relocation — the D7 (passive income) visa and the D8 digital nomad visa are popular, and the Golden Visa programme grants residency via investment. EU citizens need no visa. The job-seeker visa allows a 120-day stay to look for work.",
    officialUrl: "https://www.sef.pt/en/pages/conteudo-detalhe.aspx?nID=86",
    commonVisaTypes: [
      "D7 Passive Income visa",
      "D8 Digital Nomad visa",
      "Job Seeker visa (120 days)",
      "EU Blue Card",
      "Golden Visa (investment)",
      "Student visa (D4)",
    ],
  },
  healthcare: {
    description: "Portugal's Serviço Nacional de Saúde (SNS) provides universal public healthcare, largely free at the point of use. Residents with an NIF and registered with the health centre can access public care; many also take private insurance for faster access. The SNS is consistently ranked among the best in Europe.",
    publicSystem: "Serviço Nacional de Saúde (SNS)",
    insuranceUrl: "https://www.sns.gov.pt",
  },
};

// =============================================================================
// Tier 2 — North America templates
// =============================================================================

/** Vancouver, Canada */
export const VANCOUVER_RESOURCES: DestinationResources = {
  destinationId: "2",
  schools: [
    { name: "University of British Columbia (UBC)", type: "university", website: "https://www.ubc.ca", language: "English", description: "Global top-40 research university with a stunning ocean-side campus." },
    { name: "Simon Fraser University (SFU)", type: "university", website: "https://www.sfu.ca", language: "English", description: "Innovative public university known for interdisciplinary programs." },
    { name: "British Columbia Institute of Technology (BCIT)", type: "college", website: "https://www.bcit.ca", language: "English", description: "Applied technology and trades college with excellent employment outcomes." },
  ],
  communityLinks: [
    { name: "Expats in Vancouver", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+vancouver", memberCount: "30K+", description: "Newcomer community — jobs, housing and social events." },
    { name: "Vancouver Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+vancouver", memberCount: "5K+", description: "Regular in-person events for newcomers." },
    { name: "r/vancouver", platform: "reddit", url: "https://www.reddit.com/r/vancouver/", memberCount: "500K", description: "Vancouver's main Reddit community." },
  ],
  jobBoards: [
    { name: "Indeed Canada — Vancouver", url: "https://ca.indeed.com/jobs?l=Vancouver%2C+BC", focus: "general", description: "Largest Canadian job aggregator." },
    { name: "WorkBC", url: "https://www.workbc.ca/jobs-careers", focus: "general", description: "British Columbia's official jobs portal." },
    { name: "LinkedIn Jobs — Vancouver", url: "https://www.linkedin.com/jobs/vancouver-jobs", focus: "general", description: "Strong for tech (Vancouver is Canada's #2 tech hub) and film." },
  ],
  housingSites: [
    { name: "Zumper — Vancouver", url: "https://www.zumper.com/apartments-for-rent/vancouver-bc", type: "rental", description: "Modern rental platform with map search." },
    { name: "Craigslist Vancouver", url: "https://vancouver.craigslist.org/search/apa", type: "rental", description: "Budget listings and room shares." },
    { name: "REW (Real Estate West)", url: "https://www.rew.ca/rentals", type: "rental", description: "Local BC platform with strong coverage." },
    { name: "Rentals.ca — Vancouver", url: "https://rentals.ca/vancouver", type: "rental", description: "Large rental database across Canada." },
  ],
  visaInfo: {
    description: "British Columbia's Provincial Nominee Program (BC PNP) offers fast-track permanent residency for skilled workers, especially in tech (BC PNP Tech). Express Entry and the Global Talent Stream cover most other pathways.",
    officialUrl: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
    commonVisaTypes: [
      "Express Entry (Federal Skilled Worker)",
      "BC Provincial Nominee Program (BC PNP)",
      "Global Talent Stream (tech)",
      "Study Permit → Post-Graduation Work Permit",
      "International Experience Canada (working holiday)",
    ],
  },
  healthcare: {
    description: "BC's Medical Services Plan (MSP) covers medically necessary care. There is typically a wait for MSP coverage after arrival — private insurance is recommended in the interim.",
    publicSystem: "Medical Services Plan (MSP)",
    insuranceUrl: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp",
  },
};

/** New York, United States */
export const NEW_YORK_RESOURCES: DestinationResources = {
  destinationId: "13",
  schools: [
    { name: "Columbia University", type: "university", website: "https://www.columbia.edu", language: "English", description: "Ivy League university in Morningside Heights." },
    { name: "New York University (NYU)", type: "university", website: "https://www.nyu.edu", language: "English", description: "Major private research university across Manhattan." },
    { name: "City University of New York (CUNY)", type: "university", website: "https://www.cuny.edu", language: "English", description: "Public university system with 25 campuses — accessible and diverse." },
    { name: "Parsons School of Design", type: "college", website: "https://www.newschool.edu/parsons/", language: "English", description: "World-famous art and design school in Greenwich Village." },
  ],
  communityLinks: [
    { name: "Expats in New York", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+new+york", memberCount: "50K+", description: "Newcomer community for the NYC area." },
    { name: "NYC Expats & Newcomers Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+new+york", memberCount: "10K+", description: "Networking and social events across the five boroughs." },
    { name: "r/AskNYC", platform: "reddit", url: "https://www.reddit.com/r/AskNYC/", memberCount: "600K", description: "Best Reddit community for practical NYC questions." },
  ],
  jobBoards: [
    { name: "Indeed — New York", url: "https://www.indeed.com/jobs?l=New+York%2C+NY", focus: "general", description: "The largest US job aggregator." },
    { name: "LinkedIn Jobs — New York", url: "https://www.linkedin.com/jobs/new-york-jobs", focus: "general", description: "Hub for finance, media, law and corporate roles." },
    { name: "Built In NYC", url: "https://builtin.com/new-york", focus: "tech", description: "Tech and startup jobs in New York." },
  ],
  housingSites: [
    { name: "StreetEasy", url: "https://streeteasy.com/for-rent/nyc", type: "rental", description: "The definitive NYC rental platform." },
    { name: "Zillow — New York", url: "https://www.zillow.com/new-york-ny/rentals/", type: "rental", description: "National platform with strong NYC coverage." },
    { name: "Apartments.com — New York", url: "https://www.apartments.com/new-york-ny/", type: "rental", description: "Large rental listing database." },
    { name: "Roomi", url: "https://www.roomiapp.com", type: "share", description: "Roommates and room shares in NYC." },
  ],
  visaInfo: {
    description: "The US employment-based system is employer-driven. H-1B (specialty occupations) is the most common work visa, subject to an annual lottery; L-1 is for intra-company transfers; O-1 for extraordinary ability. F-1 students get Optional Practical Training (OPT) after graduation. Green cards (EB-1/2/3) lead to permanent residency.",
    officialUrl: "https://www.uscis.gov/working-in-the-united-states",
    commonVisaTypes: [
      "H-1B Specialty Occupation visa",
      "L-1 Intracompany Transferee",
      "O-1 Extraordinary Ability",
      "F-1 Student + Optional Practical Training (OPT)",
      "EB-1 / EB-2 / EB-3 green cards",
      "J-1 Exchange Visitor",
    ],
  },
  healthcare: {
    description: "The US has a private, insurance-based system — there is no universal public coverage. Employer-sponsored plans are the norm; otherwise use the NY State of Health marketplace. Coverage is expensive but New York has strong consumer protections and Medicaid for low-income residents.",
    publicSystem: "Private insurance + Medicare/Medicaid (no universal public system)",
    insuranceUrl: "https://nystateofhealth.ny.gov",
  },
};

/** San Francisco, United States */
export const SAN_FRANCISCO_RESOURCES: DestinationResources = {
  destinationId: "14",
  schools: [
    { name: "University of California, Berkeley", type: "university", website: "https://www.berkeley.edu", language: "English", description: "World-leading public university across the bay, hub of innovation." },
    { name: "Stanford University", type: "university", website: "https://www.stanford.edu", language: "English", description: "Top-tier private university at the heart of Silicon Valley." },
    { name: "San Francisco State University", type: "university", website: "https://www.sfsu.edu", language: "English", description: "Public university in the city with strong liberal arts and business programs." },
  ],
  communityLinks: [
    { name: "Expats in San Francisco", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+san+francisco", memberCount: "20K+", description: "Newcomer community in the Bay Area." },
    { name: "SF Bay Area Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+san+francisco", memberCount: "15K+", description: "Tech, social and professional meetups." },
    { name: "r/AskSF", platform: "reddit", url: "https://www.reddit.com/r/AskSF/", memberCount: "200K", description: "Practical advice for living in San Francisco." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — San Francisco", url: "https://www.linkedin.com/jobs/san-francisco-jobs", focus: "general", description: "The primary platform for tech and corporate roles." },
    { name: "Built In SF", url: "https://builtin.com/san-francisco", focus: "tech", description: "Startup and tech job listings for the Bay Area." },
    { name: "Indeed — San Francisco", url: "https://www.indeed.com/jobs?l=San+Francisco%2C+CA", focus: "general", description: "Large job aggregator across industries." },
    { name: "Hacker News Who's Hiring", url: "https://news.ycombinator.com/submitted?id=whoishiring", focus: "tech", description: "Monthly thread with thousands of Bay Area tech openings." },
  ],
  housingSites: [
    { name: "Zillow — San Francisco", url: "https://www.zillow.com/san-francisco-ca/rentals/", type: "rental", description: "National platform with dense SF coverage." },
    { name: "Craigslist SF Bay Area", url: "https://sfbay.craigslist.org/search/apa", type: "rental", description: "The classic SF rental source — act fast on good listings." },
    { name: "Apartments.com — San Francisco", url: "https://www.apartments.com/san-francisco-ca/", type: "rental", description: "Large rental database with filters." },
    { name: "Roomi / SpareRoom SF", url: "https://www.spareroom.com/flatshare/san_francisco", type: "share", description: "Room shares for budget-friendly living." },
  ],
  visaInfo: {
    description: "Same US framework as New York, but the Bay Area tech ecosystem means H-1B and O-1 visas are especially common. Many tech companies sponsor green cards. Consider the EB-1 (extraordinary ability) route if you're a senior engineer or researcher.",
    officialUrl: "https://www.uscis.gov/working-in-the-united-states",
    commonVisaTypes: [
      "H-1B Specialty Occupation visa",
      "L-1 Intracompany Transferee",
      "O-1 Extraordinary Ability",
      "F-1 Student + OPT",
      "EB-1 / EB-2 / EB-3 green cards",
    ],
  },
  healthcare: {
    description: "California uses the Covered California marketplace; employer-sponsored insurance is standard. No universal public system — budget for premiums, and note that medical costs in the US are high without insurance.",
    publicSystem: "Private insurance + Covered California marketplace",
    insuranceUrl: "https://www.coveredca.com",
  },
};

// =============================================================================
// Tier 2 — Europe templates
// =============================================================================

/** Munich, Germany */
export const MUNICH_RESOURCES: DestinationResources = {
  destinationId: "5",
  schools: [
    { name: "Ludwig-Maximilians-Universität München (LMU)", type: "university", website: "https://www.lmu.de", language: "German", description: "One of Germany's top research universities." },
    { name: "Technical University of Munich (TUM)", type: "university", website: "https://www.tum.de", language: "German", description: "Elite technical university — engineering, computing and innovation." },
    { name: "Hochschule München (Munich University of Applied Sciences)", type: "college", website: "https://www.hm.edu", language: "German", description: "Germany's largest applied sciences university." },
  ],
  communityLinks: [
    { name: "Expats in Munich", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+munich", memberCount: "25K+", description: "Newcomer community for Munich." },
    { name: "Munich Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+munich", memberCount: "6K+", description: "Social and professional events." },
    { name: "r/Munich", platform: "reddit", url: "https://www.reddit.com/r/Munich/", memberCount: "150K", description: "Munich's Reddit community — practical advice." },
  ],
  jobBoards: [
    { name: "StepStone — Munich", url: "https://www.stepstone.de/jobs/muenchen", focus: "general", description: "Major German job board." },
    { name: "Indeed Deutschland — Munich", url: "https://de.indeed.com/jobs?l=M%C3%BCnchen", focus: "general", description: "Large aggregator with English-filter options." },
    { name: "LinkedIn Jobs — Munich", url: "https://www.linkedin.com/jobs/munich-jobs", focus: "general", description: "Strong for automotive (BMW, Audi), tech and finance." },
  ],
  housingSites: [
    { name: "ImmobilienScout24 — Munich", url: "https://www.immobilienscout24.de/Suche/wohnung-mieten/muenchen", type: "rental", description: "Germany's largest property portal." },
    { name: "WG-Gesucht — Munich", url: "https://www.wg-gesucht.de/wohnungen-in-muenchen.90.2.1.0.html", type: "share", description: "Shared flats and rooms." },
    { name: "Mr. Lodge", url: "https://www.mrlodge.com", type: "rental", description: "Furnished apartments for professionals — popular with expats." },
  ],
  visaInfo: {
    description: "Same German framework as Berlin: EU Blue Card, Skilled Worker visa and the Job Seeker visa. Bavaria processes skilled-worker applications quickly, and Munich's tech/engineering employers sponsor regularly.",
    officialUrl: "https://www.make-it-in-germany.com/en/visa-residence",
    commonVisaTypes: [
      "EU Blue Card",
      "Skilled Worker visa (Fachkraft)",
      "Job Seeker visa (6 months)",
      "Student visa",
      "ICT / intra-company transfer",
    ],
  },
  healthcare: {
    description: "Mandatory statutory health insurance (GKV) covers nearly everything; contributions are split between employer and employee. Private insurance is an option for high earners and the self-employed.",
    publicSystem: "Statutory health insurance (gesetzliche Krankenversicherung — GKV)",
    insuranceUrl: "https://www.make-it-in-germany.com/en/working-in-germany/health-insurance",
  },
};

/** Amsterdam, Netherlands */
export const AMSTERDAM_RESOURCES: DestinationResources = {
  destinationId: "10",
  schools: [
    { name: "University of Amsterdam (UvA)", type: "university", website: "https://www.uva.nl", language: "Dutch", description: "Large research university in the city centre, strong in social sciences and law." },
    { name: "Vrije Universiteit Amsterdam (VU)", type: "university", website: "https://vu.nl", language: "Dutch", description: "Research university in Zuidas, strong in medicine, economics and science." },
    { name: "Amsterdam University of Applied Sciences (HvA)", type: "college", website: "https://www.hva.nl", language: "Dutch", description: "The Netherlands' largest university of applied sciences." },
  ],
  communityLinks: [
    { name: "Expats in Amsterdam", platform: "facebook", url: "https://www.facebook.com/groups/expatsinamsterdam", memberCount: "60K+", description: "One of the largest expat communities in the Netherlands." },
    { name: "Amsterdam Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+amsterdam", memberCount: "12K+", description: "Social, tech and business meetups." },
    { name: "r/Amsterdam", platform: "reddit", url: "https://www.reddit.com/r/Amsterdam/", memberCount: "350K", description: "Amsterdam's Reddit community — housing, jobs and daily life." },
    { name: "InterNations Amsterdam", platform: "other", url: "https://www.internations.org/amsterdam-expats", memberCount: "35K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "Indeed Netherlands — Amsterdam", url: "https://nl.indeed.com/jobs?l=Amsterdam", focus: "general", description: "Large job aggregator with English-language filter." },
    { name: "LinkedIn Jobs — Amsterdam", url: "https://www.linkedin.com/jobs/amsterdam-jobs", focus: "general", description: "Hub for international companies and the 30% ruling crowd." },
    { name: "Undutchables", url: "https://www.undutchables.nl/jobs/", focus: "general", description: "Specialist in English-speaking jobs for internationals in the Netherlands." },
    { name: "Magnet.me", url: "https://magnet.me", focus: "startup", description: "Amsterdam startup scene — internships and graduate roles." },
  ],
  housingSites: [
    { name: "Funda", url: "https://www.funda.nl/huur/amsterdam/", type: "rental", description: "The Netherlands' most popular property portal." },
    { name: "Pararius", url: "https://www.pararius.com/apartments/amsterdam", type: "rental", description: "Rental-focused site with English interface." },
    { name: "Kamernet", url: "https://www.kamernet.nl/en/rooms-for-rent/amsterdam", type: "share", description: "Rooms and student housing in Amsterdam." },
    { name: "HousingAnywhere", url: "https://housinganywhere.com/Amsterdam--Netherlands", type: "rental", description: "Furnished rooms for internationals and students." },
  ],
  visaInfo: {
    description: "The Netherlands' Highly Skilled Migrant (kennismigrant) scheme is one of Europe's most expat-friendly routes — employers sponsor and income thresholds apply. EU citizens need no permit. The 30% tax ruling gives qualified expats a tax-free allowance for 5 years. DAFT (Dutch-American Friendship Treaty) lets US citizens start a business easily.",
    officialUrl: "https://ind.nl/en/Pages/default.aspx",
    commonVisaTypes: [
      "Highly Skilled Migrant (kennismigrant)",
      "EU Blue Card",
      "Orientation year visa (zoekjaar, for graduates)",
      "Startup visa / DAFT (US citizens)",
      "Student visa (MVV)",
      "Family reunification",
    ],
  },
  healthcare: {
    description: "Health insurance is mandatory in the Netherlands. You must buy a basic package from a Dutch insurer (about €130–150/month) — the government provides a care allowance (zorgtoeslag) for lower incomes. Coverage is comprehensive with free choice of hospital.",
    publicSystem: "Mandatory private basic insurance (Zorgverzekeringswet)",
    insuranceUrl: "https://www.government.nl/topics/health-insurance",
  },
};

/** Dublin, Ireland */
export const DUBLIN_RESOURCES: DestinationResources = {
  destinationId: "12",
  schools: [
    { name: "Trinity College Dublin", type: "university", website: "https://www.tcd.ie", language: "English", description: "Ireland's oldest and most prestigious university, in the city centre." },
    { name: "University College Dublin (UCD)", type: "university", website: "https://www.ucd.ie", language: "English", description: "Ireland's largest university, strong in business (Smurfit) and engineering." },
    { name: "Dublin City University (DCU)", type: "university", website: "https://www.dcu.ie", language: "English", description: "Modern university with strong tech, media and enterprise programs." },
    { name: "Technological University Dublin (TU Dublin)", type: "college", website: "https://www.tudublin.ie", language: "English", description: "Ireland's largest technological university." },
  ],
  communityLinks: [
    { name: "Expats in Dublin", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+dublin", memberCount: "30K+", description: "Newcomer community in Dublin." },
    { name: "Dublin Expats Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+dublin", memberCount: "8K+", description: "Social and professional events." },
    { name: "r/Dublin", platform: "reddit", url: "https://www.reddit.com/r/Dublin/", memberCount: "300K", description: "Dublin's Reddit community — housing, jobs, life." },
    { name: "InterNations Dublin", platform: "other", url: "https://www.internations.org/dublin-expats", memberCount: "20K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "Indeed Ireland — Dublin", url: "https://ie.indeed.com/jobs?l=Dublin", focus: "general", description: "The biggest job aggregator in Ireland." },
    { name: "LinkedIn Jobs — Dublin", url: "https://www.linkedin.com/jobs/dublin-jobs", focus: "general", description: "Dublin is the EU HQ hub for Big Tech — LinkedIn is essential." },
    { name: "IrishJobs.ie", url: "https://www.irishjobs.ie/jobs-in-dublin", focus: "general", description: "Ireland's leading job board." },
    { name: "SiliconeRepublic Jobs", url: "https://www.siliconrepublic.com/jobs", focus: "tech", description: "Tech-focused listings for Dublin's booming tech sector." },
  ],
  housingSites: [
    { name: "Daft.ie", url: "https://www.daft.ie/property-for-rent/dublin-city", type: "rental", description: "Ireland's dominant property portal." },
    { name: "Rent.ie", url: "https://www.rent.ie/houses-to-let/dublin/", type: "rental", description: "Rental listings across Dublin." },
    { name: "MyHome.ie", url: "https://www.myhome.ie/rentals/dublin", type: "rental", description: "Major property site with rental listings." },
    { name: "DublinRoomFinders (Facebook)", url: "https://www.facebook.com/groups/dublinroomfinders", type: "share", description: "Active group for rooms and flat shares in Dublin." },
  ],
  visaInfo: {
    description: "Ireland's Critical Skills Employment Permit is the fastest route for tech, medical and engineering professionals, leading to Stamp 4 (settlement) after 2 years. EU/EEA citizens need no permit. Recent graduates can use the Third Level Graduate Programme (Stamp 1G) to work for up to 2 years.",
    officialUrl: "https://www.irishimmigration.ie/",
    commonVisaTypes: [
      "Critical Skills Employment Permit",
      "General Employment Permit",
      "Third Level Graduate Programme (Stamp 1G)",
      "EU/EEA free movement (no permit needed)",
      "Working Holiday Authorisation (eligible countries)",
      "Family reunification (Stamp 4)",
    ],
  },
  healthcare: {
    description: "Ireland's public healthcare (HSE) provides means-tested services — GP visits and medicines have charges, though many services are free or subsidised for medical-card holders. Private health insurance is common and recommended to skip public waiting lists.",
    publicSystem: "Health Service Executive (HSE) — public system with co-payments",
    insuranceUrl: "https://www.hse.ie/eng/health/healthcare-services/",
  },
};

/** Barcelona, Spain */
export const BARCELONA_RESOURCES: DestinationResources = {
  destinationId: "17",
  schools: [
    { name: "University of Barcelona (UB)", type: "university", website: "https://www.ub.edu", language: "Spanish", description: "Spain's most prestigious public university, founded in 1450." },
    { name: "Universitat Pompeu Fabra (UPF)", type: "university", website: "https://www.upf.edu", language: "Spanish", description: "Young, highly ranked university strong in economics, law and communication." },
    { name: "Polytechnic University of Catalonia (UPC)", type: "university", website: "https://www.upc.edu", language: "Spanish", description: "Leading technical university in Spain — engineering and architecture." },
    { name: "IESE Business School", type: "university", website: "https://www.iese.edu", language: "English", description: "One of the world's top business schools, based in Barcelona." },
  ],
  communityLinks: [
    { name: "Expats in Barcelona", platform: "facebook", url: "https://www.facebook.com/groups/expatsinbarcelona", memberCount: "80K+", description: "Huge, active expat community in Barcelona." },
    { name: "Barcelona Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+barcelona", memberCount: "15K+", description: "Networking, language exchange and social events." },
    { name: "r/Barcelona", platform: "reddit", url: "https://www.reddit.com/r/Barcelona/", memberCount: "200K", description: "Barcelona's Reddit community — practical advice." },
    { name: "InterNations Barcelona", platform: "other", url: "https://www.internations.org/barcelona-expats", memberCount: "30K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "InfoJobs", url: "https://www.infojobs.net/barcelona", focus: "general", description: "Spain's most popular job board." },
    { name: "Indeed España — Barcelona", url: "https://es.indeed.com/jobs?l=Barcelona", focus: "general", description: "Large job aggregator." },
    { name: "LinkedIn Jobs — Barcelona", url: "https://www.linkedin.com/jobs/barcelona-jobs", focus: "general", description: "Strong for tech, tourism and multinationals." },
    { name: "Barcelona Tech City Jobs", url: "https://barcelonatechcity.com/jobs/", focus: "tech", description: "Startup and tech roles in Barcelona's innovation ecosystem." },
  ],
  housingSites: [
    { name: "Idealista — Barcelona", url: "https://www.idealista.com/en/alquiler-viviendas/barcelona-barcelona/", type: "rental", description: "The main Spanish property portal." },
    { name: "Fotocasa", url: "https://www.fotocasa.es/es/alquiler/viviendas/barcelona-capital/todas-zonas/l", type: "rental", description: "Major rental platform in Spain." },
    { name: "Habitaclia", url: "https://www.habitaclia.com/alquiler-barcelona.htm", type: "rental", description: "Barcelona-based agency listings." },
    { name: "Badi", url: "https://badi.com/en/rooms/barcelona", type: "share", description: "App for renting rooms directly from landlords." },
  ],
  visaInfo: {
    description: "Spain offers several residency routes: the non-lucrative visa (passive income), the digital nomad visa, and the autónomo (self-employment) route. The EU Blue Card covers highly skilled employment. Catalonia is a popular destination, and many expats work remotely on the nomad visa.",
    officialUrl: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx",
    commonVisaTypes: [
      "Digital Nomad visa",
      "Non-lucrative residence visa",
      "EU Blue Card",
      "Autónomo (self-employed) residence",
      "Student visa",
      "Golden Visa (investment)",
    ],
  },
  healthcare: {
    description: "Spain's public healthcare system (SNS) provides universal coverage, largely free at the point of use. Register for a health card (tarjeta sanitaria) once you have residency; many also buy private insurance (sanitas, etc.) for faster specialist access. Catalonia has an extensive public hospital network.",
    publicSystem: "Sistema Nacional de Salud (SNS) — Catalonia (CatSalut)",
    insuranceUrl: "https://catsalut.gencat.cat/en/",
  },
};

/** Stockholm, Sweden */
export const STOCKHOLM_RESOURCES: DestinationResources = {
  destinationId: "18",
  schools: [
    { name: "Stockholm University", type: "university", website: "https://www.su.se", language: "Swedish", description: "Large research university on the island of Frescati." },
    { name: "KTH Royal Institute of Technology", type: "university", website: "https://www.kth.se", language: "Swedish", description: "Sweden's leading technical university, a unicorn factory for tech talent." },
    { name: "Karolinska Institutet", type: "university", website: "https://ki.se", language: "Swedish", description: "World-leading medical university and Nobel Prize in Medicine host." },
    { name: "Stockholm School of Economics (SSE)", type: "university", website: "https://www.hhs.se", language: "English", description: "Top Nordic business school with programs in English." },
  ],
  communityLinks: [
    { name: "Expats in Stockholm", platform: "facebook", url: "https://www.facebook.com/groups/expatsinstockholm", memberCount: "40K+", description: "Active community for newcomers to Stockholm." },
    { name: "Stockholm Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+stockholm", memberCount: "7K+", description: "Fika nights, networking and social events." },
    { name: "r/stockholm", platform: "reddit", url: "https://www.reddit.com/r/stockholm/", memberCount: "180K", description: "Stockholm's Reddit community — practical advice." },
    { name: "InterNations Stockholm", platform: "other", url: "https://www.internations.org/stockholm-expats", memberCount: "22K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "Arbetsförmedlingen", url: "https://arbetsformedlingen.se/platsbanken/", focus: "general", description: "Sweden's official Public Employment Service job bank." },
    { name: "LinkedIn Jobs — Stockholm", url: "https://www.linkedin.com/jobs/stockholm-jobs", focus: "general", description: "Essential for Stockholm's tech and startup scene." },
    { name: "Indeed Sweden — Stockholm", url: "https://se.indeed.com/jobs?l=Stockholm", focus: "general", description: "Large job aggregator." },
    { name: "The Local Sweden Jobs", url: "https://www.thelocal.se/jobs", focus: "general", description: "English-language job listings for internationals." },
  ],
  housingSites: [
    { name: "Blocket Bostad", url: "https://bostad.blocket.se", type: "rental", description: "Sweden's biggest classifieds for rentals." },
    { name: "Bostad Direkt", url: "https://www.bostaddirekt.com", type: "rental", description: "Direct landlord rentals (no queue)." },
    { name: "Qasa", url: "https://www.qasa.se", type: "rental", description: "Verified rental platform with contracts." },
    { name: "Samtrygg", url: "https://www.samtrygg.se", type: "rental", description: "Rental platform with identity checks." },
  ],
  visaInfo: {
    description: "Sweden's work permit is employer-sponsored and straightforward — the employer must offer at least the collective-agreement salary. EU/EEA citizens need no permit. Highly qualified workers in shortage occupations can get a 'Highly Qualified Person' residence permit to job-hunt.",
    officialUrl: "https://www.migrationsverket.se/English.html",
    commonVisaTypes: [
      "Work permit (employer-sponsored)",
      "EU Blue Card",
      "Highly Qualified Person (job-seeking) permit",
      "Self-employment residence permit",
      "Student residence permit",
      "EU/EEA free movement",
    ],
  },
  healthcare: {
    description: "Sweden's publicly funded healthcare system (Region Stockholm) provides heavily subsidised care — low patient fees with an annual cap (~SEK 1,400). Everyone registered in Sweden is covered. Dental care is subsidised for adults; most care is of very high quality.",
    publicSystem: "Region Stockholm — publicly funded healthcare",
    insuranceUrl: "https://www.1177.se/en/stockholm/",
  },
};

// =============================================================================
// Tier 2 — Asia templates
// =============================================================================

/** Singapore */
export const SINGAPORE_RESOURCES: DestinationResources = {
  destinationId: "9",
  schools: [
    { name: "National University of Singapore (NUS)", type: "university", website: "https://www.nus.edu.sg", language: "English", description: "Asia's top-ranked university, consistently in the global top 20." },
    { name: "Nanyang Technological University (NTU)", type: "university", website: "https://www.ntu.edu.sg", language: "English", description: "Global top-30 university strong in engineering and business." },
    { name: "Singapore Management University (SMU)", type: "university", website: "https://www.smu.edu.sg", language: "English", description: "Premier business university in the city centre." },
    { name: "Singapore University of Technology and Design (SUTD)", type: "university", website: "https://www.sutd.edu.sg", language: "English", description: "Design-centric tech university founded with MIT." },
  ],
  communityLinks: [
    { name: "Expats in Singapore", platform: "facebook", url: "https://www.facebook.com/groups/expatsinsingapore", memberCount: "120K+", description: "One of the largest expat groups in Asia." },
    { name: "Singapore Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+singapore", memberCount: "20K+", description: "Networking and social events for internationals." },
    { name: "r/singapore", platform: "reddit", url: "https://www.reddit.com/r/singapore/", memberCount: "500K", description: "Singapore's Reddit community — practical advice." },
    { name: "InterNations Singapore", platform: "other", url: "https://www.internations.org/singapore-expats", memberCount: "50K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "MyCareersFuture", url: "https://www.mycareersfuture.gov.sg/", focus: "general", description: "Singapore's official government job portal." },
    { name: "LinkedIn Jobs — Singapore", url: "https://www.linkedin.com/jobs/singapore-jobs", focus: "general", description: "The key platform for professional roles in Singapore." },
    { name: "JobStreet Singapore", url: "https://www.jobstreet.com.sg", focus: "general", description: "Popular job board across Southeast Asia." },
    { name: "NodeFlair", url: "https://nodeflair.com/jobs", focus: "tech", description: "Tech salary insights and engineering roles in Singapore." },
  ],
  housingSites: [
    { name: "PropertyGuru", url: "https://www.propertyguru.com.sg/property-for-rent", type: "rental", description: "Singapore's leading property portal." },
    { name: "99.co", url: "https://www.99.co/singapore/rent", type: "rental", description: "Modern rental platform with map search." },
    { name: "SRX", url: "https://www.srx.com.sg/rent", type: "rental", description: "Popular rental listing site." },
    { name: "Roomz / Room rental groups", url: "https://www.facebook.com/groups/roomzsingapore", type: "share", description: "Room rentals and HDB flat shares." },
  ],
  visaInfo: {
    description: "Singapore's work pass system is employer-driven: the Employment Pass (EP) for professionals, S Pass for mid-skilled workers, and COMPASS points-based evaluation for EP applications. Entrepreneurs can use the EntrePass; the Tech.Pass targets experienced tech founders and leaders. Permanent residence (PR) is available after time on a work pass.",
    officialUrl: "https://www.mom.gov.sg/passes-and-permits",
    commonVisaTypes: [
      "Employment Pass (EP)",
      "S Pass",
      "EntrePass (entrepreneurs)",
      "Tech.Pass (tech leaders)",
      "Personalised Employment Pass (PEP)",
      "Permanent Residence (PR) — application",
    ],
  },
  healthcare: {
    description: "Singapore has a world-class healthcare system financed by mandatory savings (CPF Medisave) plus MediShield Life basic insurance. Public hospitals (restructured) are subsidised for citizens/PRs; foreigners on work passes get private or employer-provided coverage. Costs are high but quality is exceptional.",
    publicSystem: "Public system via Medisave + MediShield Life (mandatory savings/insurance)",
    insuranceUrl: "https://www.moh.gov.sg/healthcare-schemes-subsidies",
  },
};

/** Tokyo, Japan */
export const TOKYO_RESOURCES: DestinationResources = {
  destinationId: "16",
  schools: [
    { name: "University of Tokyo (Todai)", type: "university", website: "https://www.u-tokyo.ac.jp", language: "Japanese", description: "Japan's most prestigious university, in Hongo." },
    { name: "Waseda University", type: "university", website: "https://www.waseda.jp", language: "Japanese", description: "Top private university in Shinjuku, strong in politics and business." },
    { name: "Keio University", type: "university", website: "https://www.keio.ac.jp", language: "Japanese", description: "Japan's oldest modern university, with strong economics and medicine." },
    { name: "Tokyo Institute of Technology (Tokyo Tech)", type: "university", website: "https://www.titech.ac.jp", language: "Japanese", description: "Japan's leading science and engineering university." },
  ],
  communityLinks: [
    { name: "Expats in Tokyo", platform: "facebook", url: "https://www.facebook.com/groups/expatsintokyo", memberCount: "100K+", description: "Large expat community in Tokyo." },
    { name: "Tokyo Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+tokyo", memberCount: "18K+", description: "Social, tech and language-exchange events." },
    { name: "r/Tokyo", platform: "reddit", url: "https://www.reddit.com/r/Tokyo/", memberCount: "300K", description: "Tokyo's Reddit community — living advice for foreigners." },
    { name: "InterNations Tokyo", platform: "other", url: "https://www.internations.org/tokyo-expats", memberCount: "40K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "GaijinPot Jobs", url: "https://jobs.gaijinpot.com", focus: "general", description: "The classic English-language job board for Japan." },
    { name: "Daijob", url: "https://www.daijob.com", focus: "general", description: "Bilingual (English/Japanese) professional job board." },
    { name: "Indeed Japan — Tokyo", url: "https://jp.indeed.com/jobs?l=%E6%9D%B1%E4%BA%AC", focus: "general", description: "Large job aggregator." },
    { name: "LinkedIn Jobs — Tokyo", url: "https://www.linkedin.com/jobs/tokyo-jobs", focus: "general", description: "Growing for international and startup roles." },
  ],
  housingSites: [
    { name: "SUUMO", url: "https://suumo.jp/chintai/tokyo/", type: "rental", description: "Japan's largest rental listing site (Japanese)." },
    { name: "UR Housing", url: "https://www.ur-housing.com/en/", type: "rental", description: "Government housing agency — no deposit or guarantor needed." },
    { name: "GaijinPot Apartments", url: "https://apartments.gaijinpot.com/en", type: "rental", description: "Foreigner-friendly apartments in English." },
    { name: "KimiJi / Kagaya", url: "https://www.kimiji.jp/en/", type: "share", description: "Share houses (guest houses) for internationals." },
  ],
  visaInfo: {
    description: "Japan's work visa (Engineer/Specialist in Humanities/International Services) is employer-sponsored and the standard route for professionals. The Highly Skilled Professional (HSP) visa offers fast-track permanent residency with a points system. English teachers use the Instructor/ALT route; students can work part-time with permission.",
    officialUrl: "https://www.moj.go.jp/isa/english.html",
    commonVisaTypes: [
      "Engineer / Specialist in Humanities / International Services",
      "Highly Skilled Professional (HSP)",
      "Instructor (ALT/teaching)",
      "Student visa",
      "Working Holiday (eligible countries)",
      "Spouse / Family visa",
    ],
  },
  healthcare: {
    description: "Japan's National Health Insurance (NHI) covers everyone registered as a resident — you pay 30% of medical costs at the point of care with a monthly cap. Enrolment is mandatory within 14 days of moving. Quality is excellent and costs are modest compared to Western countries.",
    publicSystem: "National Health Insurance (NHI) — universal coverage",
    insuranceUrl: "https://www.city.tokyo.lg.jp/en/",
  },
};

// =============================================================================
// Tier 2 — Oceania templates
// =============================================================================

/** Melbourne, Australia */
export const MELBOURNE_RESOURCES: DestinationResources = {
  destinationId: "7",
  schools: [
    { name: "University of Melbourne", type: "university", website: "https://www.unimelb.edu.au", language: "English", description: "Australia's top-ranked university, in Parkville." },
    { name: "Monash University", type: "university", website: "https://www.monash.edu", language: "English", description: "One of Australia's largest universities, strong in medicine and business." },
    { name: "RMIT University", type: "university", website: "https://www.rmit.edu.au", language: "English", description: "City-centre university strong in design, tech and vocational programs." },
    { name: "Swinburne University of Technology", type: "university", website: "https://www.swinburne.edu.au", language: "English", description: "Technology-focused university in Hawthorn." },
  ],
  communityLinks: [
    { name: "Expats in Melbourne", platform: "facebook", url: "https://www.facebook.com/groups/expatsinmelbourne", memberCount: "45K+", description: "Active newcomer community." },
    { name: "Melbourne Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+melbourne", memberCount: "9K+", description: "Social events, hikes and networking." },
    { name: "r/melbourne", platform: "reddit", url: "https://www.reddit.com/r/melbourne/", memberCount: "450K", description: "Melbourne's Reddit community — local advice." },
  ],
  jobBoards: [
    { name: "Seek — Melbourne", url: "https://www.seek.com.au/jobs-in-melbourne-vic", focus: "general", description: "Australia's biggest job board." },
    { name: "Indeed Australia — Melbourne", url: "https://au.indeed.com/jobs?l=Melbourne+VIC", focus: "general", description: "Large job aggregator." },
    { name: "LinkedIn Jobs — Melbourne", url: "https://www.linkedin.com/jobs/melbourne-jobs", focus: "general", description: "Strong for professional and corporate roles." },
  ],
  housingSites: [
    { name: "Realestate.com.au — Melbourne", url: "https://www.realestate.com.au/rent/in-melbourne,+vic", type: "rental", description: "Australia's most popular property portal." },
    { name: "Domain — Melbourne", url: "https://www.domain.com.au/rent/melbourne-vic/", type: "rental", description: "Major property site." },
    { name: "Flatmates.com.au", url: "https://www.flatmates.com.au/rooms/melbourne", type: "share", description: "Share accommodation network." },
    { name: "Fairy Floss Real Estate", url: "https://fairyflossrealestate.com", type: "share", description: "Iconic Melbourne rental meme page with real listings." },
  ],
  visaInfo: {
    description: "Same Australian framework as Sydney: points-tested skilled migration (189/190), employer sponsorship (482), student (500) and Working Holiday (417/462). Victoria's skilled occupation list (VIC 190) targets tech, health and engineering.",
    officialUrl: "https://immi.homeaffairs.gov.au",
    commonVisaTypes: [
      "Skilled Independent visa (subclass 189)",
      "Skilled Nominated visa (subclass 190 — VIC)",
      "Employer Sponsored / TSS (subclass 482)",
      "Student visa (subclass 500)",
      "Working Holiday visa (subclass 417/462)",
    ],
  },
  healthcare: {
    description: "Medicare covers doctor visits and public hospital care. Victoria also offers bulk-billed GP clinics and a strong public hospital network. Some temporary visas require private health insurance (OVHC).",
    publicSystem: "Medicare + Victorian public hospitals",
    insuranceUrl: "https://www.servicesaustralia.gov.au/medicare",
  },
};

/** Auckland, New Zealand */
export const AUCKLAND_RESOURCES: DestinationResources = {
  destinationId: "11",
  schools: [
    { name: "University of Auckland", type: "university", website: "https://www.auckland.ac.nz", language: "English", description: "New Zealand's largest and highest-ranked university." },
    { name: "Auckland University of Technology (AUT)", type: "university", website: "https://www.aut.ac.nz", language: "English", description: "Modern university strong in business, health and creative tech." },
    { name: "Massey University (Auckland campus)", type: "university", website: "https://www.massey.ac.nz", language: "English", description: "National university with a large Auckland campus in Albany." },
  ],
  communityLinks: [
    { name: "Expats in Auckland", platform: "facebook", url: "https://www.facebook.com/groups/expatsinauckland", memberCount: "25K+", description: "Newcomer community in Auckland." },
    { name: "Auckland Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+auckland", memberCount: "4K+", description: "Social and outdoor events." },
    { name: "r/auckland", platform: "reddit", url: "https://www.reddit.com/r/auckland/", memberCount: "150K", description: "Auckland's Reddit community." },
  ],
  jobBoards: [
    { name: "Seek NZ — Auckland", url: "https://www.seek.co.nz/jobs-in-auckland", focus: "general", description: "New Zealand's biggest job board." },
    { name: "Trade Me Jobs", url: "https://www.trademe.co.nz/jobs/location/auckland", focus: "general", description: "Popular local job listings." },
    { name: "LinkedIn Jobs — Auckland", url: "https://www.linkedin.com/jobs/auckland-jobs", focus: "general", description: "Strong for professional roles." },
  ],
  housingSites: [
    { name: "Trade Me Property", url: "https://www.trademe.co.nz/property/rent/auckland", type: "rental", description: "New Zealand's most-used rental site." },
    { name: "Realestate.co.nz", url: "https://www.realestate.co.nz/rent/auckland", type: "rental", description: "Major property portal." },
    { name: "Flatmates.co.nz", url: "https://www.flatmates.co.nz/flatmates-wanted/auckland", type: "share", description: "Room and flatmate listings." },
  ],
  visaInfo: {
    description: "New Zealand's Accredited Employer Work Visa (AEWV) replaced the old Essential Skills visa — employers must be accredited and jobs must meet wage thresholds. Skilled Migrant Category and the Green List (health, construction, tech, engineering) offer direct residency routes. Working Holiday visas cover many nationalities.",
    officialUrl: "https://www.immigration.govt.nz",
    commonVisaTypes: [
      "Accredited Employer Work Visa (AEWV)",
      "Skilled Migrant Category",
      "Green List Straight to Residence",
      "Student visa",
      "Working Holiday visa",
      "Partner / Family visa",
    ],
  },
  healthcare: {
    description: "New Zealand's public healthcare system is funded by taxes and largely free for residents: GP visits are subsidised, public hospital care is free, and most prescription medicines cost NZ$5. You need to enrol with a local PHO (Primary Health Organisation). Accident care is covered by ACC for everyone in NZ.",
    publicSystem: "Public healthcare via PHOs + ACC (accident coverage)",
    insuranceUrl: "https://www.health.govt.nz",
  },
};

// =============================================================================
// Tier 2 — Africa templates
// =============================================================================

/** Cape Town, South Africa */
export const CAPE_TOWN_RESOURCES: DestinationResources = {
  destinationId: "19",
  schools: [
    { name: "University of Cape Town (UCT)", type: "university", website: "https://www.uct.ac.za", language: "English", description: "Africa's highest-ranked university, below Table Mountain." },
    { name: "Stellenbosch University", type: "university", website: "https://www.sun.ac.za", language: "Afrikaans", description: "Top research university in the Cape Winelands, strong in business and engineering." },
    { name: "University of the Western Cape (UWC)", type: "university", website: "https://www.uwc.ac.za", language: "English", description: "Public university in Bellville with strong law and science programs." },
    { name: "Cape Peninsula University of Technology (CPUT)", type: "college", website: "https://www.cput.ac.za", language: "English", description: "Applied technology and vocational programs." },
  ],
  communityLinks: [
    { name: "Expats in Cape Town", platform: "facebook", url: "https://www.facebook.com/groups/expatsincapetown", memberCount: "50K+", description: "Large, active expat community." },
    { name: "Cape Town Digital Nomads", platform: "facebook", url: "https://www.facebook.com/groups/capetowndigitalnomads", memberCount: "25K+", description: "Remote workers community in the Mother City." },
    { name: "r/capetown", platform: "reddit", url: "https://www.reddit.com/r/capetown/", memberCount: "150K", description: "Cape Town's Reddit community — practical advice." },
    { name: "InterNations Cape Town", platform: "other", url: "https://www.internations.org/cape-town-expats", memberCount: "18K+", description: "Global expat network with regular events." },
  ],
  jobBoards: [
    { name: "Careers24", url: "https://www.careers24.com/jobs/western-cape/cape-town", focus: "general", description: "One of South Africa's biggest job boards." },
    { name: "PNet", url: "https://www.pnet.co.za/jobs/cape-town", focus: "general", description: "Popular South African job portal." },
    { name: "Indeed South Africa — Cape Town", url: "https://za.indeed.com/jobs?l=Cape+Town", focus: "general", description: "Large job aggregator." },
    { name: "OfferZen", url: "https://www.offerzen.com", focus: "tech", description: "Tech job platform connecting developers with companies." },
  ],
  housingSites: [
    { name: "Property24", url: "https://www.property24.com/to-rent/cape-town/western-cape/1", type: "rental", description: "South Africa's leading property portal." },
    { name: "Private Property", url: "https://www.privateproperty.co.za/to-rent/western-cape/cape-town", type: "rental", description: "Major rental listings." },
    { name: "Gumtree South Africa", url: "https://www.gumtree.co.za/s-property-to-rent/capetown", type: "rental", description: "Classifieds with budget listings." },
  ],
  visaInfo: {
    description: "South Africa's Critical Skills Work Visa (now part of the new points-based system) targets in-demand professions, and the General Work Visa requires a labour-market test. A Remote Work Visa (2024) lets remote workers stay up to 6 months. Retirees use the financially independent permit.",
    officialUrl: "https://www.vfsglobal.com/en/individuals/article-south-africa.html",
    commonVisaTypes: [
      "Critical Skills Work Visa",
      "General Work Visa",
      "Remote Work Visa",
      "Financially Independent / Retiree permit",
      "Study visa",
      "Spousal / Life partner visa",
    ],
  },
  healthcare: {
    description: "South Africa has a dual system: public healthcare (free or subsidised for citizens) and a strong private sector used by most professionals via medical aid schemes. Expats typically take private medical insurance (e.g., Discovery Health). Cape Town has excellent private hospitals.",
    publicSystem: "Public healthcare (National Department of Health) + private medical aid",
    insuranceUrl: "https://www.discovery.co.za/medical-aid",
  },
};

/** Nairobi, Kenya */
export const NAIROBI_RESOURCES: DestinationResources = {
  destinationId: "20",
  schools: [
    { name: "University of Nairobi", type: "university", website: "https://www.uonbi.ac.ke", language: "English", description: "Kenya's largest and most prestigious university." },
    { name: "Strathmore University", type: "university", website: "https://www.strathmore.edu", language: "English", description: "Top private university strong in business, law and IT." },
    { name: "Kenyatta University", type: "university", website: "https://www.ku.ac.ke", language: "English", description: "Large public university in Nairobi." },
    { name: "JKUAT (Jomo Kenyatta University of Agriculture & Technology)", type: "university", website: "https://www.jkuat.ac.ke", language: "English", description: "Leading technology and engineering university." },
  ],
  communityLinks: [
    { name: "Expats in Nairobi", platform: "facebook", url: "https://www.facebook.com/groups/expatsinnairobi", memberCount: "40K+", description: "Active expat community in Nairobi." },
    { name: "Nairobi Expats Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+nairobi", memberCount: "4K+", description: "Networking and social events." },
    { name: "r/Kenya", platform: "reddit", url: "https://www.reddit.com/r/Kenya/", memberCount: "120K", description: "Kenya's Reddit community." },
    { name: "InterNations Nairobi", platform: "other", url: "https://www.internations.org/nairobi-expats", memberCount: "12K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "BrighterMonday Kenya", url: "https://www.brightermonday.co.ke", focus: "general", description: "Kenya's most popular job board." },
    { name: "Fuzu", url: "https://www.fuzu.com/kenya", focus: "general", description: "Career platform with Kenyan listings." },
    { name: "LinkedIn Jobs — Nairobi", url: "https://www.linkedin.com/jobs/nairobi-jobs", focus: "general", description: "Strong for professional and NGO roles." },
    { name: "MyJobMag Kenya", url: "https://www.myjobmag.co.ke", focus: "general", description: "Job listings with application tracking." },
  ],
  housingSites: [
    { name: "Property24 Kenya", url: "https://www.property24.co.ke/to-rent/nairobi", type: "rental", description: "Leading Kenyan property portal." },
    { name: "Jiji Kenya", url: "https://jiji.co.ke/houses-apartments-for-rent/nairobi-cbd", type: "rental", description: "Popular classifieds with rental listings." },
    { name: "RentKenya", url: "https://www.rentkenya.com", type: "rental", description: "Nairobi-focused rental listings." },
    { name: "Airbnb — Nairobi", url: "https://www.airbnb.com/nairobi-kenya/stays", type: "short-term", description: "Short-term stays while house-hunting." },
  ],
  visaInfo: {
    description: "Kenya moved to an eTA (Electronic Travel Authorisation) system in 2024 for visitors. Work permits (Class D for professionals, Class G for expatriates) require an employer sponsor. The new Digital Nomad Work Permit (2024) targets remote workers earning from abroad.",
    officialUrl: "https://www.etakenya.go.ke",
    commonVisaTypes: [
      "eTA (visitor / tourist)",
      "Class D Work Permit (professionals)",
      "Class G Work Permit (expatriates)",
      "Digital Nomad Work Permit",
      "Student Pass",
      "Dependent Pass",
    ],
  },
  healthcare: {
    description: "Kenya's healthcare is a mix of public hospitals, private facilities and NHIF (National Health Insurance Fund) — enrolment is mandatory for formal employees. Expatriates commonly use private hospitals (e.g., Aga Khan, Nairobi Hospital) with international health insurance.",
    publicSystem: "NHIF (National Hospital Insurance Fund) + private hospitals",
    insuranceUrl: "https://www.nhif.or.ke",
  },
};

/** Lagos, Nigeria */
export const LAGOS_RESOURCES: DestinationResources = {
  destinationId: "21",
  schools: [
    { name: "University of Lagos (UNILAG)", type: "university", website: "https://unilag.edu.ng", language: "English", description: "Nigeria's most prestigious public university." },
    { name: "Covenant University", type: "university", website: "https://covenantuniversity.edu.ng", language: "English", description: "Top private university in Ota, near Lagos." },
    { name: "Pan-Atlantic University", type: "university", website: "https://www.pau.edu.ng", language: "English", description: "Private university with a renowned business school (LBS)." },
    { name: "Lagos State University (LASU)", type: "university", website: "https://www.lasu.edu.ng", language: "English", description: "Major state university in Ojo." },
  ],
  communityLinks: [
    { name: "Expats in Lagos", platform: "facebook", url: "https://www.facebook.com/groups/expatsinlagos", memberCount: "30K+", description: "Expat community in Lagos." },
    { name: "Lagos Business & Tech Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+lagos", memberCount: "3K+", description: "Networking events for professionals." },
    { name: "r/Nigeria", platform: "reddit", url: "https://www.reddit.com/r/Nigeria/", memberCount: "200K", description: "Nigeria's Reddit community." },
  ],
  jobBoards: [
    { name: "Jobberman Nigeria", url: "https://www.jobberman.com", focus: "general", description: "Nigeria's largest job board." },
    { name: "MyJobMag", url: "https://www.myjobmag.com", focus: "general", description: "Job listings across Nigeria." },
    { name: "LinkedIn Jobs — Lagos", url: "https://www.linkedin.com/jobs/lagos-jobs", focus: "general", description: "Strong for professional roles." },
    { name: "Indeed Nigeria", url: "https://ng.indeed.com/jobs?l=Lagos", focus: "general", description: "Large job aggregator." },
  ],
  housingSites: [
    { name: "PropertyPro", url: "https://www.propertypro.ng/for-rent/lagos", type: "rental", description: "Leading Nigerian property platform." },
    { name: "Nigeria Property Centre", url: "https://nigeriapropertycentre.com/for-rent/lagos", type: "rental", description: "Large rental database." },
    { name: "Jiji Nigeria", url: "https://jiji.ng/real-estate", type: "rental", description: "Popular classifieds with rentals." },
    { name: "Airbnb — Lagos", url: "https://www.airbnb.com/lagos-nigeria/stays", type: "short-term", description: "Short-term stays." },
  ],
  visaInfo: {
    description: "Nigeria requires a visa for most nationalities. Work and residency require an Expatriate Quota (EQ) allocation sponsored by the employer, leading to a CERPAC residence permit. The STR (Subject to Regularisation) visa is the entry permit for workers. Nigeria is gradually introducing e-visas.",
    officialUrl: "https://immigration.gov.ng",
    commonVisaTypes: [
      "Visa on Arrival (business, pre-approved)",
      "STR (Subject to Regularisation) visa",
      "Expatriate Quota (EQ) positions",
      "CERPAC residence permit",
      "Student visa",
      "Temporary Work Permit (TWP)",
    ],
  },
  healthcare: {
    description: "Nigeria's healthcare system combines public hospitals and a growing private sector. The NHIS (National Health Insurance Scheme, now NHIA) covers formal employees. Expatriates in Lagos typically use private clinics and international insurance — quality varies widely, so research facilities carefully.",
    publicSystem: "NHIS/NHIA (National Health Insurance Authority) + private facilities",
    insuranceUrl: "https://www.nhia.gov.ng",
  },
};

/** Accra, Ghana */
export const ACCRA_RESOURCES: DestinationResources = {
  destinationId: "22",
  schools: [
    { name: "University of Ghana", type: "university", website: "https://www.ug.edu.gh", language: "English", description: "Ghana's premier university, in Legon on the edge of Accra." },
    { name: "Ashesi University", type: "university", website: "https://www.ashesi.edu.gh", language: "English", description: "Highly regarded private university focused on ethics, leadership and technology." },
    { name: "GIMPA (Ghana Institute of Management and Public Administration)", type: "university", website: "https://www.gimpa.edu.gh", language: "English", description: "Leading management and public administration institute." },
    { name: "Accra Technical University", type: "college", website: "https://atu.edu.gh", language: "English", description: "Applied technology and vocational training." },
  ],
  communityLinks: [
    { name: "Expats in Accra", platform: "facebook", url: "https://www.facebook.com/groups/expatsinaccra", memberCount: "25K+", description: "Newcomer community in Accra." },
    { name: "Accra Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+accra", memberCount: "3K+", description: "Social and professional events." },
    { name: "r/ghana", platform: "reddit", url: "https://www.reddit.com/r/ghana/", memberCount: "80K", description: "Ghana's Reddit community." },
    { name: "InterNations Accra", platform: "other", url: "https://www.internations.org/accra-expats", memberCount: "8K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "Jobberman Ghana", url: "https://www.jobbermanghana.com", focus: "general", description: "Popular Ghanaian job board." },
    { name: "GhanaWeb Jobs", url: "https://jobs.ghanaweb.com", focus: "general", description: "Job listings on Ghana's leading news portal." },
    { name: "LinkedIn Jobs — Accra", url: "https://www.linkedin.com/jobs/accra-jobs", focus: "general", description: "Strong for banking, NGO and professional roles." },
    { name: "MyJobMag Ghana", url: "https://www.myjobmaggh.com", focus: "general", description: "Job listings across Ghana." },
  ],
  housingSites: [
    { name: "Meqasa", url: "https://www.meqasa.com/rent/accra", type: "rental", description: "Ghana's leading property platform." },
    { name: "Ghana Property Centre", url: "https://www.ghanapropertycentre.com/for-rent/accra", type: "rental", description: "Large rental database." },
    { name: "Jiji Ghana", url: "https://jiji.com.gh/real-estate", type: "rental", description: "Classifieds with rental listings." },
  ],
  visaInfo: {
    description: "Ghana requires visas for most nationalities. Work permits are sponsored by employers through the Ghana Immigration Service, and residence permits are issued after approval. The e-visa system (2024) covers many visitors; ECOWAS citizens need no visa.",
    officialUrl: "https://www.ghanaimmigration.org",
    commonVisaTypes: [
      "Work permit (employer-sponsored)",
      "Residence permit",
      "e-Visa (visitors)",
      "Student permit",
      "Dependent permit",
      "ECOWAS free movement (no visa)",
    ],
  },
  healthcare: {
    description: "Ghana's NHIS (National Health Insurance Scheme) covers basic care for enrolled members, including formal employees. Private hospitals (e.g., Korle-Bu, Nyaho, Lister) are the norm for expatriates, often with international insurance. Public hospitals are government-funded.",
    publicSystem: "NHIS (National Health Insurance Scheme) + public hospitals",
    insuranceUrl: "https://www.nhis.gov.gh",
  },
};

/** Casablanca, Morocco */
export const CASABLANCA_RESOURCES: DestinationResources = {
  destinationId: "23",
  schools: [
    { name: "Hassan II University of Casablanca", type: "university", website: "https://www.univh2c.ma", language: "French", description: "Large public university across multiple campuses in Casablanca." },
    { name: "Al Akhawayn University", type: "university", website: "https://www.aui.ma", language: "English", description: "Morocco's premier English-language liberal arts university (in Ifrane)." },
    { name: "EM Lyon Business School (Casablanca)", type: "university", website: "https://em-lyon.com", language: "French", description: "French grande école with a campus in Casablanca." },
    { name: "ISCAE (Institut Supérieur de Commerce et d'Administration des Entreprises)", type: "university", website: "https://www.iscae.ma", language: "French", description: "Morocco's leading management school." },
  ],
  communityLinks: [
    { name: "Expats in Casablanca", platform: "facebook", url: "https://www.facebook.com/groups/expatsincasablanca", memberCount: "20K+", description: "Expat community in Casablanca." },
    { name: "Casablanca Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+casablanca", memberCount: "2K+", description: "Social and professional events." },
    { name: "r/Morocco", platform: "reddit", url: "https://www.reddit.com/r/Morocco/", memberCount: "150K", description: "Morocco's Reddit community." },
    { name: "InterNations Casablanca", platform: "other", url: "https://www.internations.org/casablanca-expats", memberCount: "10K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "Rekrute", url: "https://www.rekrute.com", focus: "general", description: "Morocco's leading job board." },
    { name: "Maroc Emploi", url: "https://www.marocemploic.com", focus: "general", description: "Popular Moroccan job site." },
    { name: "LinkedIn Jobs — Casablanca", url: "https://www.linkedin.com/jobs/casablanca-jobs", focus: "general", description: "Strong for banking, industry and call centres." },
    { name: "Bayt Morocco", url: "https://www.bayt.com/en/morocco/jobs/casablanca/", focus: "general", description: "Middle East job platform's Moroccan listings." },
  ],
  housingSites: [
    { name: "Avito Morocco", url: "https://www.avito.ma/fr/maroc/appartements_%C3%A0_louer", type: "rental", description: "Morocco's biggest classifieds site." },
    { name: "Mubawab", url: "https://www.mubawab.ma/fr/ct/casablanca/immobilier-location", type: "rental", description: "Real estate portal focused on Morocco." },
    { name: "Yakeey", url: "https://www.yakeey.com", type: "rental", description: "Moroccan real estate platform." },
  ],
  visaInfo: {
    description: "Morocco grants visa-free entry to many nationalities (including US, UK, EU, Canada) for 90 days. Longer stays need a residence permit (carte de séjour) obtained through employment or investment. The employer typically sponsors work authorisation.",
    officialUrl: "https://www.consulat.ma/en",
    commonVisaTypes: [
      "Visa-free entry (90 days, many nationalities)",
      "Residence permit (carte de séjour)",
      "Work authorisation (employer-sponsored)",
      "Investor residence",
      "Student visa",
      "Family reunification",
    ],
  },
  healthcare: {
    description: "Morocco's healthcare combines public facilities (CHU Ibn Rochd hospital network) with a strong private sector. The CNSS/AMO (Assurance Maladie Obligatoire) social insurance covers employees; expatriates usually take private international health insurance.",
    publicSystem: "CNSS / AMO (Assurance Maladie Obligatoire) + private hospitals",
    insuranceUrl: "https://www.cnsa.ma",
  },
};

/** Kigali, Rwanda */
export const KIGALI_RESOURCES: DestinationResources = {
  destinationId: "24",
  schools: [
    { name: "University of Rwanda", type: "university", website: "https://ur.ac.rw", language: "English", description: "Rwanda's largest public university, with a campus in Kigali." },
    { name: "Carnegie Mellon University Africa", type: "university", website: "https://www.africa.engineering.cmu.edu", language: "English", description: "World-class tech and engineering graduate programs in Kigali." },
    { name: "African Leadership University (ALU)", type: "university", website: "https://www.alueducation.com", language: "English", description: "Pan-African university focused on entrepreneurial leadership." },
    { name: "Kigali Institute of Science and Technology (merged into UR)", type: "college", website: "https://ur.ac.rw", language: "English", description: "Formerly independent tech institute, now part of University of Rwanda." },
  ],
  communityLinks: [
    { name: "Expats in Kigali", platform: "facebook", url: "https://www.facebook.com/groups/expatsinkigali", memberCount: "30K+", description: "Active expat community in Kigali." },
    { name: "Kigali Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+kigali", memberCount: "2K+", description: "Social and networking events." },
    { name: "r/Rwanda", platform: "reddit", url: "https://www.reddit.com/r/Rwanda/", memberCount: "40K", description: "Rwanda's Reddit community." },
    { name: "InterNations Kigali", platform: "other", url: "https://www.internations.org/kigali-expats", memberCount: "6K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — Kigali", url: "https://www.linkedin.com/jobs/kigali-jobs", focus: "general", description: "The main platform for professional roles in Rwanda." },
    { name: "MyJobMag Rwanda", url: "https://www.myjobmagrw.com", focus: "general", description: "Job listings in Rwanda." },
    { name: "BrighterMonday Rwanda", url: "https://www.brightermonday.co.rw", focus: "general", description: "Rwandan job board." },
    { name: "Rwanda Development Board jobs", url: "https://rdb.rw", focus: "general", description: "Government-backed investment and job portal." },
  ],
  housingSites: [
    { name: "Rwanda Property", url: "https://www.rwandaproperty.com", type: "rental", description: "Kigali-focused property listings." },
    { name: "HouseTops", url: "https://housetops.com", type: "rental", description: "East Africa property portal with Kigali listings." },
    { name: "Jiji Rwanda", url: "https://jiji.co.rw/real-estate", type: "rental", description: "Classifieds with rentals." },
  ],
  visaInfo: {
    description: "Rwanda is one of Africa's most open countries: e-visa for most visitors, visa-free for all Africans, and easy work-permit processes. The African Union passport holders enter visa-free. Work permits require employer sponsorship but processing is fast. Remote workers are welcome under visitor status.",
    officialUrl: "https://www.migration.gov.rw",
    commonVisaTypes: [
      "e-Visa (visitors)",
      "Visa-free entry for all Africans",
      "Work permit (employer-sponsored)",
      "Residence permit",
      "Investor / Startup visa",
      "Student visa",
    ],
  },
  healthcare: {
    description: "Rwanda has one of Africa's most functional healthcare systems. Mutuelle de Santé (community-based health insurance) covers citizens at low cost; expatriates usually use private clinics (e.g., King Faisal Hospital, CMHS) with international insurance. Kigali is renowned for its cleanliness and safety.",
    publicSystem: "Mutuelle de Santé (community health insurance) + public hospitals",
    insuranceUrl: "https://www.rssb.rw",
  },
};

// =============================================================================
// Tier 2 — South America templates
// =============================================================================

/** Buenos Aires, Argentina */
export const BUENOS_AIRES_RESOURCES: DestinationResources = {
  destinationId: "25",
  schools: [
    { name: "University of Buenos Aires (UBA)", type: "university", website: "https://www.uba.ar", language: "Spanish", description: "One of Latin America's most prestigious universities — free public education." },
    { name: "Universidad Torcuato Di Tella", type: "university", website: "https://www.utdt.edu", language: "Spanish", description: "Elite private university strong in economics and political science." },
    { name: "ITBA (Instituto Tecnológico de Buenos Aires)", type: "university", website: "https://www.itba.edu.ar", language: "Spanish", description: "Top private engineering and technology institute." },
    { name: "UADE (Universidad Argentina de la Empresa)", type: "university", website: "https://www.uade.edu.ar", language: "Spanish", description: "Popular private university for business and design." },
  ],
  communityLinks: [
    { name: "Expats in Buenos Aires", platform: "facebook", url: "https://www.facebook.com/groups/expatsinbuenosaires", memberCount: "90K+", description: "One of the largest expat groups in Latin America." },
    { name: "BA Expats & Digital Nomads Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+buenos+aires", memberCount: "15K+", description: "Networking and social events." },
    { name: "r/BuenosAires", platform: "reddit", url: "https://www.reddit.com/r/BuenosAires/", memberCount: "120K", description: "BA's Reddit community — practical advice." },
    { name: "InterNations Buenos Aires", platform: "other", url: "https://www.internations.org/buenos-aires-expats", memberCount: "25K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "Bumeran", url: "https://www.bumeran.com.ar", focus: "general", description: "Argentina's most popular job board." },
    { name: "ZonaJobs", url: "https://www.zonajobs.com.ar", focus: "general", description: "Major Argentine job platform." },
    { name: "LinkedIn Jobs — Buenos Aires", url: "https://www.linkedin.com/jobs/buenos-aires-jobs", focus: "general", description: "Strong for tech and multinational companies." },
    { name: "Computrabajo Argentina", url: "https://ar.computrabajo.com/empleos-en-buenos-aires", focus: "general", description: "Large Latin American job board." },
  ],
  housingSites: [
    { name: "Zonaprop", url: "https://www.zonaprop.com.ar/alquiler-departamentos-capital-federal.html", type: "rental", description: "Argentina's leading property portal." },
    { name: "Argenprop", url: "https://www.argenprop.com/departamentos-en-alquiler-capital-federal", type: "rental", description: "Major rental listing site." },
    { name: "MercadoLibre Inmuebles", url: "https://inmuebles.mercadolibre.com.ar/alquiler/", type: "rental", description: "Marketplace with rental listings." },
    { name: "Airbnb — Buenos Aires", url: "https://www.airbnb.com/buenos-aires-argentina/stays", type: "short-term", description: "Short-term stays (long-stay discounts common)." },
  ],
  visaInfo: {
    description: "Argentina has no visa requirement for many nationalities (90 days, renewable). Residency is obtained via radicación at the immigration office: temporary residency (2–3 years) then permanent. The rentista (income) and pensioner pathways are popular for remote workers and retirees. Argentina's digital nomad visa was introduced in 2023.",
    officialUrl: "https://www.argentina.gob.ar/interior/migraciones",
    commonVisaTypes: [
      "Visa-free entry (90 days, many nationalities)",
      "Temporary residency (rentista / pensioner)",
      "Digital Nomad visa",
      "Work residency (sponsored)",
      "Student residency",
      "Permanent residency (after 2–3 years)",
    ],
  },
  healthcare: {
    description: "Argentina's public healthcare system is free and accessible to everyone, including foreigners (hospitales públicos). Many professionals use prepagas (private health insurance, e.g., OSDE, Swiss Medical) which are relatively affordable. Quality is high for Latin America.",
    publicSystem: "Public hospitals (free) + private prepagas",
    insuranceUrl: "https://www.argentina.gob.ar/salud",
  },
};

/** São Paulo, Brazil */
export const SAO_PAULO_RESOURCES: DestinationResources = {
  destinationId: "26",
  schools: [
    { name: "Universidade de São Paulo (USP)", type: "university", website: "https://www.usp.br", language: "Portuguese", description: "Latin America's top-ranked university, with a campus in the city." },
    { name: "Fundação Getulio Vargas (FGV)", type: "university", website: "https://www.fgv.br", language: "Portuguese", description: "Brazil's leading business and economics school." },
    { name: "PUC-SP (Pontifícia Universidade Católica de São Paulo)", type: "university", website: "https://www.pucsp.br", language: "Portuguese", description: "Top private university in São Paulo." },
    { name: "Universidade Presbiteriana Mackenzie", type: "university", website: "https://www.mackenzie.br", language: "Portuguese", description: "Well-regarded private university in the city centre." },
  ],
  communityLinks: [
    { name: "Expats in São Paulo", platform: "facebook", url: "https://www.facebook.com/groups/expatsinsaopaulo", memberCount: "60K+", description: "Large expat community in São Paulo." },
    { name: "SP Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+s%C3%A3o+paulo", memberCount: "10K+", description: "Networking and social events." },
    { name: "r/saopaulo", platform: "reddit", url: "https://www.reddit.com/r/saopaulo/", memberCount: "150K", description: "São Paulo's Reddit community." },
    { name: "InterNations São Paulo", platform: "other", url: "https://www.internations.org/sao-paulo-expats", memberCount: "35K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — São Paulo", url: "https://www.linkedin.com/jobs/sao-paulo-jobs", focus: "general", description: "The key platform for professional roles in Brazil." },
    { name: "Indeed Brasil — São Paulo", url: "https://br.indeed.com/empregos?l=S%C3%A3o+Paulo", focus: "general", description: "Large job aggregator." },
    { name: "Catho", url: "https://www.catho.com.br", focus: "general", description: "One of Brazil's biggest job boards." },
    { name: "InfoJobs Brasil", url: "https://www.infojobs.com.br", focus: "general", description: "Popular job platform." },
  ],
  housingSites: [
    { name: "Zap Imóveis", url: "https://www.zapimoveis.com.br/aluguel/imoveis/sp+sao+paulo/", type: "rental", description: "Brazil's leading property portal." },
    { name: "VivaReal", url: "https://www.vivareal.com.br/aluguel/sp/sao-paulo/", type: "rental", description: "Major rental platform." },
    { name: "QuintoAndar", url: "https://www.quintoandar.com.br", type: "rental", description: "Digital rental platform with online contracts." },
    { name: "Airbnb — São Paulo", url: "https://www.airbnb.com/sao-paulo-brazil/stays", type: "short-term", description: "Short-term stays." },
  ],
  visaInfo: {
    description: "Brazil's digital nomad visa (2022) allows remote workers to stay up to 1 year, renewable. Work visas (VITEM V) are employer-sponsored; the Mercosur agreement lets citizens of neighbouring countries get easy residency. Brazil offers visa-free entry to many nationalities for 90 days.",
    officialUrl: "https://www.gov.br/mre/en",
    commonVisaTypes: [
      "Digital Nomad visa",
      "VITEM V work visa (sponsored)",
      "Visa-free entry (90 days, many nationalities)",
      "Student visa (VITEM IV)",
      "Mercosur residency (regional agreement)",
      "Investor visa (VIPER)",
    ],
  },
  healthcare: {
    description: "Brazil's SUS (Sistema Único de Saúde) provides universal free public healthcare. Most professionals also carry private health insurance (planos de saúde, e.g., Amil, Bradesco Saúde) for faster access. São Paulo has some of Latin America's best hospitals (e.g., Hospital Sírio-Libanês).",
    publicSystem: "SUS (Sistema Único de Saúde) — universal public system",
    insuranceUrl: "https://www.gov.br/saude/pt-br",
  },
};

/** Rio de Janeiro, Brazil */
export const RIO_DE_JANEIRO_RESOURCES: DestinationResources = {
  destinationId: "27",
  schools: [
    { name: "Universidade Federal do Rio de Janeiro (UFRJ)", type: "university", website: "https://ufrj.br", language: "Portuguese", description: "Brazil's most prestigious federal university." },
    { name: "PUC-Rio", type: "university", website: "https://www.puc-rio.br", language: "Portuguese", description: "Top private university with strong engineering and arts programs." },
    { name: "UERJ (Universidade do Estado do Rio de Janeiro)", type: "university", website: "https://www.uerj.br", language: "Portuguese", description: "Major state university in Rio." },
    { name: "Universidade Federal Fluminense (UFF)", type: "university", website: "https://www.uff.br", language: "Portuguese", description: "Large federal university in Niterói, across the bay." },
  ],
  communityLinks: [
    { name: "Expats in Rio de Janeiro", platform: "facebook", url: "https://www.facebook.com/groups/expatsinrio", memberCount: "50K+", description: "Active expat community in Rio." },
    { name: "Rio Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+rio+de+janeiro", memberCount: "6K+", description: "Social events — beaches, hiking, samba." },
    { name: "r/riodejaneiro", platform: "reddit", url: "https://www.reddit.com/r/riodejaneiro/", memberCount: "80K", description: "Rio's Reddit community." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — Rio de Janeiro", url: "https://www.linkedin.com/jobs/rio-de-janeiro-jobs", focus: "general", description: "Strong for oil & gas, tech and tourism." },
    { name: "Indeed Brasil — Rio", url: "https://br.indeed.com/empregos?l=Rio+de+Janeiro", focus: "general", description: "Large job aggregator." },
    { name: "Catho", url: "https://www.catho.com.br", focus: "general", description: "Big Brazilian job board." },
  ],
  housingSites: [
    { name: "Zap Imóveis — Rio", url: "https://www.zapimoveis.com.br/aluguel/imoveis/rj+rio+de+janeiro/", type: "rental", description: "Brazil's leading property portal." },
    { name: "VivaReal — Rio", url: "https://www.vivareal.com.br/aluguel/rj/rio-de-janeiro/", type: "rental", description: "Major rental platform." },
    { name: "QuintoAndar", url: "https://www.quintoandar.com.br", type: "rental", description: "Digital rentals with online contracts." },
  ],
  visaInfo: {
    description: "Same Brazilian framework as São Paulo: digital nomad visa (2022), VITEM V work visa, and visa-free entry for many nationalities. Rio's digital nomad community is large, especially in Ipanema and Botafogo.",
    officialUrl: "https://www.gov.br/mre/en",
    commonVisaTypes: [
      "Digital Nomad visa",
      "VITEM V work visa (sponsored)",
      "Visa-free entry (90 days, many nationalities)",
      "Student visa (VITEM IV)",
      "Mercosur residency",
    ],
  },
  healthcare: {
    description: "Public SUS system plus private insurance. Rio has good private hospitals (e.g., Copa D'Or, Hospital Samaritano). Many expats choose Zona Sul neighbourhoods for safety and access to quality clinics.",
    publicSystem: "SUS (Sistema Único de Saúde) + private planos de saúde",
    insuranceUrl: "https://www.gov.br/saude/pt-br",
  },
};

/** Santiago, Chile */
export const SANTIAGO_RESOURCES: DestinationResources = {
  destinationId: "28",
  schools: [
    { name: "Universidad de Chile", type: "university", website: "https://www.uchile.cl", language: "Spanish", description: "Chile's most prestigious public university." },
    { name: "Pontificia Universidad Católica de Chile (PUC)", type: "university", website: "https://www.uc.cl", language: "Spanish", description: "Top-ranked private university in Latin America." },
    { name: "Universidad de Santiago de Chile (USACH)", type: "university", website: "https://www.usach.cl", language: "Spanish", description: "Major public university strong in engineering." },
  ],
  communityLinks: [
    { name: "Expats in Santiago", platform: "facebook", url: "https://www.facebook.com/groups/expatsinsantiago", memberCount: "35K+", description: "Expat community in Santiago." },
    { name: "Santiago Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+santiago", memberCount: "5K+", description: "Networking and social events." },
    { name: "r/chile", platform: "reddit", url: "https://www.reddit.com/r/chile/", memberCount: "250K", description: "Chile's Reddit community." },
    { name: "InterNations Santiago", platform: "other", url: "https://www.internations.org/santiago-expats", memberCount: "15K+", description: "Global expat network." },
  ],
  jobBoards: [
    { name: "Laborum", url: "https://www.laborum.com/empleos-de-chile", focus: "general", description: "Chile's most popular job board." },
    { name: "Trabajando.com", url: "https://www.trabajando.cl", focus: "general", description: "Major Chilean job platform." },
    { name: "LinkedIn Jobs — Santiago", url: "https://www.linkedin.com/jobs/santiago-jobs", focus: "general", description: "Strong for tech, mining and professional roles." },
    { name: "Indeed Chile", url: "https://cl.indeed.com/jobs?l=Santiago", focus: "general", description: "Large job aggregator." },
  ],
  housingSites: [
    { name: "PortalInmobiliario", url: "https://www.portalinmobiliario.com/arriendo/departamentos/santiago-metropolitana", type: "rental", description: "Chile's leading property portal." },
    { name: "Yapo.cl", url: "https://www.yapo.cl/region-metropolitana/arriendo", type: "rental", description: "Popular classifieds with rentals." },
    { name: "MercadoLibre Inmuebles Chile", url: "https://inmuebles.mercadolibre.cl/arriendo/", type: "rental", description: "Marketplace rentals." },
  ],
  visaInfo: {
    description: "Chile's Temporary Residence visa (visa de residencia temporal) is the standard route — with job contract, family, pension or income. The digital nomad visa was introduced in 2023. After 1 year, apply for permanent residency. Chile is visa-free for many nationalities for 90 days.",
    officialUrl: "https://www.extranjeria.gob.cl",
    commonVisaTypes: [
      "Temporary Residence visa (visa de residencia temporal)",
      "Digital Nomad visa",
      "Work visa (subjetivo a contrato)",
      "Visa-free entry (90 days, many nationalities)",
      "Permanent residency (after 1 year)",
      "Student visa",
    ],
  },
  healthcare: {
    description: "Chile has a dual system: FONASA (public, ~78% of the population) and ISAPRE (private insurers). Employees contribute 7% of salary, choosing either system. Santiago has excellent private clinics (e.g., Clínica Alemana, Clínica Las Condes).",
    publicSystem: "FONASA (public) + ISAPRE (private insurers)",
    insuranceUrl: "https://www.fonasa.cl",
  },
};

/** Bogotá, Colombia */
export const BOGOTA_RESOURCES: DestinationResources = {
  destinationId: "29",
  schools: [
    { name: "Universidad Nacional de Colombia", type: "university", website: "https://unal.edu.co", language: "Spanish", description: "Colombia's most prestigious public university." },
    { name: "Universidad de los Andes", type: "university", website: "https://uniandes.edu.co", language: "Spanish", description: "Top-ranked private university in Colombia." },
    { name: "Pontificia Universidad Javeriana", type: "university", website: "https://www.javeriana.edu.co", language: "Spanish", description: "Leading Jesuit university in Bogotá." },
    { name: "Universidad del Rosario", type: "university", website: "https://www.urosario.edu.co", language: "Spanish", description: "One of Colombia's oldest universities, strong in law and business." },
  ],
  communityLinks: [
    { name: "Expats in Bogotá", platform: "facebook", url: "https://www.facebook.com/groups/expatsinbogota", memberCount: "40K+", description: "Active expat community in Bogotá." },
    { name: "Bogotá Expat & Nomad Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+bogota", memberCount: "5K+", description: "Networking and social events." },
    { name: "r/Bogota", platform: "reddit", url: "https://www.reddit.com/r/Bogota/", memberCount: "90K", description: "Bogotá's Reddit community." },
  ],
  jobBoards: [
    { name: "Elempleo", url: "https://www.elempleo.com", focus: "general", description: "Colombia's leading job board." },
    { name: "Computrabajo Colombia", url: "https://co.computrabajo.com/empleos-en-bogota", focus: "general", description: "Large Latin American job platform." },
    { name: "LinkedIn Jobs — Bogotá", url: "https://www.linkedin.com/jobs/bogota-jobs", focus: "general", description: "Strong for tech and professional roles." },
    { name: "Indeed Colombia", url: "https://co.indeed.com/jobs?l=Bogot%C3%A1", focus: "general", description: "Large job aggregator." },
  ],
  housingSites: [
    { name: "Metrocuadrado", url: "https://www.metrocuadrado.com/arriendo/bogota/", type: "rental", description: "Colombia's most popular property portal." },
    { name: "Fincaraíz", url: "https://www.fincaraiz.com.co/arriendo/bogota/", type: "rental", description: "Major property site." },
    { name: "Airbnb — Bogotá", url: "https://www.airbnb.com/bogota-colombia/stays", type: "short-term", description: "Short-term stays with monthly discounts." },
  ],
  visaInfo: {
    description: "Colombia's digital nomad visa (2022, 'visa de nómada digital') allows remote workers to stay up to 2 years. Work visas (Tipo M) are employer-sponsored; the rentista (investor/pensioner) visa requires monthly income proof. Many nationalities enter visa-free for 90 days.",
    officialUrl: "https://www.cancilleria.gov.co",
    commonVisaTypes: [
      "Digital Nomad visa (nómada digital)",
      "M-type Work visa (sponsored)",
      "Rentista / Investor visa",
      "Visa-free entry (90 days, many nationalities)",
      "Student visa (Tipo TP-7)",
      "Permanent residency (after 5 years)",
    ],
  },
  healthcare: {
    description: "Colombia's EPS system (Entidades Promotoras de Salud) provides universal coverage — employees contribute ~12.5% and choose an EPS. Private clinics (e.g., Clínica del Country, Fundación Santa Fe) are high quality and affordable by international standards.",
    publicSystem: "EPS (Entidades Promotoras de Salud) — universal coverage",
    insuranceUrl: "https://www.minsalud.gov.co",
  },
};

/** Lima, Peru */
export const LIMA_RESOURCES: DestinationResources = {
  destinationId: "30",
  schools: [
    { name: "Universidad Nacional Mayor de San Marcos (UNMSM)", type: "university", website: "https://unmsm.edu.pe", language: "Spanish", description: "The Americas' oldest university (1551), Peru's premier public university." },
    { name: "Pontificia Universidad Católica del Perú (PUCP)", type: "university", website: "https://www.pucp.edu.pe", language: "Spanish", description: "Peru's top-ranked private university." },
    { name: "Universidad del Pacífico", type: "university", website: "https://www.up.edu.pe", language: "Spanish", description: "Elite business and economics university." },
    { name: "Universidad Nacional de Ingeniería (UNI)", type: "university", website: "https://www.uni.edu.pe", language: "Spanish", description: "Peru's leading engineering university." },
  ],
  communityLinks: [
    { name: "Expats in Lima", platform: "facebook", url: "https://www.facebook.com/groups/expatsinlima", memberCount: "35K+", description: "Expat community in Lima." },
    { name: "Lima Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+lima", memberCount: "4K+", description: "Social and networking events." },
    { name: "r/PERU", platform: "reddit", url: "https://www.reddit.com/r/PERU/", memberCount: "150K", description: "Peru's Reddit community." },
  ],
  jobBoards: [
    { name: "Computrabajo Perú", url: "https://pe.computrabajo.com/empleos-en-lima", focus: "general", description: "Peru's most popular job board." },
    { name: "Bumeran Perú", url: "https://www.bumeran.com.pe", focus: "general", description: "Major job platform." },
    { name: "LinkedIn Jobs — Lima", url: "https://www.linkedin.com/jobs/lima-jobs", focus: "general", description: "Strong for professional and corporate roles." },
    { name: "Indeed Perú", url: "https://pe.indeed.com/jobs?l=Lima", focus: "general", description: "Large job aggregator." },
  ],
  housingSites: [
    { name: "Urbania", url: "https://urbania.pe/buscar/alquiler/departamentos/lima", type: "rental", description: "Peru's leading property portal." },
    { name: "Adondevivir", url: "https://www.adondevivir.com/alquiler-departamentos-lima.html", type: "rental", description: "Major rental platform." },
    { name: "MercadoLibre Inmuebles Perú", url: "https://inmuebles.mercadolibre.com.pe/alquiler/", type: "rental", description: "Marketplace rentals." },
  ],
  visaInfo: {
    description: "Peru offers visa-free entry for 183 days (many nationalities) — one of the most generous policies in the region. Longer stays need a work visa (sponsored) or the rentista/pensioner pathway via a Carné de Extranjería. Peru is exploring a digital nomad visa.",
    officialUrl: "https://www.gob.pe/migraciones",
    commonVisaTypes: [
      "Visa-free entry (up to 183 days, many nationalities)",
      "Work visa (sponsored)",
      "Rentista / pensioner residence",
      "Student visa",
      "Carné de Extranjería (residency card)",
      "Family reunification",
    ],
  },
  healthcare: {
    description: "Peru's EsSalud (public social security) covers formal employees; the SIS (Seguro Integral de Salud) covers low-income residents. Private clinics in Lima (e.g., Clínica Ricardo Palma, Clínica Internacional) are high quality and affordable, and most expats opt for private insurance.",
    publicSystem: "EsSalud (public) + SIS (integral health insurance)",
    insuranceUrl: "https://www.essalud.gob.pe",
  },
};

// =============================================================================
// Tier 2 — Caribbean templates
// =============================================================================

/** Santo Domingo, Dominican Republic */
export const SANTO_DOMINGO_RESOURCES: DestinationResources = {
  destinationId: "31",
  schools: [
    { name: "Universidad Autónoma de Santo Domingo (UASD)", type: "university", website: "https://uasd.edu.do", language: "Spanish", description: "The Americas' first university (1538), the country's largest public university." },
    { name: "Pontificia Universidad Católica Madre y Maestra (PUCMM)", type: "university", website: "https://www.pucmm.edu.do", language: "Spanish", description: "Top private university in the DR." },
    { name: "INTEC (Instituto Tecnológico de Santo Domingo)", type: "university", website: "https://www.intec.edu.do", language: "Spanish", description: "Leading private university strong in engineering and health." },
    { name: "Universidad Iberoamericana (UNIBE)", type: "university", website: "https://www.unibe.edu.do", language: "Spanish", description: "Private university strong in medicine and business." },
  ],
  communityLinks: [
    { name: "Expats in Santo Domingo", platform: "facebook", url: "https://www.facebook.com/groups/expatsinsantodomingo", memberCount: "20K+", description: "Expat community in the DR." },
    { name: "Santo Domingo Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+santo+domingo", memberCount: "2K+", description: "Social and networking events." },
    { name: "r/Dominican", platform: "reddit", url: "https://www.reddit.com/r/Dominican/", memberCount: "50K", description: "Dominican community on Reddit." },
  ],
  jobBoards: [
    { name: "Corotos", url: "https://www.corotos.com.do", focus: "general", description: "The DR's largest classifieds — jobs, housing, services." },
    { name: "Empleos.do", url: "https://www.empleos.do", focus: "general", description: "Dominican job board." },
    { name: "LinkedIn Jobs — Santo Domingo", url: "https://www.linkedin.com/jobs/santo-domingo-jobs", focus: "general", description: "Strong for tourism, telecom and professional roles." },
    { name: "Computrabajo República Dominicana", url: "https://do.computrabajo.com/empleos-en-santo-domingo", focus: "general", description: "Large Latin American job platform." },
  ],
  housingSites: [
    { name: "Corotos Inmuebles", url: "https://www.corotos.com.do/k/inmuebles", type: "rental", description: "Classifieds with rental listings." },
    { name: "SuperCasas", url: "https://www.supercasas.com/venta/alquiler/santo-domingo", type: "rental", description: "Dominican property portal." },
    { name: "Remax República Dominicana", url: "https://www.remax.com.do", type: "rental", description: "International agency with local listings." },
  ],
  visaInfo: {
    description: "The DR is visa-free for most nationalities (30 days, renewable). Longer stays need a residence permit — the investor, rentista (income) or work pathways. The country launched a digital nomad visa in 2023, and its low cost of living makes it a popular base.",
    officialUrl: "https://migracion.gob.do",
    commonVisaTypes: [
      "Visa-free entry (30 days, most nationalities)",
      "Digital Nomad visa",
      "Residence permit (work-sponsored)",
      "Rentista / investor residence",
      "Permanent residency (after 1–2 years)",
      "Student visa",
    ],
  },
  healthcare: {
    description: "The DR's public healthcare (SNS — Servicio Nacional de Salud) is supplemented by a strong private sector. The SENASA/ARS system provides health insurance for employees; expatriates typically use private clinics (e.g., Centro Médico Moderno, HOMS) with international insurance.",
    publicSystem: "SNS (Servicio Nacional de Salud) + ARS/SENASA insurance",
    insuranceUrl: "https://www.senasa.gob.do",
  },
};

/** San Juan, Puerto Rico */
export const SAN_JUAN_RESOURCES: DestinationResources = {
  destinationId: "32",
  schools: [
    { name: "University of Puerto Rico (UPR)", type: "university", website: "https://www.upr.edu", language: "Spanish", description: "Puerto Rico's main public university system, with the Río Piedras campus in San Juan." },
    { name: "Interamerican University of Puerto Rico", type: "university", website: "https://www.inter.edu", language: "Spanish", description: "Largest private university system in Puerto Rico." },
    { name: "Universidad del Sagrado Corazón", type: "university", website: "https://www.sagrado.edu", language: "Spanish", description: "Private university in Santurce strong in communications and design." },
    { name: "Universidad de Puerto Rico — Ciencias Médicas", type: "university", website: "https://www.rcm.upr.edu", language: "Spanish", description: "Leading medical and health sciences campus." },
  ],
  communityLinks: [
    { name: "Expats in Puerto Rico", platform: "facebook", url: "https://www.facebook.com/groups/expatsinpuertorico", memberCount: "60K+", description: "Large expat community — Act 60/22 movers and newcomers." },
    { name: "San Juan Expats & Nomads Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+san+juan", memberCount: "4K+", description: "Social and business events." },
    { name: "r/PuertoRico", platform: "reddit", url: "https://www.reddit.com/r/PuertoRico/", memberCount: "180K", description: "Puerto Rico's Reddit community." },
  ],
  jobBoards: [
    { name: "Indeed — Puerto Rico", url: "https://www.indeed.com/jobs?l=San+Juan%2C+PR", focus: "general", description: "Large job aggregator with PR listings." },
    { name: "EmpleosPR", url: "https://www.empleospr.com", focus: "general", description: "Local job board for Puerto Rico." },
    { name: "LinkedIn Jobs — San Juan", url: "https://www.linkedin.com/jobs/san-juan-puerto-rico-jobs", focus: "general", description: "Strong for healthcare, pharma and corporate roles." },
    { name: "USAJobs (federal)", url: "https://www.usajobs.gov", focus: "general", description: "Federal jobs in PR (FAA, VA, etc.)." },
  ],
  housingSites: [
    { name: "ClasificadosOnline", url: "https://www.clasificadosonline.com/Rentals", type: "rental", description: "Puerto Rico's biggest classifieds site." },
    { name: "Zillow — San Juan", url: "https://www.zillow.com/san-juan-pr/rentals/", type: "rental", description: "US platform with PR listings." },
    { name: "Remax Puerto Rico", url: "https://www.remaxpr.com", type: "rental", description: "Major real estate agency." },
    { name: "Airbnb — San Juan", url: "https://www.airbnb.com/san-juan-puerto-rico/stays", type: "short-term", description: "Short-term stays (monthly discounts)." },
  ],
  visaInfo: {
    description: "Puerto Rico is a US territory: US citizens need no visa, and non-US citizens need a US visa or ESTA (visa waiver). The island is famous for its tax incentives — Act 60 (formerly Acts 20/22) offers income tax benefits for investors, business owners and remote workers relocating to PR.",
    officialUrl: "https://www.uscis.gov",
    commonVisaTypes: [
      "US citizens — no visa needed (free movement)",
      "ESTA / Visa Waiver Program (90 days)",
      "B-2 / B-1 visas",
      "Act 60 tax incentive residency",
      "US work visa (H-1B, L-1, etc.)",
      "Green card (permanent residency)",
    ],
  },
  healthcare: {
    description: "Puerto Rico uses the US healthcare system: employer-sponsored private insurance, Medicare/Medicaid for eligible residents. Medical care is of US standard with local rates; San Juan has several excellent private hospitals (e.g., HIMA, Auxilio Mutuo, Ashford Presbyterian).",
    publicSystem: "US system: private insurance + Medicare/Medicaid",
    insuranceUrl: "https://www.healthcare.gov",
  },
};

/** Kingston, Jamaica */
export const KINGSTON_RESOURCES: DestinationResources = {
  destinationId: "33",
  schools: [
    { name: "University of the West Indies (UWI), Mona", type: "university", website: "https://www.uwi.edu", language: "English", description: "The Caribbean's premier university, campus in Kingston." },
    { name: "University of Technology, Jamaica (UTech)", type: "university", website: "https://www.utech.edu.jm", language: "English", description: "Technology and engineering university in Kingston." },
    { name: "Northern Caribbean University (NCU)", type: "university", website: "https://www.ncu.edu.jm", language: "English", description: "Private university in Mandeville with a Kingston presence." },
    { name: "Edna Manley College of the Visual and Performing Arts", type: "college", website: "https://www.emc.edu.jm", language: "English", description: "The Caribbean's leading arts college." },
  ],
  communityLinks: [
    { name: "Expats in Jamaica", platform: "facebook", url: "https://www.facebook.com/groups/expatsinjamaica", memberCount: "40K+", description: "Large expat community — retirees, digital nomads and professionals." },
    { name: "Kingston Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+kingston", memberCount: "2K+", description: "Social events." },
    { name: "r/Jamaica", platform: "reddit", url: "https://www.reddit.com/r/Jamaica/", memberCount: "60K", description: "Jamaica's Reddit community." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — Kingston", url: "https://www.linkedin.com/jobs/kingston-jamaica-jobs", focus: "general", description: "Strong for BPO, finance and professional roles." },
    { name: "Indeed — Jamaica", url: "https://jm.indeed.com/jobs?l=Kingston", focus: "general", description: "Large job aggregator." },
    { name: "Jamaica Jobs / CareerJamaica", url: "https://www.careerjamaica.com", focus: "general", description: "Local job board." },
    { name: "The Gleaner Jobs", url: "https://jamaica-gleaner.com/classifieds/jobs", focus: "general", description: "Jamaica's main newspaper listings." },
  ],
  housingSites: [
    { name: "Jamaica Homes", url: "https://jamaicahomes.com", type: "rental", description: "Property portal for Jamaica." },
    { name: "Realtor.com — Jamaica", url: "https://www.realtor.com/international/jm/", type: "rental", description: "International listings portal." },
    { name: "PropertyAds Jamaica", url: "https://www.propertyadsjm.com", type: "rental", description: "Local real estate listings." },
  ],
  visaInfo: {
    description: "Jamaica offers visa-free entry (up to 90 days) to many nationalities. Longer stays need a work permit (sponsored) or a residency permit. The digital nomad programme (Remote Work certificate, 2022) allows remote workers to stay up to 2 years tax-free.",
    officialUrl: "https://www.pica.gov.jm",
    commonVisaTypes: [
      "Visa-free entry (90 days, many nationalities)",
      "Remote Work certificate (digital nomad, up to 2 years)",
      "Work permit (employer-sponsored)",
      "Residency permit",
      "Student visa",
      "Permanent residency (after 5 years)",
    ],
  },
  healthcare: {
    description: "Jamaica's public healthcare is provided through the Ministry of Health; private hospitals (e.g., University Hospital of the West Indies, Andrews Memorial, Medical Associates) are the norm for expatriates. International health insurance is strongly recommended.",
    publicSystem: "Ministry of Health public system + private hospitals",
    insuranceUrl: "https://www.moh.gov.jm",
  },
};

/** Port of Spain, Trinidad and Tobago */
export const PORT_OF_SPAIN_RESOURCES: DestinationResources = {
  destinationId: "34",
  schools: [
    { name: "University of the West Indies (UWI), St. Augustine", type: "university", website: "https://sta.uwi.edu", language: "English", description: "The Caribbean's top university, campus just outside Port of Spain." },
    { name: "University of Trinidad and Tobago (UTT)", type: "university", website: "https://utt.edu.tt", language: "English", description: "Technology and vocational university with campuses across Trinidad." },
    { name: "COSTAATT (College of Science, Technology and Applied Arts)", type: "college", website: "https://costaatt.edu.tt", language: "English", description: "Public tertiary college in Port of Spain." },
  ],
  communityLinks: [
    { name: "Expats in Trinidad & Tobago", platform: "facebook", url: "https://www.facebook.com/groups/expatsintrinidad", memberCount: "15K+", description: "Expat community in T&T." },
    { name: "Port of Spain Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+port+of+spain", memberCount: "1K+", description: "Social events." },
    { name: "r/TrinidadandTobago", platform: "reddit", url: "https://www.reddit.com/r/TrinidadandTobago/", memberCount: "30K", description: "T&T's Reddit community." },
  ],
  jobBoards: [
    { name: "LinkedIn Jobs — Port of Spain", url: "https://www.linkedin.com/jobs/port-of-spain-jobs", focus: "general", description: "Strong for energy, finance and professional roles." },
    { name: "CaribbeanJobs", url: "https://www.caribbeanjobs.com", focus: "general", description: "Regional job board covering T&T." },
    { name: "Indeed — Trinidad and Tobago", url: "https://tt.indeed.com/jobs?l=Port+of+Spain", focus: "general", description: "Large job aggregator." },
  ],
  housingSites: [
    { name: "Trinidad Realty", url: "https://trinidadrealty.com", type: "rental", description: "Local property portal." },
    { name: "PropertyAds T&T", url: "https://www.propertyads.tt", type: "rental", description: "Real estate listings." },
    { name: "Remax Trinidad", url: "https://www.remax-tt.com", type: "rental", description: "International agency with local listings." },
  ],
  visaInfo: {
    description: "Trinidad and Tobago offers visa-free entry (90 days) to many nationalities, including US, UK and EU citizens. Work permits require employer sponsorship (Ministry of National Security); residency is possible after sustained employment. The energy sector drives most expat hiring.",
    officialUrl: "https://immigration.gov.tt",
    commonVisaTypes: [
      "Visa-free entry (90 days, many nationalities)",
      "Work permit (employer-sponsored)",
      "Residence permit",
      "Student visa",
      "Spouse / dependent permit",
    ],
  },
  healthcare: {
    description: "Trinidad's public healthcare system (Ministry of Health) provides free care at public hospitals. Private hospitals (e.g., St. Clair Medical, West Shore Medical, Eric Williams Medical Sciences Complex) are preferred by expatriates, usually with private insurance.",
    publicSystem: "Ministry of Health public system + private hospitals",
    insuranceUrl: "https://health.gov.tt",
  },
};

/** Havana, Cuba */
export const HAVANA_RESOURCES: DestinationResources = {
  destinationId: "35",
  schools: [
    { name: "University of Havana", type: "university", website: "https://www.uh.cu", language: "Spanish", description: "Cuba's most prestigious university, founded 1728." },
    { name: "Universidad Tecnológica de La Habana (CUJAE)", type: "university", website: "https://cujae.edu.cu", language: "Spanish", description: "Cuba's leading engineering and technology university." },
    { name: "ELAM (Escuela Latinoamericana de Medicina)", type: "university", website: "https://instituciones.sld.cu/elam/", language: "Spanish", description: "Latin American School of Medicine, training doctors from around the world." },
  ],
  communityLinks: [
    { name: "Expats & Visitors in Havana", platform: "facebook", url: "https://www.facebook.com/groups/search/?q=expats+in+havana", memberCount: "10K+", description: "Community for long-term visitors and residents." },
    { name: "Havana Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+havana", memberCount: "1K+", description: "Social events for foreigners in Havana." },
    { name: "r/cuba", platform: "reddit", url: "https://www.reddit.com/r/cuba/", memberCount: "40K", description: "Cuba-related Reddit community." },
  ],
  jobBoards: [
    { name: "Trabajos Cuba", url: "https://www.trabajoscuba.com", focus: "general", description: "Job listings in Cuba (state and emerging private sector)." },
    { name: "LinkedIn — Cuba", url: "https://www.linkedin.com/jobs/cuba-jobs", focus: "general", description: "Limited but growing for international organisations." },
    { name: "Empleos Cuba", url: "https://www.empleoscuba.com", focus: "general", description: "Cuban job board." },
  ],
  housingSites: [
    { name: "Airbnb — Havana", url: "https://www.airbnb.com/havana-cuba/stays", type: "short-term", description: "Casa particulares (private homestays) — the standard for visitors." },
    { name: "Havana Casa", url: "https://www.havanacasa.net", type: "rental", description: "Directory of casa particulares in Havana." },
    { name: "Cuban rentals via local networks", url: "https://www.facebook.com/groups/search/?q=casa+particulares+havana", type: "rental", description: "Local Facebook groups for longer-term rentals." },
  ],
  visaInfo: {
    description: "Most visitors need a Cuban Tourist Card ('tarjeta de turista', valid 30 days, extendable once). Work in Cuba is tightly controlled — foreigners need specific work authorisation through an employer or approved ventures; the emerging private sector (cuentapropistas) has created limited opportunities. Americans face OFAC travel restrictions.",
    officialUrl: "https://www.cubaviaje.com/en/visa-cuba",
    commonVisaTypes: [
      "Tourist Card (tarjeta de turista, 30 days)",
      "Work authorisation (state or joint venture)",
      "Residence permit (rare, special categories)",
      "Student exchange visa",
      "Business visa",
    ],
  },
  healthcare: {
    description: "Cuba has a world-renowned universal public healthcare system — free at the point of use, with excellent doctors and strong public-health outcomes. Visitors are treated at tourist hospitals (Clinica Cira García) with travel insurance. Pharmaceuticals can be scarce; bring personal supplies.",
    publicSystem: "Universal public system (MINSAP) — free healthcare",
    insuranceUrl: "https://www.asistur.cu",
  },
};

/** Nassau, Bahamas */
export const NASSAU_RESOURCES: DestinationResources = {
  destinationId: "36",
  schools: [
    { name: "University of The Bahamas", type: "university", website: "https://www.ub.edu.bs", language: "English", description: "The national university, main campus in Nassau." },
    { name: "College of The Bahamas (merged into UB)", type: "college", website: "https://www.ub.edu.bs", language: "English", description: "Former college, now part of University of The Bahamas." },
    { name: "Success Training College", type: "college", website: "https://successtc.edu.bs", language: "English", description: "Private tertiary college in Nassau." },
  ],
  communityLinks: [
    { name: "Expats in The Bahamas", platform: "facebook", url: "https://www.facebook.com/groups/expatsinbahamas", memberCount: "25K+", description: "Expat community — retirees, professionals and boaters." },
    { name: "Nassau Expat Meetups", platform: "meetup", url: "https://www.meetup.com/find/?keywords=expat+nassau", memberCount: "1K+", description: "Social events." },
    { name: "r/bahamas", platform: "reddit", url: "https://www.reddit.com/r/bahamas/", memberCount: "40K", description: "Bahamas' Reddit community." },
  ],
  jobBoards: [
    { name: "Bahamas Jobs / EyeWitness", url: "https://www.eyewitnessbahamas.com/classifieds/jobs", focus: "general", description: "Local classifieds with job listings." },
    { name: "LinkedIn Jobs — Nassau", url: "https://www.linkedin.com/jobs/nassau-bahamas-jobs", focus: "general", description: "Strong for banking, tourism and professional roles." },
    { name: "CaribbeanJobs Bahamas", url: "https://www.caribbeanjobs.com/jobs-in-bahamas", focus: "general", description: "Regional job board." },
  ],
  housingSites: [
    { name: "Bahamas Realty", url: "https://www.bahamasrealty.com", type: "rental", description: "Property portal for The Bahamas." },
    { name: "Realtor.com — Bahamas", url: "https://www.realtor.com/international/bs/", type: "rental", description: "International listings portal." },
    { name: "Airbnb — Nassau", url: "https://www.airbnb.com/nassau-bahamas/stays", type: "short-term", description: "Short-term stays." },
  ],
  visaInfo: {
    description: "The Bahamas is visa-free for many nationalities (up to 8 months for US/UK/Canada citizens). Work permits require employer sponsorship; the Investor/Household Occupation permits and the Economic Permanent Residency (investment) pathway exist for those with means. There is no income tax in The Bahamas.",
    officialUrl: "https://www.immigration.gov.bs",
    commonVisaTypes: [
      "Visa-free entry (many nationalities, up to 8 months)",
      "Work permit (employer-sponsored)",
      "Annual Residence / Homeowner permit",
      "Economic Permanent Residency (investment)",
      "Investor permit",
      "Student permit",
    ],
  },
  healthcare: {
    description: "The Bahamas has public clinics and hospitals (Princess Margaret Hospital in Nassau) plus private facilities (Doctors Hospital, Doctors Hospital West). Care is of good standard but serious cases are evacuated to the US. International health insurance is strongly recommended.",
    publicSystem: "Public hospitals (Ministry of Health) + private facilities",
    insuranceUrl: "https://www.bahamas.gov.bs",
  },
};

// =============================================================================
// Map of all destination resources keyed by destination ID
// =============================================================================
export const DESTINATION_RESOURCES: Record<string, DestinationResources> = {
  "1": TORONTO_RESOURCES,
  "2": VANCOUVER_RESOURCES,
  "3": LONDON_RESOURCES,
  "4": BERLIN_RESOURCES,
  "5": MUNICH_RESOURCES,
  "6": SYDNEY_RESOURCES,
  "7": MELBOURNE_RESOURCES,
  "8": DUBAI_RESOURCES,
  "9": SINGAPORE_RESOURCES,
  "10": AMSTERDAM_RESOURCES,
  "11": AUCKLAND_RESOURCES,
  "12": DUBLIN_RESOURCES,
  "13": NEW_YORK_RESOURCES,
  "14": SAN_FRANCISCO_RESOURCES,
  "15": LISBON_RESOURCES,
  "16": TOKYO_RESOURCES,
  "17": BARCELONA_RESOURCES,
  "18": STOCKHOLM_RESOURCES,
  "19": CAPE_TOWN_RESOURCES,
  "20": NAIROBI_RESOURCES,
  "21": LAGOS_RESOURCES,
  "22": ACCRA_RESOURCES,
  "23": CASABLANCA_RESOURCES,
  "24": KIGALI_RESOURCES,
  "25": BUENOS_AIRES_RESOURCES,
  "26": SAO_PAULO_RESOURCES,
  "27": RIO_DE_JANEIRO_RESOURCES,
  "28": SANTIAGO_RESOURCES,
  "29": BOGOTA_RESOURCES,
  "30": LIMA_RESOURCES,
  "31": SANTO_DOMINGO_RESOURCES,
  "32": SAN_JUAN_RESOURCES,
  "33": KINGSTON_RESOURCES,
  "34": PORT_OF_SPAIN_RESOURCES,
  "35": HAVANA_RESOURCES,
  "36": NASSAU_RESOURCES,
};

export function getDestinationResources(id: string): DestinationResources | undefined {
  return DESTINATION_RESOURCES[id];
}
