import type { MatchResult, ResumeResult } from "../types";

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || "Não foi possível concluir a operação.");
  return data as T;
}

export const analyzeMatch = (resume: string, job: string) =>
  post<MatchResult>("/api/match", { resume, job });

export const generateResume = (resume: string, job: string, match: MatchResult) =>
  post<ResumeResult>("/api/resume", { resume, job, match });
