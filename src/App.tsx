import { useMemo, useState } from "react";
import { BrainCircuit, BriefcaseBusiness, CheckCircle2, Copy, FileText, Gauge, LoaderCircle, Sparkles, Target, TriangleAlert } from "lucide-react";
import { analyzeMatch, generateResume } from "./lib/api";
import type { MatchResult, ResumeResult } from "./types";

const demoResume = `Sebastião Oliveira
Desenvolvedor Ruby on Rails
Experiência com Ruby on Rails, PostgreSQL, Tailwind CSS, JavaScript, Git e Linux.
Desenvolvimento de sistemas web responsivos, dashboards, autenticação, relatórios e integrações com APIs.
Projetos: sistema de controle de acesso de veículos, sistema de consumo de água e sistema de gestão para projeto de Jiu-Jitsu.
Conhecimentos: Ruby, Rails, PostgreSQL, HTML, CSS, Tailwind, JavaScript, Git, Linux, REST APIs.`;

const demoJob = `Desenvolvedor Backend Ruby on Rails
Buscamos profissional para desenvolver e manter aplicações web em Ruby on Rails.
Requisitos: Ruby, Rails, PostgreSQL, APIs REST, Git e experiência com Linux.
Desejável: Docker, AWS, testes automatizados e CI/CD.
Modelo remoto.`;

