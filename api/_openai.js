import OpenAI from "openai";

export function client() {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada no servidor.");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const model = () => process.env.OPENAI_MODEL || "gpt-5.6-luna";

export function methodGuard(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return false;
  }
  return true;
}
