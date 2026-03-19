import fs from "fs";
import path from "path";

export interface ClientMeeting {
  id: string;
  date: string;
  title: string;
  duration: string;
  participants: string[];
  status: string;
  summary: string;
  topics: { title: string; notes: string }[];
  decisions: string[];
  nextSteps: { task: string; owner: string; deadline: string; status: string }[];
  insights: {
    maturityScore: { tracking: number; analytics: number; automation: number; overall: number };
    currentStack: { tool: string; status: string }[];
    opportunities: { area: string; impact: string; description: string }[];
    painPoints: string[];
  };
}

export interface Goal {
  metric: string;
  label: string;
  description: string;
}

export interface StapeScore {
  analytics: number;
  ads: number;
  cookieLifetime: number;
  pageSpeed: number;
  overall: number;
}

export interface StapeChecker {
  noteId: string;
  url: string;
  label: string;
  scores?: StapeScore;
}

export interface DesireItem {
  icon: string;
  title: string;
  description: string;
}

export interface Desires {
  headline: string;
  intro: string;
  items: DesireItem[];
}

export interface Opportunity {
  title: string;
  impact: string;
  effort: string;
  description: string;
}

export interface Proposal {
  headline: string;
  description: string;
  timeline: string;
  investment: string;
  guarantee: string;
  cta: string;
}

export interface ClientDiagnosis {
  headline: string;
  stapeChecker?: StapeChecker;
  goals: Goal[];
  desires: Desires;
  opportunities: Opportunity[];
  proposal: Proposal;
}

export interface ClientData {
  client: {
    id: string;
    name: string;
    company: string;
    type: string;
    contact: { representative: string; label: string };
    instagram: string;
    createdAt: string;
  };
  meetings: ClientMeeting[];
  diagnosis: ClientDiagnosis;
}

export function getClientData(clientId: string): ClientData | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "clients",
      `${clientId}.json`
    );
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ClientData;
  } catch {
    return null;
  }
}
