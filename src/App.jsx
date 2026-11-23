import { useState, useEffect, useRef } from 'react'

const APP = 'AgroZero'

// ---------- dados de exemplo (mock) ----------
const PLOTS = [
  { id: 1, cultura: 'Alface', ha: 1.2, ndvi: 0.78, umid: 62 },
  { id: 2, cultura: 'Tomate', ha: 2.0, ndvi: 0.71, umid: 48 },
  { id: 3, cultura: 'Alface', ha: 1.5, ndvi: 0.52, umid: 35 },
  { id: 4, cultura: 'Couve', ha: 0.8, ndvi: 0.64, umid: 55 },
  { id: 5, cultura: 'Milho', ha: 3.2, ndvi: 0.33, umid: 22 },
  { id: 6, cultura: 'Coentro', ha: 0.5, ndvi: 0.74, umid: 58 },
]
const ALERTS = [
  { id: 1, sev: 'd', plot: 5, ico: '💧', badge: 'Crítico', time: 'Hoje, 09:14', t: 'Seca detectada — Talhão 5', d: 'Umidade do solo em 22%, abaixo do limite de 35%.', a: 'Irrigue hoje às 18h, cerca de 15 mm. Evite o calor do meio-dia.' },
  { id: 2, sev: 'w', plot: 3, ico: '❄️', badge: 'Médio', time: 'Hoje, 06:00', t: 'Risco de geada em 48h — Talhão 3', d: 'Mínima prevista de 2 °C na sexta, às 4h. A alface é vulnerável.', a: 'Colha hoje a alface pronta (cerca de 40 kg) e cubra o restante com lona ou palha à tarde.' },
  { id: 3, sev: 'w', plot: 5, ico: '🐛', badge: 'Médio', time: 'Ontem, 18:30', t: 'Possível foco de praga — Talhão 5', d: 'A cor das folhas mudou no canto leste, antes de aparecer a olho nu.', a: 'Vá até o canto leste e trate só essa área.' },
  { id: 4, sev: 'o', plot: 1, ico: '🌾', badge: 'Oportuno', time: 'Ontem, 18:30', t: 'Janela de colheita — Talhão 1', d: 'NDVI 0,78, maturidade plena. Sem chuva nos próximos 5 dias.', a: 'Boa hora para colher. Publique a oferta em Mercado.' },
]
const PRICES = { Alface: [3.2, 3.8], Tomate: [5.5, 6.5], Couve: [2.8, 3.3], Milho: [1.1, 1.4], Coentro: [8, 10] }
const ORDERS0 = [
  { id: 1, ico: '🏫', quem: 'Escola Municipal Rio Verde', prod: 'Alface', kg: 30, total: 105, st: 'novo' },
  { id: 2, ico: '🛒', quem: 'Mercado Bom Preço', prod: 'Couve', kg: 15, total: 51, st: 'novo' },
  { id: 3, ico: '🤝', quem: 'Cooperativa Vale Verde', prod: 'Tomate', kg: 20, total: 116, st: 'entregue' },
]
const ST = { novo: 'w', aceito: 'o', entregue: 'o', recusado: 'd' }
const TITLES = { home: 'Início', map: 'Mapa satelital', alerts: 'Central de alertas', weather: 'Clima da semana', chat: 'Assistente AgroIA', market: 'Mercado local', reports: 'Relatórios', cfg: 'Configurações', profile: 'Meu perfil' }
const NAV = [
  ['home', 'Início', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
  ['map', 'Mapa', 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  ['alerts', 'Alertas', 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0'],
  ['weather', 'Clima', 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'],
  ['chat', 'IA', 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM8 21h8M12 17v4'],
  ['market', 'Mercado', 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0'],
  ['reports', 'Relatórios', 'M18 20V10M12 20V4M6 20v-6'],
]
const SUG = ['Quando devo irrigar?', 'Vai ter geada?', 'Qual o preço da alface?']
const WEEKS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']
const SERIES = [
  { n: 'T5', c: '#E63946', d: [0.72, 0.69, 0.65, 0.58, 0.5, 0.42, 0.37, 0.33] },
  { n: 'T3', c: '#F9A825', d: [0.7, 0.68, 0.66, 0.62, 0.6, 0.57, 0.54, 0.52] },
  { n: 'T1', c: '#52B788', d: [0.68, 0.7, 0.72, 0.74, 0.75, 0.77, 0.78, 0.78] },
]

// ---------- clima (dados de exemplo) ----------
const DAYS = [
  { d: 'Hoje', ico: '☀️', txt: 'Sol, sem chuva', min: 13, max: 24, mm: 0, pp: 5 },
  { d: 'Qui', ico: '⛅', txt: 'Sol com nuvens', min: 10, max: 22, mm: 0, pp: 15 },
  { d: 'Sex', ico: '❄️', txt: 'Geada às 4h', min: 2, max: 17, mm: 0, pp: 5, fr: 1 },
  { d: 'Sáb', ico: '🌤️', txt: 'Sol com nuvens', min: 6, max: 21, mm: 0, pp: 10 },
  { d: 'Dom', ico: '⛅', txt: 'Nublado', min: 9, max: 23, mm: 1, pp: 30 },
  { d: 'Seg', ico: '🌧️', txt: 'Chuva forte', min: 12, max: 20, mm: 14, pp: 60 },
  { d: 'Ter', ico: '🌦️', txt: 'Pancadas isoladas', min: 11, max: 19, mm: 6, pp: 45 },
]
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = (18 + i) % 24, nxt = i >= 6, [mn, mx] = nxt ? [10, 22] : [13, 24]
  const t = Math.round(mn + (mx - mn) * (0.5 + 0.5 * Math.sin((2 * Math.PI * (h - 9)) / 24)))
  const dia = h >= 6 && h < 18
  return { h: i === 0 ? 'Agora' : h + 'h', t, ico: !dia ? '🌙' : nxt && h >= 12 ? '⛅' : '☀️', pp: nxt && h >= 15 && h < 18 ? 30 : 5 }
})
const TIPS = [
  { sev: 'o', ico: '🧪', badge: 'Oportuno', t: 'Janela de pulverização', d: 'Quinta, das 8h às 11h: vento abaixo de 10 km/h e sem chuva.', time: 'Melhor horário da semana' },
  { sev: 'w', ico: '💧', badge: 'Atenção', t: 'Irrigação', d: 'Segunda deve chover cerca de 14 mm. Irrigue hoje e pule a rega de domingo.', time: 'Economia estimada: 15 mm de água' },
  { sev: 'o', ico: '🌾', badge: 'Oportuno', t: 'Colheita', d: 'Hoje e sábado têm tempo firme. Colha a alface hoje, antes da geada.', time: 'Sem chuva até domingo' },
]

// ---------- utilidades ----------
const br = n => n.toFixed(2).replace('.', ',')
const vir = n => String(n).replace('.', ',')
const rs = n => 'R$ ' + br(n)
const status = v => (v >= 0.75 ? ['e', 'Excelente'] : v >= 0.6 ? ['o', 'Saudável'] : v >= 0.45 ? ['w', 'Estressado'] : ['d', 'Crítico'])
const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16))
const STOPS = ['#E63946', '#E63946', '#F9A825', '#52B788', '#2D6A4F', '#1B4332']
function ndviColor(v) {
  v = Math.max(0, Math.min(1, v))
  const i = Math.min(Math.floor(v / 0.2), 4)
  const t = (v - i * 0.2) / 0.2
  const a = hex(STOPS[i]), b = hex(STOPS[i + 1])
  return `rgb(${a.map((x, k) => Math.round(x + (b[k] - x) * t)).join(',')})`
}
let seed = 42
const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296
const NOISE = PLOTS.map(() => Array.from({ length: 81 }, () => rnd() - 0.5))
const rich = t => t.split('**').map((s, i) => (i % 2 ? <strong key={i}>{s}</strong> : s))

function speak(text) {
  if (!VOICE.on) return note('A voz está desativada em Configurações.')
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'pt-BR'
  u.rate = VOICE.rate
  speechSynthesis.speak(u)
}

// guarda no aparelho (funciona sem internet)
function useStore(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch {} }, [key, v])
  return [v, setV]
}