function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [optimized, setOptimized] = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState<"match"|"resume"|null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"analyze"|"result"|"resume">("analyze");

  const canAnalyze = resume.trim().length > 40 && job.trim().length > 40;
  const scoreTone = useMemo(() => {
    const s = match?.overall_score ?? 0;
    return s >= 80 ? "high" : s >= 60 ? "mid" : "low";
  }, [match]);

  async function runMatch() {
    if (!canAnalyze) return;
    setError(""); setLoading("match"); setOptimized(null);
    try {
      const result = await analyzeMatch(resume, job);
      setMatch(result); setTab("result");
    } catch (e) { setError(e instanceof Error ? e.message : "Erro inesperado."); }
    finally { setLoading(null); }
  }

  async function runResume() {
    if (!match) return;
    setError(""); setLoading("resume");
    try {
      const result = await generateResume(resume, job, match);
      setOptimized(result); setTab("resume");
    } catch (e) { setError(e instanceof Error ? e.message : "Erro inesperado."); }
    finally { setLoading(null); }
  }

  function loadDemo() {
    setResume(demoResume); setJob(demoJob); setMatch(null); setOptimized(null); setTab("analyze"); setError("");
  }

  function copyResume() {
    if (!optimized) return;
    const text = [
      optimized.title, optimized.professional_summary,
      "\nCOMPETÊNCIAS\n" + optimized.skills.join(" • "),
      ...optimized.experience.map(e => `\n${e.role} — ${e.company} | ${e.period}\n${e.bullets.map(b=>"• "+b).join("\n")}`),
      optimized.education.length ? "\nFORMAÇÃO\n"+optimized.education.join("\n") : "",
      optimized.certifications.length ? "\nCERTIFICAÇÕES\n"+optimized.certifications.join("\n") : "",
      optimized.languages.length ? "\nIDIOMAS\n"+optimized.languages.join("\n") : ""
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="logo"><BrainCircuit size={21}/></span><strong>MatchCV <em>AI</em></strong></div>
      <span className="mvp">MVP • Bootcamp</span>
    </header>

    <main>
      <section className="hero">
        <div className="eyebrow"><Sparkles size={15}/> IA aplicada à sua carreira</div>
        <h1>O currículo certo para <span>cada oportunidade.</span></h1>
        <p>Compare seu perfil com uma vaga, descubra pontos fortes e gaps e gere uma versão ATS-friendly usando inteligência artificial real.</p>
        <div className="flow"><span>Currículo</span><b>→</b><span>Vaga</span><b>→</b><span>Match IA</span><b>→</b><span>Currículo ATS</span></div>
      </section>

      <nav className="steps">
        <button className={tab==="analyze"?"active":""} onClick={()=>setTab("analyze")}><FileText/>1. Dados</button>
        <button className={tab==="result"?"active":""} disabled={!match} onClick={()=>match&&setTab("result")}><Target/>2. Match</button>
        <button className={tab==="resume"?"active":""} disabled={!optimized} onClick={()=>optimized&&setTab("resume")}><Sparkles/>3. Currículo ATS</button>
      </nav>

      {error && <div className="error"><TriangleAlert size={18}/>{error}</div>}

      {tab==="analyze" && <section className="panel">
        <div className="panel-head">
          <div><h2>Analise sua oportunidade</h2><p>Cole o conteúdo do currículo e a descrição completa da vaga.</p></div>
          <button className="ghost" onClick={loadDemo}>Preencher exemplo</button>
        </div>
        <div className="input-grid">
          <label><span><FileText size={17}/> Seu currículo</span><textarea value={resume} onChange={e=>setResume(e.target.value)} placeholder="Cole aqui o texto do seu currículo..."/></label>
          <label><span><BriefcaseBusiness size={17}/> Descrição da vaga</span><textarea value={job} onChange={e=>setJob(e.target.value)} placeholder="Cole aqui a descrição da vaga..."/></label>
        </div>
        <div className="privacy"><CheckCircle2 size={16}/> A IA é instruída a não inventar experiências, competências, empresas ou resultados.</div>
        <button className="primary" disabled={!canAnalyze||!!loading} onClick={runMatch}>
          {loading==="match"?<><LoaderCircle className="spin"/>Comparando perfil e oportunidade...</>:<><Sparkles/>Analisar compatibilidade com IA</>}
        </button>
      </section>}

      {tab==="result" && match && <section className="results">
        <div className="score-card">
          <div className={`score ${scoreTone}`}><strong>{match.overall_score}%</strong><span>Match</span></div>
          <div><div className="eyebrow"><Gauge size={15}/> Resultado da análise</div><h2>{match.overall_score>=80?"Alta compatibilidade":match.overall_score>=60?"Boa compatibilidade":"Compatibilidade parcial"}</h2><p>{match.summary}</p></div>
        </div>
        <div className="result-grid">
          <ResultCard title="Pontos fortes" items={match.strengths} kind="good"/>
          <ResultCard title="Gaps identificados" items={match.gaps} kind="warn"/>
        </div>
        <div className="panel compact">
          <h3>Palavras-chave ATS encontradas</h3>
          <div className="chips">{match.matched_keywords.map(x=><span className="chip good" key={x}>{x}</span>)}</div>
          {match.missing_keywords.length>0 && <><h3 className="spaced">Palavras relevantes ausentes</h3><div className="chips">{match.missing_keywords.map(x=><span className="chip warn" key={x}>{x}</span>)}</div></>}
        </div>
        <div className="panel compact"><h3>Recomendações da IA</h3><ul>{match.recommendations.map(x=><li key={x}>{x}</li>)}</ul></div>
        <button className="primary" disabled={!!loading} onClick={runResume}>
          {loading==="resume"?<><LoaderCircle className="spin"/>Criando versão ATS...</>:<><Sparkles/>Criar currículo para esta vaga</>}
        </button>
      </section>}

      {tab==="resume" && optimized && <section className="resume-layout">
        <div className="resume-actions"><div><div className="eyebrow"><Sparkles size={15}/> Currículo personalizado</div><h2>Versão ATS-friendly</h2></div><button className="ghost" onClick={copyResume}><Copy size={16}/> Copiar currículo</button></div>
        <article className="resume-paper">
          <h1>{optimized.title}</h1>
          <h3>RESUMO PROFISSIONAL</h3><p>{optimized.professional_summary}</p>
          {optimized.skills.length>0&&<><h3>COMPETÊNCIAS</h3><p>{optimized.skills.join(" • ")}</p></>}
          {optimized.experience.length>0&&<><h3>EXPERIÊNCIA PROFISSIONAL</h3>{optimized.experience.map((e,i)=><div className="experience" key={i}><strong>{e.role}</strong><span>{e.company} • {e.period}</span><ul>{e.bullets.map((b,j)=><li key={j}>{b}</li>)}</ul></div>)}</>}
          {optimized.education.length>0&&<><h3>FORMAÇÃO</h3>{optimized.education.map(x=><p key={x}>{x}</p>)}</>}
          {optimized.certifications.length>0&&<><h3>CERTIFICAÇÕES</h3>{optimized.certifications.map(x=><p key={x}>{x}</p>)}</>}
          {optimized.languages.length>0&&<><h3>IDIOMAS</h3>{optimized.languages.map(x=><p key={x}>{x}</p>)}</>}
        </article>
        <div className="truth-note"><CheckCircle2 size={17}/> Conteúdo otimizado exclusivamente a partir das informações fornecidas no currículo.</div>
      </section>}
    </main>
    <footer>MatchCV AI • MVP acadêmico • Inteligência artificial aplicada ao processo de candidatura</footer>
  </div>
}

function ResultCard({title,items,kind}:{title:string;items:string[];kind:"good"|"warn"}) {
  return <div className="panel compact"><h3>{title}</h3><div className="chips">{items.map(x=><span className={`chip ${kind}`} key={x}>{x}</span>)}</div></div>
}
export default App;
