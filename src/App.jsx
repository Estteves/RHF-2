import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Send, CheckCircle, AlertCircle, Target, Award, Users, MessageCircle, ArrowRight, Phone, Mail } from 'lucide-react';

const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwnmwzelTbemiEr-cedrpIFrp7dfoYAfsrBWXCIDwjn9VIPZPWpuqc8_bgpHt3rqU8Lmw/exec';

const App = () => {
  const [view, setView] = useState('client');
  const [res, setRes] = useState({});
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cargo, setCargo] = useState('');
  const [diags, setDiags] = useState([]);

  const qs = [
    { id: 1, d: 'Contratação', i: '🎯', q: 'Consegue contratar pessoas que entregam resultado desde o primeiro mês?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Contratar errado custa 30% do salário anual. Para R$ 5.000/mês = R$ 18.000 de prejuízo.',
      im: 'Custos: rescisão, novo processo, perda de produtividade, clima ruim. Pode chegar a 2x o salário anual.',
      s: 'RHF usa metodologia por competências: mapeamento, triagem qualificada, entrevistas estruturadas, testes técnicos. 92% de acerto em 6 meses.' },
    { id: 2, d: 'Reposição', i: '⚡', q: 'Substitui colaboradores em até 15 dias?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Vaga aberta custa 1,5x o salário/mês. R$ 4.000 = R$ 6.000/mês parado.',
      im: 'Sobrecarga (-15-20% produtividade), atrasos, burnout, perda de talentos. 3 meses = R$ 18.000+ prejuízo.',
      s: 'RHF mantém banco de talentos pré-qualificado. Entrevistas em 48h, candidatos em 5 dias. Média: 7 dias.' },
    { id: 3, d: 'Liderança', i: '👔', q: 'Lideranças desenvolvem e cobram resultados?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Líderes mal preparados reduzem 37% da produtividade. 10 pessoas R$ 80k/mês = R$ 29.600/mês perda.',
      im: 'Alta rotatividade, baixa performance, retrabalho, decisões caras, dono resolve operacional.',
      s: 'RHF desenvolve: diagnóstico, trilha personalizada, treinamentos práticos, mentoria, OKRs.' },
    { id: 4, d: 'Engajamento', i: '💪', q: 'Time veste a camisa e recomenda a empresa?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Alto engajamento = 21% mais lucro. R$ 500k/mês = R$ 105k/mês a mais.',
      im: 'Presenteísmo (-30%), rotatividade (R$ 15-20k/pessoa), qualidade baixa, clima tóxico.',
      s: 'RHF implementa: pesquisa de clima, reconhecimento, desenvolvimento de líderes, eNPS mensal.' },
    { id: 5, d: 'Produtividade', i: '🚀', q: 'Pessoas entregam sem ser lembradas?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Baixa autonomia = -20% produtividade. Folha R$ 100k = R$ 20k/mês perdidos.',
      im: 'Microgerenciamento, atrasos, líderes sem tempo, gargalos, rotatividade.',
      s: 'RHF estrutura: metas SMART, KPIs em tempo real, rituais, gestão à vista, accountability.' },
    { id: 6, d: 'Reconhecimento', i: '🏆', q: 'Diferencia quem entrega mais?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Sem meritocracia = 50% mais turnover. Folha R$ 150k, 3 saídas/ano = R$ 90k.',
      im: 'Melhores saem, mediocridade, custos altos, perda competitividade, desmotivação.',
      s: 'RHF desenha: avaliação OKR, remuneração variável, plano de carreira, reconhecimento, feedback.' },
    { id: 7, d: 'Dados de RH', i: '📊', q: 'Tem dados sobre desempenho, faltas e rotatividade?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'Analytics de RH = 2,8x melhor performance financeira. Milhões de diferença.',
      im: 'Sem dados: custo real desconhecido, turnover ignorado, absenteísmo oculto, achismo caro.',
      s: 'RHF implementa: dashboard executivo, métricas operacionais, performance por área, relatórios mensais.' },
    { id: 8, d: 'RH Estratégico', i: '🎲', q: 'O RH participa do planejamento estratégico?', l: ['Nunca', 'Raramente', 'Às vezes', 'Frequente', 'Sempre'],
      p: 'RH estratégico = 22% mais crescimento. R$ 6M/ano = R$ 1,32M a mais.',
      im: 'Contratações reativas, despreparo, gargalos, perda oportunidades, caos no crescimento.',
      s: 'RHF atua: planejamento headcount 12-24 meses, orçamento integrado, sucessão, estrutura organizacional.' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setView(params.get('admin') === 'true' ? 'admin' : 'client');
    load();
  }, []);

  const load = () => {
    try {
      const ds = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rhf:')) {
          const raw = localStorage.getItem(key);
          if (raw) ds.push(JSON.parse(raw));
        }
      }
      setDiags(ds.sort((a, b) => b.id - a.id));
    } catch (e) {
      console.error(e);
    }
  };

  const calc = () => {
    const results = qs.map(q => ({
      d: q.d,
      i: q.i,
      sc: res[q.id] || 0,
      pc: Math.round(((res[q.id] || 0) / 5) * 100),
      q: q
    }));
    const tot = results.reduce((sum, r) => sum + r.sc, 0);
    const pct = Math.round((tot / 40) * 100);
    const cls = pct >= 81 ? 'RH Estratégico' : pct >= 41 ? 'RH em Evolução' : 'RH Reativo';
    const clr = pct >= 81 ? 'green' : pct >= 41 ? 'blue' : 'red';
    return { rs: results, tot, pct, cls, clr };
  };

  const submit = async () => {
    if (Object.keys(res).length !== 8 || !name || !company || !email || !phone || !cargo) {
      alert('Preencha todos os campos!');
      return;
    }

    const c = calc();
    const d = {
      id: Date.now(),
      name,
      company,
      email,
      phone,
      cargo,
      date: new Date().toLocaleString('pt-BR'),
      res,
      totalScore: c.pct,
      classification: c.cls,
    };

    // 1) salva local (pra seu admin local funcionar)
    try {
      localStorage.setItem('rhf:' + d.id, JSON.stringify({ ...d, ...c }));
      load();
    } catch (e) {
      console.error(e);
    }

    // 2) envia pro Google Apps Script (planilha + email)
    try {
      const response = await fetch(WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });

      const text = await response.text();
      let result = {};
      try { result = JSON.parse(text); } catch (e) {}

      if (result.status !== 'success') {
        console.error('Resposta Apps Script:', text);
        alert('Envio falhou. Abra o console (F12) e me mande o erro.');
        return;
      }

      setView('results');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar. Abra o console (F12) e me mande o erro.');
    }
  };

  const getColor = (p) => (p >= 80 ? '#10b981' : p >= 60 ? '#3b82f6' : p >= 40 ? '#f59e0b' : '#ef4444');

  // --- ADMIN (local) ---
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-2xl"><Users size={40} className="text-white" /></div>
              <div><h1 className="text-3xl font-bold">RHF Talentos</h1><p className="text-gray-600">Painel Admin (local)</p></div>
            </div>
            <button onClick={() => setView('client')} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2"><Send size={20} /> Formulário</button>
          </div>

          <div className="bg-blue-600 rounded-xl p-6 mb-6 text-white">
            <p className="font-bold mb-2">📋 Link Cliente:</p>
            <input type="text" value={window.location.origin + window.location.pathname} readOnly className="w-full text-gray-900 font-mono text-sm bg-white px-4 py-3 rounded-lg mb-2" />
            <button onClick={() => { navigator.clipboard.writeText(window.location.origin + window.location.pathname); alert('Copiado!'); }} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold">Copiar</button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Diagnósticos no seu navegador ({diags.length})</h2>
          {diags.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center"><AlertCircle size={56} className="mx-auto text-gray-400 mb-4" /><p className="text-gray-700">Nenhum diagnóstico salvo neste navegador</p></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {diags.map(d => (
                <div
                  key={d.id}
                  className="bg-white border-2 p-5 rounded-xl hover:border-blue-400 cursor-pointer"
                  onClick={() => { setRes(d.res); setName(d.name); setCompany(d.company); setEmail(d.email); setPhone(d.phone); setCargo(d.cargo); setView('results'); }}
                >
                  <p className="font-bold text-lg">{d.name}</p>
                  <p className="text-sm text-gray-600">{d.cargo} - {d.company}</p>
                  <div className={'text-3xl font-bold mt-2 ' + (d.pct >= 80 ? 'text-green-600' : d.pct >= 60 ? 'text-blue-600' : 'text-red-600')}>{d.pct}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- CLIENT ---
  if (view === 'client') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="bg-blue-600 p-5 rounded-2xl inline-block mb-4"><Users size={56} className="text-white" /></div>
            <h1 className="text-3xl font-bold mb-2">Diagnóstico de Gestão de Pessoas</h1>
            <p className="text-xl text-blue-600 font-semibold">RHF Talentos</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">Suas Informações</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold mb-2">Nome *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" placeholder="Seu nome" /></div>
              <div><label className="block text-sm font-bold mb-2">Cargo *</label><input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" placeholder="Ex: Diretor" /></div>
              <div><label className="block text-sm font-bold mb-2">Empresa *</label><input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" placeholder="Nome empresa" /></div>
              <div><label className="block text-sm font-bold mb-2">Telefone *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" placeholder="(81) 99999-9999" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Email *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" placeholder="seu@email.com" /></div>
            </div>
          </div>

          {name && company && email && phone && cargo ? (
            <button onClick={() => setView('form')} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3">
              Iniciar Diagnóstico <ArrowRight size={24} />
            </button>
          ) : (
            <div className="text-center bg-yellow-50 border-2 border-yellow-200 rounded-xl py-5">
              <AlertCircle size={24} className="mx-auto text-yellow-600 mb-2" />
              <p className="text-yellow-800 font-semibold">Preencha todos os campos</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'form') {
    const prog = Math.round((Object.keys(res).length / 8) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{name} - {cargo}</h1>
            <p className="text-lg text-blue-600">{company}</p>
          </div>

          <div className="mb-8 bg-blue-50 p-6 rounded-xl">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-bold">Progresso</span>
              <span className="text-sm font-bold text-blue-600">{Object.keys(res).length}/8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: prog + '%' }} />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {qs.map(q => (
              <div key={q.id} className={'p-6 rounded-xl border-2 ' + (res[q.id] ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300')}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{q.i}</span>
                  <div><p className="font-bold text-lg">{q.d}</p><p className="text-gray-700">{q.q}</p></div>
                  {res[q.id] && <CheckCircle size={28} className="text-green-600" />}
                </div>

                {!res[q.id] ? (
                  <div className="flex justify-center gap-3 flex-wrap">
                    {q.l.map((lb, i) => (
                      <button
                        key={i}
                        onClick={() => setRes({ ...res, [q.id]: i + 1 })}
                        className="px-5 py-3 bg-white border-2 border-blue-400 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white font-bold"
                      >
                        {i + 1}<br /><span className="text-xs">{lb}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={res[q.id]}
                      onChange={(e) => setRes({ ...res, [q.id]: parseInt(e.target.value) })}
                      className="flex-1 h-3 rounded-lg accent-green-600"
                    />
                    <div className="bg-green-600 text-white w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl">{res[q.id]}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setView('client')} className="bg-gray-200 px-6 py-4 rounded-xl font-bold">← Voltar</button>
            <button onClick={submit} disabled={Object.keys(res).length !== 8} className="flex-1 bg-green-600 text-white py-5 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-3">
              <CheckCircle size={24} />Gerar Diagnóstico
            </button>
          </div>
        </div>
      </div>
    );
  }

  const c = calc();
  const criticos = c.rs.filter(r => r.pc < 60).map(r => r.d).join(', ');
  const wa = `Olá! Fiz o Diagnóstico RHF Talentos

Resultado da ${company}
Nota Final: ${c.pct}% (${c.cls})

Pontos Críticos:
${criticos || 'Nenhum ponto crítico'}

Gostaria de conversar sobre as soluções.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-10 pb-8 border-b-2">
          <div className="bg-blue-600 p-4 rounded-2xl inline-block mb-4"><Award size={48} className="text-white" /></div>
          <h1 className="text-3xl font-bold mb-3">Diagnóstico de Gestão de Pessoas</h1>
          <p className="text-2xl font-bold text-blue-600">{name}</p>
          <p className="text-lg text-gray-600">{cargo} • {company}</p>
        </div>

        <div className={'bg-gradient-to-br rounded-2xl p-8 text-white text-center shadow-xl mb-10 ' + (c.clr === 'green' ? 'from-green-600 to-green-700' : c.clr === 'blue' ? 'from-blue-600 to-blue-700' : 'from-red-600 to-red-700')}>
          <Target size={48} className="mx-auto mb-4" />
          <p className="text-lg font-semibold mb-3">Nota Final</p>
          <div className="text-6xl font-bold mb-2">{c.pct}%</div>
          <p className="text-sm">{c.tot} de 40 pontos</p>
          <div className="mt-4 pt-4 border-t border-white border-opacity-30"><p className="font-bold">{c.cls}</p></div>
        </div>

        <div className="mb-10 bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Análise por Dimensão</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={c.rs} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="d" type="category" width={130} />
              <Tooltip />
              <Bar dataKey="pc" radius={[0, 12, 12, 0]}>
                {c.rs.map((e, i) => <Cell key={i} fill={getColor(e.pc)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-10 text-white shadow-2xl mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">🎯 Próximos Passos</h2>
          <p className="text-lg leading-relaxed mb-8 text-center">Você já tem clareza sobre onde estão as oportunidades. Agora é hora de agir! A RHF Talentos pode ajudar a transformar esse diagnóstico em resultados reais.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
              <Phone size={40} className="mx-auto mb-4" />
              <p className="font-bold text-xl mb-2">WhatsApp</p>
              <a
                href={'https://wa.me/5581992731634?text=' + encodeURIComponent(wa)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                <MessageCircle size={24} /> Falar Agora
              </a>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
              <Mail size={40} className="mx-auto mb-4" />
              <p className="font-bold text-xl mb-2">Email</p>
              <p className="text-sm opacity-90 mb-4">estteves.santos@rhf.com.br</p>
              <a
                href={'mailto:estteves.santos@rhf.com.br?subject=Diagnóstico RHF - ' + company + '&body=' + encodeURIComponent(wa)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                <Mail size={24} /> Enviar Email
              </a>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
            <p className="text-sm font-bold mb-2">📋 Resumo:</p>
            <div className="bg-black bg-opacity-30 p-4 rounded-lg text-left text-sm">
              <p className="whitespace-pre-line">{wa}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => { setView('client'); setRes({}); setName(''); setCompany(''); setEmail(''); setPhone(''); setCargo(''); }}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700"
        >
          ← Nova Avaliação
        </button>
      </div>
    </div>
  );
};

export default App;