// assistente simulado: troque por uma API de IA depois
function answer(q) {
  const s = q.toLowerCase()
  const seco = [...PLOTS].sort((a, b) => a.umid - b.umid)[0]
  if (/irrig|água|agua|seca/.test(s)) return `O Talhão ${seco.id} (${seco.cultura}) tem a menor umidade: **${seco.umid}%**, abaixo do limite de 35%. Irrigue **hoje às 18h** com cerca de 15 mm.`
  if (/geada|frio/.test(s)) return 'Há risco moderado de **geada em 48h** no Talhão 3, com mínima de **2 °C** às 4h. Colha hoje a alface pronta e cubra o restante à tarde.'
  if (/praga|doen/.test(s)) return 'O **Talhão 5** mostra estresse nas folhas, no canto leste. Vá até lá e trate só o foco.'
  if (/pre[çc]o|vend|comprador|alface/.test(s)) return 'A alface está entre **R$ 3,20 e R$ 3,80** por kg na sua região. Há **2 pedidos novos** esperando você em Mercado.'
  return 'Posso ajudar com **irrigação**, **geada**, **pragas** e **vendas**. Tente perguntar: “Quando devo irrigar?”'
}

// ---------- configurações e perfil ----------
const GEAR = 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'
const DEF = { tema: 'auto', fonte: 'normal', push: true, sms: true, wpp: true, email: false, nGeada: true, nSeca: true, nPraga: true, nPedido: true, silencio: false, voz: true, vozVel: 'normal', wifi: false, offline: false, loc: true, fat2: false }
const DEFP = { nome: 'João Silva', cel: '', email: '', cpf: '', dap: '', foto: '', prop: 'Sítio Boa Esperança', mun: '', tipo: 'Agricultor familiar', raio: 15, dias: ['Seg', 'Qua', 'Sex'] }
const SETS = [
  ['Aparência', [
    ['tema', 'Tema', 'seg', [['auto', 'Auto'], ['claro', 'Claro'], ['escuro', 'Escuro']]],
    ['fonte', 'Tamanho do texto', 'seg', [['normal', 'A'], ['grande', 'A+'], ['maior', 'A++']]],
  ]],
  ['Notificações', [
    ['push', 'Notificações no aparelho', 'sw'],
    ['sms', 'Alertas por SMS', 'sw', 'Chegam mesmo sem internet'],
    ['wpp', 'Alertas por WhatsApp', 'sw'],
    ['email', 'Resumo semanal por e-mail', 'sw'],
    ['nGeada', 'Geada e frio', 'sw'],
    ['nSeca', 'Seca e irrigação', 'sw'],
    ['nPraga', 'Pragas e doenças', 'sw'],
    ['nPedido', 'Pedidos de compradores', 'sw'],
    ['silencio', 'Não perturbe (22h às 6h)', 'sw', 'Alertas críticos continuam chegando'],
    ['teste', 'Enviar alerta de teste', 'btn', ['btn-g', 'Enviar']],
  ]],
  ['Voz e acessibilidade', [
    ['voz', 'Botões de ouvir', 'sw', 'Lê alertas e respostas em voz alta'],
    ['vozVel', 'Velocidade da voz', 'seg', [['lenta', 'Lenta'], ['normal', 'Normal'], ['rapida', 'Rápida']]],
  ]],
  ['Dados e conexão', [
    ['wifi', 'Sincronizar só no Wi-Fi', 'sw', 'Economiza o seu pacote de dados'],
    ['offline', 'Simular sem internet', 'sw', 'Para testar o modo offline'],
    ['sync', 'Sincronizar agora', 'btn', ['btn-g', 'Sincronizar']],
    ['exp', 'Exportar meus dados', 'btn', ['btn-g', 'Exportar']],
    ['limpar', 'Limpar dados salvos', 'btn', ['btn-d', 'Limpar']],
  ]],
  ['Privacidade e segurança', [
    ['loc', 'Usar a localização da propriedade', 'sw', 'Necessária para clima e alertas por talhão'],
    ['fat2', 'Verificação em duas etapas', 'sw'],
    ['senha', 'Alterar senha', 'btn', ['btn-g', 'Alterar']],
  ]],
  ['Sobre', [
    ['ajuda', 'Ajuda e suporte', 'btn', ['btn-g', 'Abrir']],
    ['termos', 'Termos de uso', 'btn', ['btn-g', 'Ler']],
    ['priv', 'Política de privacidade', 'btn', ['btn-g', 'Ler']],
    ['ver', 'Versão do app: 0.1 (protótipo)', 'info'],
  ]],
]
const USER = 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
const MORE = ['alerts', 'chat', 'reports'] // no celular ficam dentro do botão "Mais"
const ini = n => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || 'P'
const AvIn = ({ p }) => (p.foto ? <img src={p.foto} alt="" /> : ini(p.nome))
const note = m => window.dispatchEvent(new CustomEvent('az-toast', { detail: m }))
const VOICE = { on: true, rate: 1 }
const P = { prop: 'Sítio Boa Esperança' }

