// Survey response storage — uses JSON file (consistent with reviews pattern)

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const SURVEY_FILE = join(DATA_DIR, "survey-responses.json");

export interface SurveyResponse {
  id: string;
  email: string;
  destination_interest?: string;
  biggest_frustration: string;
  premium_features: string[];
  max_monthly_payment: string;
  payment_preference: "subscription" | "one_time" | "not_sure";
  mentor_consultation_likelihood: number; // 1-5
  submitted_at: string;
}

function loadAll(): SurveyResponse[] {
  try {
    if (existsSync(SURVEY_FILE)) {
      return JSON.parse(readFileSync(SURVEY_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveAll(responses: SurveyResponse[]): void {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(SURVEY_FILE, JSON.stringify(responses, null, 2), "utf-8");
}

export function submitSurveyResponse(
  data: Omit<SurveyResponse, "id" | "submitted_at">
): SurveyResponse {
  const responses = loadAll();
  const entry: SurveyResponse = {
    ...data,
    id: `sv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    submitted_at: new Date().toISOString(),
  };
  responses.push(entry);
  saveAll(responses);
  return entry;
}

export function getSurveyCount(): number {
  return loadAll().length;
}
