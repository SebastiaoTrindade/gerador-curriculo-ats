import { client, model, methodGuard } from "./_openai.js";

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    professional_summary: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    experience: { type: "array", items: { type: "object", properties: {
      company:{type:"string"}, role:{type:"string"}, period:{type:"string"},
      bullets:{type:"array",items:{type:"string"}}
    }, required:["company","role","period","bullets"], additionalProperties:false } },
    education: { type: "array", items: { type: "string" } },
    certifications: { type: "array", items: { type: "string" } },
    languages: { type: "array", items: { type: "string" } },
    ats_notes: { type: "array", items: { type: "string" } }
  },
  required:["title","professional_summary","skills","experience","education","certifications","languages","ats_notes"],
  additionalProperties:false
};

export default async function handler(req,res) {
  if (!methodGuard(req,res)) return;
  try {
    const { resume, job, match } = req.body || {};
    if (!resume || !job || !match) return res.status(400).json({error:"Dados insuficientes para gerar o currículo."});
    const response = await client().responses.create({
      model:model(),
      store:false,
      instructions:`Você é especialista em currículos ATS. Gere uma versão direcionada à vaga, mas é PROIBIDO inventar qualquer fato. Não crie empresas, cargos, datas, números, formação, certificações, idiomas, tecnologias ou resultados que não estejam no currículo original. Você pode reorganizar, resumir e melhorar a redação. Uma skill da vaga que seja gap não pode ser adicionada como skill do candidato. Se uma seção não existir no original, devolva array vazio. Preserve nomes e fatos. Responda em português do Brasil.`,
      input:`CURRÍCULO ORIGINAL:\n${resume}\n\nVAGA:\n${job}\n\nANÁLISE DE MATCH:\n${JSON.stringify(match)}`,
      text:{format:{type:"json_schema",name:"ats_resume",strict:true,schema}}
    });
    res.status(200).json(JSON.parse(response.output_text));
  } catch(error) {
    console.error(error);
    res.status(500).json({error:"Falha ao gerar currículo com IA. Verifique a configuração da API."});
  }
}