// ---------- peças ----------
const Ic = ({ d }) => <svg className="ic" viewBox="0 0 24 24"><path d={d} /></svg>
const K = ({ l, v, h, c, vc }) => (
  <div className="kpi"><div className="kl">{l}</div><div className={'kv ' + (vc || '')}>{v}</div><div className={'kh ' + (c || '')}>{h}</div></div>
)
const Legend = () => (
  <div className="legend">
    {[['#1B4332', 'Excelente'], ['#52B788', 'Saudável'], ['#F9A825', 'Estressado'], ['#E63946', 'Crítico'], ['#1565C0', 'Água']].map(([c, l]) => (
      <span key={l}><i style={{ background: c }} />{l}</span>
    ))}
  </div>
)
function AC({ sev, ico, t, badge, d, time, children }) {
  return (
    <div className="ac">
      <i className="strip" style={{ background: `var(--${sev})` }} />
      <div className="acb">
        <span className="aci" style={{ background: `var(--${sev}Bg)` }}>{ico}</span>
        <div style={{ flex: 1 }}>
          <div className="act">{t}<span className={'bd bd-' + sev}>{badge}</span></div>
          <p className="acd">{d}</p>
          <p className="actm">{time}</p>
        </div>
      </div>
      {children && <div className="acf">{children}</div>}
    </div>
  )
}

const POS = [[8, 8], [106, 8], [204, 8], [8, 104], [106, 104], [204, 104]]
function Heat({ layer = 'ndvi', plot, onPick }) {
  return (
    <svg className="heat" viewBox="0 0 300 214" width="100%" role="img" aria-label="Mapa dos talhões">
      {PLOTS.map((p, i) => {
        const [x, y] = POS[i]
        return (
          <g key={p.id} style={{ cursor: onPick ? 'pointer' : 'default' }} tabIndex={onPick ? 0 : undefined} role={onPick ? 'button' : undefined}
            aria-label={'Talhão ' + p.id} onClick={() => onPick && onPick(p.id)} onKeyDown={e => e.key === 'Enter' && onPick && onPick(p.id)}>
            {NOISE[i].map((n, k) => (
              <rect key={k} x={x + (k % 9) * 10} y={y + Math.floor(k / 9) * 10} width="10.5" height="10.5"
                fill={layer === 'ndvi' ? ndviColor(p.ndvi + n * 0.12) : `hsl(210 70% ${Math.round(88 - (p.umid + n * 12) * 0.6)}%)`} />
            ))}
            <rect x={x} y={y} width="90" height="90" fill="none" stroke={p.id === plot ? '#fff' : 'none'} strokeWidth="3.5" />
            <rect x={x + 22} y={y + 38} width="46" height="15" rx="4" fill="rgba(255,255,255,.9)" />
            <text x={x + 45} y={y + 49} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0C1C12">Talhão {p.id}</text>
          </g>
        )
      })}
      <rect x="8" y="198" width="286" height="10" rx="4" fill="#1565C0" />
    </svg>
  )
}

// ---------- telas ----------
function Home({ go, orders, offers }) {
  const act = ALERTS.filter(a => a.sev !== 'o')
  const avg = PLOTS.reduce((s, p) => s + p.ndvi, 0) / PLOTS.length
  const novos = orders.filter(o => o.st === 'novo')
  const n = novos[0]
  return (
    <>
      <div className="kpis">
        <K l="Talhões" v="6" h="↑ 9,2 ha no total" c="up" />
        <K l="NDVI médio" v={br(avg)} h="↑ +0,04 esta semana" c="up" />
        <K l="Alertas ativos" v={act.length} vc="dr" h="1 crítico · 2 médios" c="wr" />
        <K l="Próx. irrigação" v="Hoje" h="Talhão 5 · 18:00" />
      </div>
      <div className="hgrid">
        <div className="card">
          <div className="ch"><span className="ct">Mapa NDVI · {P.prop}</span><span className="cs">Sentinel-2</span></div>
          <Heat />
          <Legend />
        </div>
        <div className="col">
          <div className="slbl">Alertas recentes</div>
          {act.slice(0, 2).map(a => (
            <button key={a.id} className="calrt" onClick={() => go('alerts')}>
              <span className="cad" style={{ background: `var(--${a.sev})` }} />
              <span><b className="cat">{a.t}</b><span className="cac">{a.d}</span><span className="cam">{a.time} · {a.badge}</span></span>
            </button>
          ))}
          <div className="slbl">Clima</div>
          <button className="calrt" onClick={() => go('weather')}>
            <span className="cad" style={{ background: 'var(--w)' }} />
            <span><b className="cat">{HOURS[0].t}° agora · geada na sexta</b><span className="cac">Mínima de 2° às 4h. Segunda deve chover 14 mm.</span></span>
          </button>
          <div className="slbl">Mercado local</div>
          <div className="calrt v">
            <b className="cat">{novos.length} pedidos novos · {offers.length} ofertas ativas</b>
            <span className="cac">{n ? `${n.quem} pede ${n.kg} kg de ${n.prod.toLowerCase()}.` : 'Nenhum pedido novo agora.'}</span>
            <button className="btn btn-p" onClick={() => go('market')}>Ver pedidos</button>
          </div>
        </div>
      </div>
    </>
  )
}

