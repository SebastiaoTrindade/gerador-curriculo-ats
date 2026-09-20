# MatchCV AI

MVP acadêmico de um **AI Career Copilot** que compara um currículo com uma vaga e gera uma versão ATS-friendly usando IA real.

## Problema

Candidatos frequentemente enviam o mesmo currículo para oportunidades diferentes e têm dificuldade para identificar quais requisitos de uma vaga já estão presentes em sua trajetória profissional.

## Solução

O MatchCV AI permite:

1. Colar o currículo.
2. Colar a descrição de uma vaga.
3. Analisar a compatibilidade usando IA.
4. Visualizar Match Score, pontos fortes, gaps e palavras-chave.
5. Gerar uma versão do currículo direcionada à vaga e preparada para ATS.

A IA recebe uma regra central: **otimizar sem inventar**.

## Stack

- React
- TypeScript
- Vite
- CSS responsivo inspirado no design system shadcn/ui
- Lucide Icons
- OpenAI Responses API
- Vercel Serverless Functions

## Segurança

A chave da OpenAI fica somente no servidor. Nunca use `VITE_OPENAI_API_KEY` ou coloque a chave no frontend.

O projeto usa `store: false` nas chamadas da Responses API.

## Executar interface localmente

```bash
npm install
npm run dev
```

Para testar as rotas serverless localmente, utilize a CLI da Vercel:

```bash
npm install -g vercel
vercel dev
```

Crie `.env.local`:

```env
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-5.6-luna
```

> O nome do modelo pode ser alterado sem modificar o código. Use um modelo disponível em sua conta da OpenAI API.

## Deploy na Vercel

1. Envie este projeto para um repositório GitHub.
2. Importe o repositório na Vercel.
3. Em **Environment Variables**, adicione `OPENAI_API_KEY`.
4. Opcionalmente adicione `OPENAI_MODEL`.
5. Faça o deploy.

Não faça commit do `.env.local`.

## GitHub

```bash
git init
git add .
git commit -m "feat: MatchCV AI MVP"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

## Limitações intencionais do MVP

- Sem autenticação.
- Sem banco de dados.
- Sem histórico persistente.
- Entrada do currículo por texto nesta versão.
- A disponibilidade da análise real depende de uma chave OpenAI API válida e com acesso ao modelo configurado.
- O produto é um MVP acadêmico e não promete contratação ou aprovação em sistemas ATS.

## Próximas evoluções

- Upload PDF/DOCX.
- Autenticação.
- Persistência com Supabase/PostgreSQL.
- Histórico de currículos.
- Pipeline de candidaturas.
- Exportação PDF/DOCX.
- Controle de consumo e planos.

## Fluxo

```text
Currículo
   ↓
Descrição da vaga
   ↓
OpenAI
   ↓
Match Score
   ├── Pontos fortes
   ├── Gaps
   └── Keywords ATS
   ↓
Gerador ATS
   ↓
Currículo personalizado
```

## Uso responsável de IA

O prompt de sistema proíbe a criação de experiências, empresas, competências, formação, certificações e resultados inexistentes. Gaps da vaga não são adicionados automaticamente ao currículo.

---

Projeto desenvolvido como entrega de bootcamp.
