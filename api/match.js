import { client, model, methodGuard } from "./_openai.js";

const schema = {
  type: "object",
  properties: {
    overall_score: { type: "integer" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    matched_keywords: { type: "array", items: { type: "string" } },
    missing_keywords: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } }
  },
  required: ["overall_score","summary","strengths","gaps","matched_keywords","missing_keywords","recommendations"],
  additionalProperties: false
};

export default async function handler(req, res) {
  if (!methodGuard(req,res)) return;
  try {
    const { resume, job } = req.body || {};
    if (!resume || !job) return res.status(400).json({error:"Currículo e vaga são obrigatórios."});
    const response = await client().responses.create({
      model: model(),
      store: false,
      instructions: `Você é o motor de matchmaking do MatchCV AI. Analise somente evidências presentes no currículo e requisitos presentes na vaga. Não invente competências, experiências ou qualificações. O score deve ir de 0 a 100 e refletir aderência contextual, não mera contagem de palavras. Em gaps, diga apenas o que a vaga pede e não encontrou evidência no currículo. Responda em português do Brasil.`,
      input: `CURRÍCULO:\n${resume}\n\nVAGA:\n${job}`,
      text: { format: { type: "json_schema", name: "job_match", strict: true, schema } }
    });
    const data = JSON.parse(response.output_text);
    data.overall_score = Math.max(0, Math.min(100, data.overall_score));
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Falha ao analisar com IA. Verifique a chave, o modelo e o saldo da API."});
  }
}