function MapView({ plot, setPlot, go }) {
  const [layer, setLayer] = useState('ndvi')
  const [sent, setSent] = useState(null)
  const p = PLOTS.find(x => x.id === plot)
  const [s, sl] = status(p.ndvi)
  const al = ALERTS.find(a => a.plot === p.id && a.sev !== 'o')
  return (
    <div className="mapgrid">
      <div className="card">
        <div className="chips lay">
          {[['ndvi', 'NDVI'], ['umid', 'Umidade']].map(([k, l]) => (
            <button key={k} className={'chip' + (layer === k ? ' on' : '')} onClick={() => setLayer(k)}>{l}</button>
          ))}
        </div>
        <Heat layer={layer} plot={plot} onPick={setPlot} />
        {layer === 'ndvi' && <Legend />}
      </div>
      <div className="col">
      <div className="card pnl">
        <div className="mpt">Talhão {p.id} · selecionado<span className={'bd bd-' + s}>{sl}</span></div>
        <div className="mpg">
          {[['Área', vir(p.ha) + ' ha'], ['Cultura', p.cultura], ['NDVI atual', br(p.ndvi)], ['Umidade do solo', p.umid + '%']].map(([l, v]) => (
            <div key={l}><div className="mpl">{l}</div><div className="mpv">{v}</div></div>
          ))}
        </div>
        <div className={'rec ' + (al ? al.sev : 'o')}>IA recomenda: <strong>{al ? al.a : 'manter o manejo atual. Sem alertas neste talhão.'}</strong></div>
        <button className="btn btn-p full" onClick={() => setSent(p.id)}>{sent === p.id ? 'SMS enviado ao operador ✓' : 'Notificar operador via SMS'}</button>
        {al && <button className="btn btn-g full" onClick={() => go('alerts')}>Ver alertas</button>}
      </div>
      <div className="card">
        <div className="ch"><span className="ct">Todos os talhões</span></div>
        {PLOTS.map(q => {
          const [qs, ql] = status(q.ndvi)
          return (
            <button key={q.id} className={'srow plr' + (q.id === plot ? ' sel' : '')} onClick={() => setPlot(q.id)}>
              <span><b>Talhão {q.id}</b> · {q.cultura} · {vir(q.ha)} ha</span>
              <span><b style={{ color: `var(--${qs})` }}>{br(q.ndvi)}</b><span className={'bd bd-' + qs}>{ql}</span></span>
            </button>
          )
        })}
      </div>
    </div>
    </div>
  )
}

