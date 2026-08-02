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

/** Map of all destination resources keyed by destination ID */
export const DESTINATION_RESOURCES: Record<string, DestinationResources> = {
  "1": TORONTO_RESOURCES,
  // More destinations will be added here
};

export function getDestinationResources(id: string): DestinationResources | undefined {
  return DESTINATION_RESOURCES[id];
}
