export type MatchResult = {
  overall_score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  recommendations: string[];
};

export type ResumeResult = {
  title: string;
  professional_summary: string;
  skills: string[];
  experience: { company: string; role: string; period: string; bullets: string[] }[];
  education: string[];
  certifications: string[];
  languages: string[];
  ats_notes: string[];
};