function Alerts({ go, setPlot }) {
  const [f, setF] = useState('all')
  return (
    <>
      <div className="chips">
        {[['all', 'Todos'], ['d', 'Críticos'], ['w', 'Médios'], ['o', 'Oportunos']].map(([k, l]) => (
          <button key={k} className={'chip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>
        ))}
      </div>
      <div className="acgrid">
        {ALERTS.filter(a => f === 'all' || a.sev === f).map(a => (
          <AC key={a.id} sev={a.sev} ico={a.ico} t={a.t} badge={a.badge} time={a.time} d={<>{a.d} <strong>{a.a}</strong></>}>
            <button className={'btn btn-' + a.sev} onClick={() => speak(a.t + '. ' + a.a)}>🔊 Ouvir</button>
            <button className="btn btn-g" onClick={() => { setPlot(a.plot); go('map') }}>Ver no mapa</button>
          </AC>
        ))}
      </div>
      <p className="mut">Sem internet, o aviso chega por SMS ou WhatsApp.</p>
    </>
  )
}

function Market({ orders, setOrders, offers, setOffers, offline }) {
  const [view, setView] = useState('sell')
  const [cultura, setCultura] = useState('Alface')
  const [kg, setKg] = useState(40)
  const [preco, setPreco] = useState('3.50')
  const [lo, hi] = PRICES[cultura]
  const valor = parseFloat(preco) || 0
  const pick = c => { setCultura(c); setPreco(((PRICES[c][0] + PRICES[c][1]) / 2).toFixed(2)) }
  const publish = () => setOffers([{ id: Date.now(), cultura, kg, preco: valor, pending: offline }, ...offers])
  const reply = (id, st) => setOrders(orders.map(o => (o.id === id ? { ...o, st } : o)))
  return (
    <>
      <div className="chips">
        {[['sell', 'Vender'], ['orders', 'Pedidos']].map(([k, l]) => (
          <button key={k} className={'chip' + (view === k ? ' on' : '')} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>
      {view === 'sell' ? (
        <div className="mk">
          <div className="card pad">
            <label>O que você colheu?
              <select value={cultura} onChange={e => pick(e.target.value)}>{Object.keys(PRICES).map(c => <option key={c}>{c}</option>)}</select>
            </label>
            <p className="lbl">Quantidade (kg)</p>
            <div className="step">
              <button className="btn btn-g" aria-label="Diminuir" onClick={() => setKg(Math.max(5, kg - 5))}>−</button>
              <input readOnly value={kg} aria-label="Quantidade em kg" />
              <button className="btn btn-g" aria-label="Aumentar" onClick={() => setKg(kg + 5)}>+</button>
            </div>
            <p className="note">Preço de referência na região: {rs(lo)} a {rs(hi)} por kg.</p>
            <label>Seu preço (R$ por kg)
              <input type="number" step="0.1" min="0" value={preco} onChange={e => setPreco(e.target.value)} />
            </label>
            <p className="tot">Total estimado: {rs(kg * valor)}</p>
            <button className="btn btn-p full" onClick={publish}>Publicar oferta</button>
          </div>
          <div className="col">
            <div className="slbl">Minhas ofertas</div>
            {offers.length === 0 && <p className="mut">Você ainda não publicou nenhuma oferta.</p>}
            {offers.map(o => (
              <div key={o.id} className="calrt">
                <span><b className="cat">{o.kg} kg de {o.cultura}</b><span className="cac">{rs(o.preco)}/kg</span></span>
                <span className={'bd bd-' + (o.pending ? 'w' : 'o')} style={{ marginLeft: 'auto' }}>{o.pending ? 'Aguardando sinal' : 'Publicada'}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="acgrid">
          {orders.map(o => (
            <AC key={o.id} sev={ST[o.st]} ico={o.ico} t={o.quem} badge={o.st}
              d={`Pede ${o.kg} kg de ${o.prod.toLowerCase()}. Entrega amanhã às 8h. Total: ${rs(o.total)}.`}
              time={o.st === 'entregue' ? 'Pagamento recebido' : 'Pagamento na entrega'}>
              {o.st === 'novo' && <>
                <button className="btn btn-o" onClick={() => reply(o.id, 'aceito')}>Aceitar</button>
                <button className="btn btn-g" onClick={() => reply(o.id, 'recusado')}>Recusar</button>
              </>}
              {o.st === 'aceito' && <span className="mut">{offline ? 'O aviso ao comprador sai quando houver sinal.' : 'Comprador avisado por SMS.'}</span>}
            </AC>
          ))}
        </div>
      )}
    </>
  )
}

function Chat() {
  const [msgs, setMsgs] = useState([{ me: false, t: 'Oi, João! Pergunte sobre **irrigação**, **geada**, **pragas** ou **preços**.' }])
  const [q, setQ] = useState('')
  const send = text => {
    if (!text.trim()) return
    setMsgs(m => [...m, { me: true, t: text }])
    setQ('')
    setTimeout(() => setMsgs(m => [...m, { me: false, t: answer(text) }]), 500)
  }
  return (
    <div className="cgrid">
      <div className="col">
      <div className="aib"><i />IA com acesso ao Sentinel-2 · {P.prop}</div>
      <div className="card">
        <div className="chat">
          {msgs.map((m, i) => m.me ? (
            <div key={i} className="cu"><div className="bub">{m.t}</div></div>
          ) : (
            <div key={i} className="cai">
              <span className="aiav">IA</span>
              <div className="bub">{rich(m.t)}<button className="mini" aria-label="Ouvir resposta" onClick={() => speak(m.t.replaceAll('**', ''))}>🔊</button></div>
            </div>
          ))}
        </div>
        <div className="chips sug">{SUG.map(s => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}</div>
        <div className="chin">
          <input value={q} placeholder="Pergunte sobre sua lavoura..." aria-label="Sua pergunta" onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(q)} />
          <button className="send" aria-label="Enviar" onClick={() => send(q)}><Ic d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></button>
        </div>
      </div>
      <p className="mut">Respostas simuladas neste protótipo.</p>
      </div>
      <div className="card pnl">
        <div className="mpt">O que a IA sabe hoje</div>
        {[['NDVI médio', '0,62'], ['Alertas ativos', '3'], ['Menor umidade do solo', '22% (Talhão 5)'], ['Próxima irrigação', 'Hoje, 18h'], ['Geada prevista', 'Sexta, 4h · 2°'], ['Alface na região', 'R$ 3,20 a R$ 3,80/kg']].map(([l, v]) => (
          <div key={l} className="srow"><span className="mut">{l}</span><b>{v}</b></div>
        ))}
      </div>
    </div>
  )
}

function Reports() {
  const x = i => 30 + (i / 7) * 305
  const y = v => 10 + 124 - ((v - 0.3) / 0.75) * 124
  return (
    <>
      <div className="kpis">
        <K l="NDVI médio" v="0,62" h="↑ +5% vs anterior" c="up" />
        <K l="Água economizada" v="18,4 m³" h="vs irrigação manual" c="up" />
        <K l="Alertas resolvidos" v="11/13" h="85% de resolução" c="up" />
        <K l="Vendido no local" v="340 kg" h="pedidos concluídos" c="up" />
      </div>
      <div className="rgrid">
        <div className="card">
          <div className="ch"><span className="ct">Evolução NDVI · 8 semanas</span><span className="lg">{SERIES.map(s => <span key={s.n}><i style={{ background: s.c }} />{s.n}</span>)}</span></div>
          <svg className="chart" viewBox="0 0 345 160" width="100%" role="img" aria-label="Gráfico de NDVI por semana">
            {[0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(v => (
              <g key={v}><line className="gl" x1="30" x2="335" y1={y(v)} y2={y(v)} /><text className="ax" x="26" y={y(v) + 3} textAnchor="end">{v.toFixed(1)}</text></g>
            ))}
            {SERIES.map(s => (
              <g key={s.n}>
                <polyline points={s.d.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={s.c} strokeWidth="2" strokeLinejoin="round" />
                {s.d.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.c} />)}
              </g>
            ))}
            {WEEKS.map((w, i) => <text key={w} className="ax" x={x(i)} y="152" textAnchor="middle">{w}</text>)}
          </svg>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">Saúde por talhão</span></div>
          <table className="rtbl">
            <thead><tr><th>Talhão</th><th>NDVI</th><th>Status</th><th>Saúde</th></tr></thead>
            <tbody>
              {PLOTS.map(p => {
                const [s, sl] = status(p.ndvi)
                const pct = Math.round(p.ndvi * 100)
                return (
                  <tr key={p.id}>
                    <td><b>{p.id}</b> · {p.cultura} · {vir(p.ha)} ha</td>
                    <td style={{ color: `var(--${s})`, fontWeight: 700 }}>{br(p.ndvi)}</td>
                    <td><span className={'bd bd-' + s} style={{ marginLeft: 0 }}>{sl}</span></td>
                    <td><span className="pct" style={{ color: `var(--${s})` }}>{pct}%</span><span className="bar"><i style={{ width: pct + '%', background: `var(--${s})` }} /></span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Trend({ mode }) {
  const W = 345, H = 170, L = 28, T = 16, B = 26, hh = H - T - B
  const x = i => L + (i / 6) * (W - L - 12)
  const base = T + hh
  const y = v => base - (v / 28) * hh
  const yr = v => base - (v / 16) * hh
  const line = k => DAYS.map((d, i) => `${x(i)},${y(d[k])}`).join(' ')
  const temp = mode === 'temp'
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={temp ? 'Temperatura mínima e máxima da semana' : 'Chuva prevista na semana'}>
      {(temp ? [0, 10, 20] : [0, 5, 10, 15]).map(v => (
        <g key={v}><line className="gl" x1={L} x2={W - 12} y1={temp ? y(v) : yr(v)} y2={temp ? y(v) : yr(v)} /><text className="ax" x={L - 4} y={(temp ? y(v) : yr(v)) + 3} textAnchor="end">{v}{temp ? '°' : ''}</text></g>
      ))}
      {temp ? (
        <>
          <line className="fz" x1={L} x2={W - 12} y1={y(3)} y2={y(3)} />
          <text className="ax vr" x={W - 12} y={y(3) - 4} textAnchor="end">geada (3° ou menos)</text>
          <polyline points={line('max')} fill="none" stroke="#F9A825" strokeWidth="2" strokeLinejoin="round" />
          <polyline points={line('min')} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
          {DAYS.map((d, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(d.max)} r="3" fill="#F9A825" />
              <text className="vl" x={x(i)} y={y(d.max) - 7} textAnchor="middle">{d.max}°</text>
              <circle cx={x(i)} cy={y(d.min)} r={d.fr ? 4.5 : 3} fill={d.fr ? 'var(--d)' : '#3B82F6'} />
              <text className={'vl' + (d.fr ? ' vr' : '')} x={x(i)} y={y(d.min) + 14} textAnchor="middle">{d.min}°</text>
            </g>
          ))}
        </>
      ) : (
        DAYS.map((d, i) => (
          <g key={i}>
            <rect x={x(i) - 12} y={base - (d.mm / 16) * hh} width="24" height={(d.mm / 16) * hh} rx="3" fill="#1565C0" />
            <text className="vl" x={x(i)} y={base - (d.mm / 16) * hh - 5} textAnchor="middle">{d.mm} mm</text>
          </g>
        ))
      )}
      {DAYS.map((d, i) => <text key={d.d} className="ax" x={x(i)} y={H - 8} textAnchor="middle">{d.d}</text>)}
    </svg>
  )
}

function Weather({ go, offline }) {
  const [mode, setMode] = useState('temp')
  const now = HOURS[0]
  const say = `Agora faz ${now.t} graus. Atenção: geada na sexta, às 4 horas, com mínima de 2 graus. Segunda deve chover 14 milímetros.`
  return (
    <>
      <AC sev="w" ico="❄️" t="Geada prevista na sexta, às 4h" badge="Médio" time="Mínima de 2 °C no Talhão 3"
        d={<>A alface e outras culturas sensíveis estão em risco. <strong>Colha hoje a alface pronta e cubra o restante à tarde.</strong></>}>
        <button className="btn btn-w" onClick={() => speak(say)}>🔊 Ouvir</button>
        <button className="btn btn-g" onClick={() => go('alerts')}>Ver alertas</button>
      </AC>
      <div className="wgrid">
        <div className="wcol">
          <div className="card wx">
            <div className="wxt">
              <div>
                <div className="wxn">{now.t}°</div>
                <div className="wxc">{now.ico === '🌙' ? 'Noite de céu limpo' : 'Céu limpo'} · sensação de {now.t + 1}°</div>
                <div className="wxu">{offline ? 'Última previsão salva no aparelho (há 3 h)' : `Atualizado há 12 min · ${P.prop}`}</div>
              </div>
              <span className="wxi">{now.ico}</span>
            </div>
            <div className="wxm">
              {[['Umidade do ar', '58%'], ['Vento', '8 km/h SO'], ['Chuva 24h', '0 mm'], ['Orvalho', '12°']].map(([l, v]) => <div key={l}><span>{l}</span><b>{v}</b></div>)}
            </div>
            <button className="btn wxb" onClick={() => speak(say)}>🔊 Ouvir previsão</button>
          </div>
          <div className="kpis">
            <K l="Mínima da semana" v="2°" vc="dr" h="Sexta, às 4h" c="dr" />
            <K l="Máxima da semana" v="24°" h="Hoje" />
            <K l="Chuva prevista" v="21 mm" h="nos próximos 7 dias" />
            <K l="Vento máximo" v="18 km/h" h="Segunda" />
          </div>
          <div className="card">
            <div className="ch"><span className="ct">Próximas 24 horas</span><span className="cs">temperatura e chance de chuva</span></div>
            <div className="hrs">
              {HOURS.map((o, i) => (
                <div key={i} className={'hr' + (i === 0 ? ' now' : '')}>
                  <small>{o.h}</small><span>{o.ico}</span><b>{o.t}°</b>
                  <span className="rb"><span style={{ height: o.pp + '%' }} /></span><small>{o.pp}%</small>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="ch">
              <span className="ct">Tendência da semana</span>
              <div className="chips">
                {[['temp', 'Temperatura'], ['chuva', 'Chuva']].map(([k, l]) => <button key={k} className={'chip' + (mode === k ? ' on' : '')} onClick={() => setMode(k)}>{l}</button>)}
              </div>
            </div>
            <Trend mode={mode} />
            <div className="legend">
              {(mode === 'temp' ? [['#F9A825', 'Máxima'], ['#3B82F6', 'Mínima'], ['var(--d)', 'Risco de geada']] : [['#1565C0', 'Chuva prevista (mm)']]).map(([c, l]) => <span key={l}><i style={{ background: c }} />{l}</span>)}
            </div>
          </div>
        </div>
        <div className="wcol">
          <div className="card">
            <div className="ch"><span className="ct">Próximos 7 dias</span><span className="cs">mínima, máxima e chuva</span></div>
            <ul className="wk">
              {DAYS.map(d => (
                <li key={d.d} className={d.fr ? 'fr' : ''}>
                  <span><b>{d.d}</b><small>{d.txt}</small></span><span className="wi">{d.ico}</span>
                  <b className="mn">{d.min}°</b>
                  <span className="rg"><i style={{ left: (d.min / 28) * 100 + '%', width: ((d.max - d.min) / 28) * 100 + '%' }} /></span>
                  <b>{d.max}°</b><small className="pp">💧{d.pp}%</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="slbl">Para a sua lavoura</div>
          {TIPS.map(t => <AC key={t.t} sev={t.sev} ico={t.ico} t={t.t} badge={t.badge} d={t.d} time={t.time} />)}
        </div>
      </div>
    </>
  )
}

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function Settings({ cfg, set, act }) {
  return (
    <div className="sgrid">
      {SETS.map(([g, rows]) => (
        <div key={g} className="card">
          <div className="ch"><span className="ct">{g}</span></div>
          {rows.map(([k, l, t, x]) => (
            <div key={k} className="srow">
              <div><b>{l}</b>{t === 'sw' && x && <small>{x}</small>}</div>
              {t === 'sw' && <button className="swt" role="switch" aria-checked={cfg[k]} aria-label={l} onClick={() => set(k, !cfg[k])}><i className={cfg[k] ? 'on' : ''} /></button>}
              {t === 'seg' && <div className="segm">{x.map(([v, n]) => <button key={v} className={cfg[k] === v ? 'on' : ''} onClick={() => set(k, v)}>{n}</button>)}</div>}
              {t === 'btn' && <button className={'btn ' + x[0]} onClick={() => act(k)}>{x[1]}</button>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function Profile({ perfil, setPerfil, orders, act, onLogout, onDelete }) {
  const up = (k, v) => setPerfil({ ...perfil, [k]: v })
  const pct = Math.round((['nome', 'cel', 'email', 'cpf', 'prop', 'mun', 'foto'].filter(k => perfil[k]).length / 7) * 100)
  const photo = e => {
    const f = e.target.files[0]
    if (!f) return
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas'), s = Math.min(img.width, img.height)
      c.width = c.height = 160
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160)
      up('foto', c.toDataURL('image/jpeg', 0.8))
    }
    img.src = URL.createObjectURL(f)
  }
  const F = (k, l, ph, type = 'text') => <label>{l}<input type={type} value={perfil[k]} placeholder={ph} onChange={e => up(k, e.target.value)} /></label>
  return (
    <div className="pgrid">
      <div className="col">
        <div className="card pnl pid">
          <span className="av big"><AvIn p={perfil} /></span>
          <h2>{perfil.nome}</h2>
          <p className="mut">{perfil.tipo} · {perfil.prop}</p>
          <span className="bd bd-o" style={{ marginLeft: 0 }}>Conta verificada</span>
          <div className="prog"><span className="mut">Perfil {pct}% completo</span><div className="bar2"><i style={{ width: pct + '%' }} /></div></div>
          <div className="pbtns">
            <label className="btn btn-g fl">Trocar foto<input className="hid" type="file" accept="image/*" onChange={photo} /></label>
            {perfil.foto && <button className="btn btn-g" onClick={() => up('foto', '')}>Remover</button>}
          </div>
        </div>
        <div className="kpis">
          <K l="Vendas no mês" v="R$ 1.860" h="↑ 12% vs mês anterior" c="up" />
          <K l="Pedidos concluídos" v={23 + orders.filter(o => o.st === 'entregue').length} h="desde o cadastro" />
          <K l="Avaliação" v="4,8 ★" h="de 17 compradores" />
          <K l="Kg vendidos" v="340" h="no comércio local" />
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="ch"><span className="ct">Dados pessoais</span></div>
          <div className="pad fg">
            {F('nome', 'Nome completo', 'Seu nome')}
            {F('cel', 'Celular com DDD', '(00) 00000-0000', 'tel')}
            {F('email', 'E-mail', 'voce@email.com', 'email')}
            {F('cpf', 'CPF', '000.000.000-00')}
            {F('dap', 'DAP ou CAF (opcional)', 'Número do cadastro da agricultura familiar')}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">Propriedade</span><span className="cs">6 talhões · 9,2 ha</span></div>
          <div className="pad fg">
            {F('prop', 'Nome da propriedade', 'Ex.: Sítio Boa Esperança')}
            {F('mun', 'Município e UF', 'Ex.: Cidade, SC')}
            <label>Tipo de produtor
              <select value={perfil.tipo} onChange={e => up('tipo', e.target.value)}>{['Agricultor familiar', 'Pequeno produtor', 'Cooperativa'].map(t => <option key={t}>{t}</option>)}</select>
            </label>
            <div><p className="lbl">Cultivos</p><div className="chips">{[...new Set(PLOTS.map(q => q.cultura))].map(c => <span key={c} className="chip on">{c}</span>)}</div></div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ct">Preferências de venda</span></div>
          <div className="pad">
            <label>Raio de entrega: {perfil.raio} km
              <input type="range" min="1" max="50" value={perfil.raio} style={{ '--v': ((perfil.raio - 1) / 49) * 100 + '%' }} onChange={e => up('raio', +e.target.value)} />
            </label>
            <p className="lbl">Dias de entrega</p>
            <div className="chips">
              {DIAS.map(d => <button key={d} className={'chip' + (perfil.dias.includes(d) ? ' on' : '')} onClick={() => up('dias', perfil.dias.includes(d) ? perfil.dias.filter(x => x !== d) : [...perfil.dias, d])}>{d}</button>)}
            </div>
          </div>
        </div>
        <div className="card pad">
          <div className="row">
            <button className="btn btn-p" onClick={() => note('Perfil salvo ✓')}>Salvar alterações</button>
            <button className="btn btn-g" onClick={() => act('senha')}>Alterar senha</button>
            <button className="btn btn-g" onClick={onLogout}>Sair da conta</button>
            <button className="btn btn-d" onClick={onDelete}>Excluir minha conta</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- app ----------
export default function App() {
  const [tab, setTab] = useState('home')
  const [plot, setPlot] = useState(5)
  const [cfgRaw, setCfg] = useStore('az-cfg', DEF)
  const [perfilRaw, setPerfil] = useStore('az-perfil', DEFP)
  const [orders, setOrders] = useStore('az2-orders', ORDERS0)
  const [offers, setOffers] = useStore('az2-offers', [])
  const [logged, setLogged] = useStore('az-logged', true)
  const [toast, setToast] = useState('')
  const [more, setMore] = useState(false)
  const tm = useRef()
  const cfg = { ...DEF, ...cfgRaw }
  const perfil = { ...DEFP, ...perfilRaw }
  P.prop = perfil.prop || 'Minha propriedade'
  const set = (k, v) => setCfg({ ...cfg, [k]: v })
  const nAl = ALERTS.filter(a => a.sev !== 'o').length

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { document.documentElement.dataset.theme = cfg.tema === 'escuro' || (cfg.tema === 'auto' && mq.matches) ? 'dark' : 'light' }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [cfg.tema])
  useEffect(() => { document.documentElement.style.fontSize = { normal: '16px', grande: '18px', maior: '20px' }[cfg.fonte] }, [cfg.fonte])
  useEffect(() => { VOICE.on = cfg.voz; VOICE.rate = { lenta: 0.8, normal: 1, rapida: 1.25 }[cfg.vozVel] }, [cfg.voz, cfg.vozVel])
  useEffect(() => {
    const h = e => { setToast(e.detail); clearTimeout(tm.current); tm.current = setTimeout(() => setToast(''), 2800) }
    window.addEventListener('az-toast', h)
    return () => window.removeEventListener('az-toast', h)
  }, [])

  // ao voltar o sinal, sincroniza as ofertas pendentes
  useEffect(() => {
    if (cfg.offline || !offers.some(o => o.pending)) return
    const t = setTimeout(() => setOffers(os => os.map(o => ({ ...o, pending: false }))), 1200)
    return () => clearTimeout(t)
  }, [cfg.offline, offers])

  const act = k => {
    if (k === 'teste') return note('Alerta de teste enviado ✓ (simulação)')
    if (k === 'sync') return note(cfg.offline ? 'Sem internet. Sincronizamos quando o sinal voltar.' : 'Tudo sincronizado ✓')
    if (k === 'senha') return note('Link para redefinir a senha enviado (simulação).')
    if (k === 'exp') {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([JSON.stringify({ perfil, cfg, orders, offers }, null, 2)], { type: 'application/json' }))
      a.download = 'agrozero-meus-dados.json'
      a.click()
      return note('Dados exportados ✓')
    }
    if (k === 'limpar') {
      if (confirm('Apagar os pedidos e ofertas salvos neste aparelho?')) { setOrders(ORDERS0); setOffers([]); note('Dados salvos apagados.') }
      return
    }
    note('Disponível na versão final do app.')
  }
  const onDelete = () => {
    if (!confirm('Excluir sua conta e apagar todos os dados deste aparelho?')) return
    Object.keys(localStorage).filter(k => k.startsWith('az')).forEach(k => localStorage.removeItem(k))
    location.reload()
  }

  if (!logged) return (
    <div className="login">
      <div className="lbox">
        <img src="/logo.png" alt={APP} />
        <h1>Bem-vindo ao {APP}</h1>
        <p className="mut">Clima, satélite e venda local para o pequeno produtor.</p>
        <button className="btn btn-p full" onClick={() => setLogged(true)}>Entrar como {perfil.nome.split(' ')[0]}</button>
      </div>
    </div>
  )

  return (
    <div className="app">
      <aside className="sb">
        <div className="sbl"><img src="/logo.png" alt={APP} /></div>
        <nav>
          {NAV.map(([k, l, d]) => (
            <button key={k} className={'si' + (MORE.includes(k) ? ' xm' : '') + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>
              <Ic d={d} /><span>{l}</span>{k === 'alerts' && <b className="nb">{nAl}</b>}
            </button>
          ))}
          <button className={'si more' + ([...MORE, 'cfg', 'profile'].includes(tab) ? ' on' : '')} onClick={() => setMore(true)}>
            <Ic d="M5 12h.01M12 12h.01M19 12h.01" /><span>Mais</span><b className="nb">{nAl}</b>
          </button>
        </nav>
        <button className="sbf" onClick={() => setTab('profile')}>
          <span className="av"><AvIn p={perfil} /></span><span><b>{perfil.nome}</b><small>{perfil.tipo}</small></span>
        </button>
      </aside>
      <div className="main">
        <header className="top">
          <img className="tlogo" src="/logo.png" alt="" />
          <h1 className="ttl">{tab === 'home' ? APP : TITLES[tab]}</h1>
          <span className="loc">{P.prop} · 9,2 ha</span>
          <span className="live"><i className={cfg.offline ? 'off' : ''} />{cfg.offline ? 'Sem internet' : 'Satélite online'}</span>
          <button className="bell" aria-label="Alertas" onClick={() => setTab('alerts')}><Ic d={NAV[2][2]} /><i className="dot" /></button>
          <button className="bell" aria-label="Configurações" onClick={() => setTab('cfg')}><Ic d={GEAR} /></button>
          <button className="av" aria-label="Meu perfil" onClick={() => setTab('profile')}><AvIn p={perfil} /></button>
        </header>
        {cfg.offline && <div className="banner">Sem internet. Tudo fica salvo no aparelho e sincroniza depois. Os alertas chegam por SMS.</div>}
        <main className={'c t-' + tab}>
          {tab === 'home' && <Home go={setTab} orders={orders} offers={offers} />}
          {tab === 'map' && <MapView plot={plot} setPlot={setPlot} go={setTab} />}
          {tab === 'alerts' && <Alerts go={setTab} setPlot={setPlot} />}
          {tab === 'weather' && <Weather go={setTab} offline={cfg.offline} />}
          {tab === 'market' && <Market orders={orders} setOrders={setOrders} offers={offers} setOffers={setOffers} offline={cfg.offline} />}
          {tab === 'chat' && <Chat />}
          {tab === 'reports' && <Reports />}
          {tab === 'cfg' && <Settings cfg={cfg} set={set} act={act} />}
          {tab === 'profile' && <Profile perfil={perfil} setPerfil={setPerfil} orders={orders} act={act} onLogout={() => { setLogged(false); setTab('home') }} onDelete={onDelete} />}
        </main>
      </div>
      {more && (
        <div className="msheet" onClick={() => setMore(false)}>
          <div className="mpanel" onClick={e => e.stopPropagation()}>
            <div className="mgrid">
              {[...NAV.filter(n => MORE.includes(n[0])), ['profile', 'Meu perfil', USER], ['cfg', 'Configurações', GEAR]].map(([k, l, d]) => (
                <button key={k} className={'mi' + (tab === k ? ' on' : '')} onClick={() => { setTab(k); setMore(false) }}>
                  <span className="mic"><Ic d={d} />{k === 'alerts' && <b className="nb">{nAl}</b>}</span>{l === 'IA' ? 'Assistente IA' : l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={'toast' + (toast ? ' show' : '')} role="status">{toast}</div>
    </div>
  )
}