import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Send, CheckCircle, AlertCircle, Target, Award, Users, MessageCircle, ArrowRight, Clock, Phone, Mail, Globe, RefreshCw } from 'lucide-react';

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

  const load = async () => {
    try {
      const k = await window.storage.list('rhf:', true);
      if (k?.keys) {
        const ds = [];
        for (const key of k.keys) {
          try {
            const r = await window.storage.get(key, true);
            if (r?.value) ds.push(JSON.parse(r.value));
          } catch (e) {}
        }
        setDiags(ds.sort((a, b) => b.id - a.id));
      }
    } catch (e) {}
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
    const data = {
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

    // Envia os dados para o Google Apps Script
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwnmwzelTbemiEr-cedrpIFrp7dfoYAfsrBWXCIDwjn9VIPZPWpuqc8_bgpHt3rqU8Lmw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Diagnóstico enviado com sucesso!");
        setView('results');
      } else {
        alert("Erro ao enviar diagnóstico.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Ocorreu um erro. Tente novamente.");
    }
  };

  const getColor = (p) => p >= 80 ? '#10b981' : p >= 60 ? '#3b82f6' : p >= 40 ? '#f59e0b' : '#ef4444';

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-2xl"><Users size={40} className="text-white" /></div>
              <div><h1 className="text-3xl font-bold">RHF Talentos</h1><p className="text-gray-600">Painel Admin</p></div>
            </div>
            <button onClick={() => setView('client')} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center gap-2"><Send size={20} /> Formulário</button>
          </div>
          <div className="bg-blue-600 rounded-xl p-6 mb-6 text-white">
            <p className="font-bold mb-2">📋 Link Cliente:</p>
            <input type="text" value={window.location.origin + window.location.pathname} readOnly className="w-full text-gray-900 font-mono text-sm bg-white px-4 py-3 rounded-lg mb-2" />
            <button onClick={() => { navigator.clipboard.writeText(window.location.origin + window.location.pathname); alert('Copiado!'); }} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold">Copiar</button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Diagnósticos ({diags.length})</h2>
          {diags.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center"><AlertCircle size={56} className="mx-auto text-gray-400 mb-4" /><p className="text-gray-700">Nenhum diagnóstico</p></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {diags.map(d => (
                <div key={d.id} className="bg-white border-2 p-5 rounded-xl hover:border-blue-400 cursor-pointer" onClick={() => { setRes(d.res); setName(d.name); setCompany(d.company); setEmail(d.email); setPhone(d.phone); setCargo(d.cargo); setView('results'); }}>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
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
      </div>
    </div>
  );
};

export default App;
