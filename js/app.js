/* ====================================================================
   APP — sacola, mimos, filtros, WhatsApp, neve e spotlight.
   Lê PRODUTOS (js/produtos.js); nunca guarda estado de produto fora dele.
   ==================================================================== */
const WHATSAPP = '5551980657364';


// Categorias e taglines (camada de apresentação — não faz parte do dado do produto)
// Ordem editorial das abas/seções; categorias fora da lista entram depois, na ordem do array
const ORDEM_CATEGORIAS = ['Enfeites de Árvore', 'Mesa Posta & Detalhes', 'Design & Tradição', 'Memórias & Celebração'];
const CATEGORIAS = [...new Set([...ORDEM_CATEGORIAS, ...PRODUTOS.map(p => p.categoria)])]
  .filter(c => PRODUTOS.some(p => p.categoria === c));
const LEMAS = {
  'Enfeites de Árvore': 'Kits exclusivos e pingentes autorais para transformar a sua árvore de Natal.',
  'Memórias & Celebração': 'Criações afetivas que eternizam momentos especiais ao lado de quem você ama.',
  'Fé & Sagrada Família': 'O verdadeiro sentido do Natal em destaque no seu lar.',
  'Luz & Ambientes': 'Pontos de luz para criar atmosfera em cada cantinho.',
  'Design & Tradição': 'Esculturas e ornamentos atemporais para transformar a atmosfera do seu lar.',
  'Mesa Posta & Detalhes': 'Peças delicadas e temáticas para encantar na ceia e presentear com carinho.'
};

/* ====================================================================
   STATE — sacola de pedidos
   ==================================================================== */
const sacola = {};

// Escapa texto antes de interpolar em HTML/atributos (defesa contra XSS se o catálogo vier de fonte externa)
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// Chave da sacola: "id" ou "id:Cor" quando a peça tem variação de cor
const chave = (id, cor) => cor ? `${id}:${cor}` : String(id);
const corDaChave = k => String(k).split(':')[1] || '';
const produtoPorId = id => PRODUTOS.find(p => p.id === Number(String(id).split(':')[0]));
// Cor escolhida no card de cada peça (padrão: primeira da lista)
const corEscolhida = {};
const corAtual = p => p.cores ? (corEscolhida[p.id] || p.cores[0].nome) : '';
// Arredonda em centavos para a soma de floats não ficar em 99,999… numa meta exata
const subtotal = () => Math.round(Object.entries(sacola).reduce((s, [id, q]) => s + produtoPorId(id).preco * q, 0) * 100) / 100;

// Esteira de mimos: 1 brinde (R$ 0,00) por vez, o da faixa mais alta atingida pelo subtotal
const MIMOS = [
  { id: 6,  nome: 'Anjo de Natal em Oração (Rendado)', meta: 100, rotulo: 'Mimo Secreto Nível 1' },
  { id: 22, nome: 'Urso Polar de Tricô com Gorro',     meta: 200, rotulo: 'Mimo Secreto Nível 2' },
  { id: 11, nome: 'Quebra-Nozes Texturizado',          meta: 300, rotulo: 'Super Mimo Secreto Nível 3' }
];
// Cor padrão do brinde: Branco (clássico) nas peças com variação de cor
const corDoBrinde = m => produtoPorId(m.id).cores ? 'Branco' : '';
const mimoAtual = (total = subtotal()) => MIMOS.filter(m => total >= m.meta).pop() || null;

/* ====================================================================
   PRESENTATION LAYER
   ==================================================================== */
function imagem(p, classes = 'absolute inset-0 h-full w-full object-cover') {
  return `<img src="${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy" decoding="async" class="${classes}"
    onerror="this.onerror=null; this.src='${esc(p.imagemFallback)}';">`;
}

// Ilustrações SVG inline para itens especiais (sem foto local)
const ILUSTRA_ESPECIAL = {
  // Caixa marfim aberta de onde nasce uma estrela dourada luminosa (a "ideia"), mesmo acabamento das lembrancinhas
  ideia: `<defs>
      <linearGradient id="id-ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3C77E"/><stop offset=".5" stop-color="#C5A059"/><stop offset="1" stop-color="#9E7B3A"/></linearGradient>
      <linearGradient id="id-marfim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#E4DBC8"/></linearGradient>
      <linearGradient id="id-vinho" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A12A2C"/><stop offset="1" stop-color="#6E1A1C"/></linearGradient>
      <radialGradient id="id-brilho" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E3C77E" stop-opacity=".55"/><stop offset=".6" stop-color="#C5A059" stop-opacity=".12"/><stop offset="1" stop-color="#C5A059" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="200" height="200" fill="#1B3B2B"/>
    <ellipse cx="100" cy="182" rx="80" ry="5" fill="#000" opacity=".28"/>
    <!-- Halo e raios de luz -->
    <circle cx="100" cy="84" r="62" fill="url(#id-brilho)"/>
    <g fill="#C5A059" opacity=".22">
      <path d="M100 84 92 30h16z"/><path d="M100 84l54-22-6 14z"/><path d="M100 84 46 62l6 14z"/>
      <path d="M100 84l46 34-14 4z"/><path d="M100 84 54 118l14 4z"/>
    </g>
    <!-- Estrela dourada -->
    <path d="M100 54l6.5 17.1 18.2.9-14.3 11.4 4.9 17.6L100 91l-15.3 10 4.9-17.6-14.3-11.4 18.2-.9z" fill="url(#id-ouro)" stroke="#C5A059" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 62l3.6 9.6-3.6 6.4-3.6-6.4z" fill="#fff" opacity=".35"/>
    <!-- Pó mágico subindo da caixa -->
    <g fill="#E3C77E"><circle cx="90" cy="112" r="1.8"/><circle cx="110" cy="106" r="1.4" opacity=".8"/><circle cx="98" cy="102" r="1.1" opacity=".7"/><circle cx="114" cy="116" r="1.6" opacity=".9"/><circle cx="84" cy="100" r="1.2" opacity=".6"/></g>
    <!-- Tampa inclinada apoiada ao lado -->
    <g transform="rotate(-22 46 140)">
      <rect x="18" y="134" width="56" height="12" rx="2.5" fill="#FAF6EE"/>
      <rect x="18" y="144" width="56" height="2" fill="#000" opacity=".12"/>
      <rect x="43" y="134" width="6" height="12" fill="url(#id-vinho)"/>
    </g>
    <!-- Caixa marfim aberta com fita bordô -->
    <path d="M62 126h76l-4 6H66z" fill="#C9BFA9"/>
    <rect x="62" y="130" width="76" height="51" rx="2" fill="url(#id-marfim)"/>
    <g fill="#D9CFB9" opacity=".7"><circle cx="72" cy="142" r=".9"/><circle cx="128" cy="140" r=".9"/><circle cx="76" cy="168" r=".9"/><circle cx="126" cy="170" r=".9"/><circle cx="118" cy="156" r=".9"/></g>
    <rect x="58" y="124" width="84" height="8" rx="2" fill="#FAF6EE"/>
    <rect x="58" y="130" width="84" height="2" fill="#000" opacity=".12"/>
    <rect x="95" y="124" width="10" height="57" fill="url(#id-vinho)"/>
    <path d="M100 150c-6-10-18-10-14-2 2 4 9 3 14 2zm0 0c6-10 18-10 14-2-2 4-9 3-14 2z" fill="url(#id-vinho)"/>
    <ellipse cx="100" cy="150" rx="4" ry="3.5" fill="#C5A059"/>
    <!-- Brilhos: estrelas douradas de 4 pontas -->
    <g fill="#C5A059">
      <path d="M40 66q0 7 7 7-7 0-7 7 0-7-7-7 7 0 7-7z"/>
      <path d="M162 70q0 9 9 9-9 0-9 9 0-9-9-9 9 0 9-9z"/>
      <path d="M150 112q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4z" opacity=".75"/>
      <path d="M30 104q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4z" opacity=".7"/>
      <path d="M176 136q0 5 5 5-5 0-5 5 0-5-5-5 5 0 5-5z" opacity=".8"/>
      <path d="M134 46q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4z" opacity=".85"/>
    </g>`,
  // Três presentes (verde · bordô · marfim) com fitas e laços dourados, só formas preenchidas
  lembrancinha: `<defs>
      <linearGradient id="lb-ouro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3C77E"/><stop offset=".5" stop-color="#C5A059"/><stop offset="1" stop-color="#9E7B3A"/></linearGradient>
      <linearGradient id="lb-vinho" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A12A2C"/><stop offset="1" stop-color="#6E1A1C"/></linearGradient>
      <linearGradient id="lb-verde" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2E5A43"/><stop offset="1" stop-color="#1E3D2D"/></linearGradient>
      <linearGradient id="lb-marfim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFDF8"/><stop offset="1" stop-color="#E9E1D0"/></linearGradient>
    </defs>
    <rect width="200" height="200" fill="#1B3B2B"/>
    <ellipse cx="100" cy="182" rx="88" ry="5" fill="#000" opacity=".28"/>
    <!-- Caixa lateral esquerda: verde aveludado -->
    <rect x="20" y="132" width="44" height="49" rx="2" fill="url(#lb-verde)"/>
    <rect x="16" y="123" width="52" height="12" rx="2.5" fill="#244835"/>
    <rect x="16" y="133" width="52" height="2" fill="#000" opacity=".18"/>
    <rect x="39" y="123" width="6" height="58" fill="url(#lb-ouro)"/>
    <path d="M42 123c-5-9-15-9-12-2 2 4 8 3 12 2zm0 0c5-9 15-9 12-2-2 4-8 3-12 2z" fill="url(#lb-ouro)"/>
    <circle cx="42" cy="122.5" r="2.6" fill="#E3C77E"/>
    <!-- Caixa lateral direita: marfim texturado -->
    <rect x="138" y="141" width="42" height="40" rx="2" fill="url(#lb-marfim)"/>
    <g fill="#D9CFB9" opacity=".7"><circle cx="146" cy="152" r=".9"/><circle cx="170" cy="150" r=".9"/><circle cx="150" cy="168" r=".9"/><circle cx="172" cy="172" r=".9"/><circle cx="145" cy="176" r=".9"/><circle cx="168" cy="161" r=".9"/></g>
    <rect x="134" y="132" width="50" height="11" rx="2.5" fill="#FAF6EE"/>
    <rect x="134" y="141" width="50" height="2" fill="#000" opacity=".12"/>
    <rect x="156" y="132" width="6" height="49" fill="url(#lb-ouro)"/>
    <path d="M159 132c-5-9-15-9-12-2 2 4 8 3 12 2zm0 0c5-9 15-9 12-2-2 4-8 3-12 2z" fill="url(#lb-ouro)"/>
    <circle cx="159" cy="131.5" r="2.6" fill="#E3C77E"/>
    <!-- Caixa central maior: bordô com fita e laço duplo -->
    <rect x="62" y="108" width="76" height="73" rx="2" fill="url(#lb-vinho)"/>
    <rect x="62" y="139" width="76" height="9" fill="url(#lb-ouro)"/>
    <rect x="95" y="108" width="10" height="73" fill="url(#lb-ouro)"/>
    <rect x="56" y="93" width="88" height="18" rx="3.5" fill="#8C2224"/>
    <rect x="56" y="93" width="88" height="4" rx="2" fill="#fff" opacity=".08"/>
    <rect x="56" y="108" width="88" height="3" fill="#000" opacity=".22"/>
    <rect x="95" y="93" width="10" height="18" fill="url(#lb-ouro)"/>
    <path d="M98 96 86 120l6-2.5 3 7.5 6-26z" fill="#B38F4A"/>
    <path d="M102 96l12 24-6-2.5-3 7.5-6-26z" fill="#B38F4A"/>
    <path d="M100 93C88 64 60 68 70 87c5 9 20 8 30 6z" fill="url(#lb-ouro)"/>
    <path d="M100 93C112 64 140 68 130 87c-5 9-20 8-30 6z" fill="url(#lb-ouro)"/>
    <path d="M97 91c-8-16-23-17-20-8 2 6 12 7 20 8z" fill="#9E7B3A" opacity=".55"/>
    <path d="M103 91c8-16 23-17 20-8-2 6-12 7-20 8z" fill="#9E7B3A" opacity=".55"/>
    <ellipse cx="100" cy="93" rx="7.5" ry="6.5" fill="#E3C77E"/>
    <ellipse cx="98" cy="91" rx="2.5" ry="1.6" fill="#fff" opacity=".45"/>
    <!-- Brilhos: estrelas douradas de 4 pontas -->
    <g fill="#C5A059">
      <path d="M38 62q0 8 8 8-8 0-8 8 0-8-8-8 8 0 8-8z"/>
      <path d="M160 64q0 10 10 10-10 0-10 10 0-10-10-10 10 0 10-10z"/>
      <path d="M146 40q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4z" opacity=".75"/>
      <path d="M26 98q0 4 4 4-4 0-4 4 0-4-4-4 4 0 4-4z" opacity=".7"/>
      <path d="M176 104q0 5 5 5-5 0-5 5 0-5-5-5 5 0 5-5z" opacity=".8"/>
      <path d="M120 48q0 5 5 5-5 0-5 5 0-5-5-5 5 0 5-5z" opacity=".85"/>
      <path d="M72 50q0 3 3 3-3 0-3 3 0-3-3-3 3 0 3-3z" opacity=".6"/>
    </g>`
};
const BADGE_ESPECIAL = {
  ideia: '✦ Orçamento Personalizado',
  lembrancinha: '✦ Corporativo & Mimos'
};

function ilustracaoEspecial(p) {
  return `<svg viewBox="0 0 200 200" class="absolute inset-0 h-full w-full" role="img" aria-label="${esc(p.nome)}">${ILUSTRA_ESPECIAL[p.tipoEspecial] || ''}</svg>`;
}

function seletorHTML(id, nome) {
  const q = sacola[id] || 0;
  if (!q) {
    return `<button type="button" data-add="${id}" class="btn-add no-print flex min-h-11 w-full sm:w-auto shrink-0 items-center justify-center rounded-none bg-pinheiro px-4 text-xs font-semibold uppercase tracking-[0.1em] text-papel hover:bg-vinho">
      Quero
    </button>`;
  }
  return `<div class="no-print flex shrink-0 items-center justify-between sm:justify-start gap-1 rounded-full border border-pinheiro/30 bg-creme">
    <button type="button" data-menos="${id}" class="flex h-11 w-11 items-center justify-center rounded-full text-pinheiro hover:bg-papel" aria-label="Diminuir ${esc(nome)}">−</button>
    <span class="w-5 text-center text-sm font-semibold num">${q}</span>
    <button type="button" data-add="${id}" class="flex h-11 w-11 items-center justify-center rounded-full text-pinheiro hover:bg-papel" aria-label="Aumentar ${esc(nome)}">+</button>
  </div>`;
}

// Modo escuro forçado do navegador (Chrome Auto Dark): escurece background-color claro (Branco, Prata,
// Creme) mas preserva imagens SVG claras; já os tons escuros ficam certos só como background-color.
// Por isso os tons claros ganham preenchimento em SVG e os demais seguem só com a cor de fundo.
const tomClaro = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.8;
};
const swatchImg = hex => tomClaro(hex)
  ? `url(data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><circle cx="13" cy="13" r="13" fill="${hex}"/></svg>`)})`
  : 'none';

// Swatches de cor: bolinhas clicáveis; a selecionada ganha anel dourado
function coresHTML(p) {
  const atual = corAtual(p);
  return `<div class="no-print mt-3">
      <p class="text-[11px] text-musgo">Cor: <span class="font-semibold text-pinheiro">${atual}</span></p>
      <div class="mt-1.5 flex flex-wrap gap-2" role="group" aria-label="Cores de ${esc(p.nome)}">
        ${p.cores.map(c => `<button type="button" data-cor="${p.id}" data-cor-nome="${c.nome}" title="${c.nome}" aria-label="Cor ${c.nome}" aria-pressed="${c.nome === atual}"
          class="swatch ${c.nome === atual ? 'ativa' : ''}" style="--swatch:${c.hex};--swatch-img:${swatchImg(c.hex)}"></button>`).join('')}
      </div>
    </div>`;
}

// Carrossel de fotos: trilho com scroll-snap (swipe nativo no mobile) + setas e pontos
function carrosselHTML(p, encaixe) {
  const n = p.galeria.length;
  const seta = (dir, d) => `<button type="button" data-carrossel="${dir}" aria-label="${dir > 0 ? 'Próxima' : 'Anterior'} foto de ${esc(p.nome)}"
    class="alvo-toque no-print absolute top-1/2 ${dir > 0 ? 'right-2' : 'left-2'} z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-papel/90 text-pinheiro shadow hover:bg-papel hover:text-vinho">
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
  return `<div class="carrossel-trilho no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto">
      ${p.galeria.map((src, i) => `<div class="relative h-full w-full shrink-0 snap-center">
        <img src="${esc(src)}" alt="${esc(p.nome)} — foto ${i + 1} de ${n}" loading="lazy" decoding="async" class="${encaixe}"
          onerror="this.onerror=null; this.src='${esc(p.imagemFallback)}';"></div>`).join('')}
    </div>
    ${seta(-1, 'M15 18l-6-6 6-6')}${seta(1, 'M9 6l6 6-6 6')}
    <div class="carrossel-pontos no-print pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
      ${p.galeria.map((_, i) => `<span class="h-1.5 w-1.5 rounded-full ${i ? 'bg-pinheiro/25' : 'bg-ouro'}"></span>`).join('')}
    </div>`;
}

function cardHTML(p) {
  const especial = !!p.tipoEspecial;
  // Moldura (proporção, altura, respiro e enquadramento) é igual para todas as peças: ver .card-media no CSS
  const encaixe = 'card-foto';
  const fundoMedia = especial ? 'bg-pinheiro' : 'bg-[#F4EFE6]';
  return `
    <article data-produto="${p.id}" class="card group flex h-full min-w-0 flex-col overflow-hidden rounded-none border border-[var(--linha)] bg-papel">
      <div class="card-media ${fundoMedia}">
        ${especial ? ilustracaoEspecial(p) : p.galeria ? carrosselHTML(p, encaixe) : imagem(p, encaixe)}
        ${especial ? `<span class="absolute left-3 top-3 rounded-full border border-ouro/70 bg-vinho px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-creme shadow">${BADGE_ESPECIAL[p.tipoEspecial] || ''}</span>` : ''}
      </div>
      <div class="flex flex-auto flex-col px-3 py-2 sm:p-5">
        <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-ouro">${p.medidas}</p>
        <h4 class="mt-1.5 break-words font-serif text-[1.2rem] sm:text-[1.45rem] font-bold leading-tight text-pinheiro">${p.nome}</h4>
        <p class="mt-2 text-[13px] leading-relaxed text-tinta">${p.descricao}</p>
        ${p.cores ? coresHTML(p) : ''}
        <!-- Rodapé fixo no fundo do card (mt-auto): divisor, preço e "Quero" nivelados em toda a grade -->
        <div class="mt-auto pt-5">
          <div class="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 border-t border-dashed border-[var(--linha)] pt-4">
            <div>
              <p class="font-serif text-[1.6rem] sm:text-[1.9rem] font-bold leading-none text-vinho num">${brl(p.preco)}</p>
              <!-- linha reservada em todos os cards para o rodapé ter a mesma altura -->
              <p class="mt-0.5 text-[11px] text-musgo ${especial ? '' : 'invisible'}"${especial ? '' : ' aria-hidden="true"'}>(Sob Consulta)</p>
            </div>
            ${seletorHTML(chave(p.id, corAtual(p)), p.nome)}
          </div>
        </div>
      </div>
    </article>`;
}

let filtro = 'todas', busca = '';

function renderFiltros() {
  const chips = [{ nome: 'todas', label: 'Todas' }].concat(CATEGORIAS.map(c => ({ nome: c, label: c })));
  document.getElementById('filtros').innerHTML = chips.map(c => {
    const ativo = c.nome === filtro;
    return `<button type="button" data-filtro="${c.nome}" aria-pressed="${ativo}" class="aba${ativo ? ' ativa' : ''}">${c.label}</button>`;
  }).join('');
}

function render() {
  const termo = norm(busca.trim());
  const visiveis = PRODUTOS.filter(p =>
    (filtro === 'todas' || p.categoria === filtro) &&
    (!termo || norm(`${p.nome} ${p.descricao} ${p.medidas} ${p.categoria}`).includes(termo)));

  const alvo = document.getElementById('catalogo');
  const total = visiveis.length;
  document.getElementById('contagem').textContent =
    total ? `${total} ${total > 1 ? 'peças' : 'peça'}${termo ? ` para “${busca.trim()}”` : ''}` : '';

  if (!total) {
    alvo.innerHTML = `<div class="rounded-none border border-dashed border-[var(--linha)] bg-papel px-6 py-14 text-center">
      <p class="font-serif text-2xl text-pinheiro">Nenhuma peça encontrada</p>
      <p class="mt-2 text-sm text-musgo">Tente outra palavra ou volte para todas as categorias.</p>
      <button type="button" id="limpar" class="mt-5 rounded-full bg-pinheiro px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-creme hover:bg-vinho">Ver todas as peças</button>
    </div>`;
    return;
  }

  // Guarda a foto em que cada carrossel está, para a re-renderização (cor, "Quero", +/−) não voltar à 1ª
  const posicoes = {};
  alvo.querySelectorAll('[data-produto] .carrossel-trilho').forEach(t => { posicoes[t.closest('[data-produto]').dataset.produto] = t.scrollLeft; });

  alvo.innerHTML = CATEGORIAS.filter(c => visiveis.some(p => p.categoria === c)).map(c => {
    const itens = visiveis.filter(p => p.categoria === c);
    return `<section class="secao-cat" aria-labelledby="cat-${norm(c).replace(/[^a-z0-9]+/g,'-')}">
      <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-[var(--linha)] pb-3">
        <div>
          <h3 id="cat-${norm(c).replace(/[^a-z0-9]+/g,'-')}" class="font-serif text-3xl sm:text-4xl font-semibold text-pinheiro">${c}</h3>
          <p class="mt-1 text-sm text-musgo">${LEMAS[c] || ''}</p>
        </div>
        <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ouro num">${itens.length} ${itens.length > 1 ? 'peças' : 'peça'}</span>
      </div>
      <div class="grade mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">${itens.map(cardHTML).join('')}</div>
    </section>`;
  }).join('');

  alvo.querySelectorAll('[data-produto] .carrossel-trilho').forEach(t => {
    const x = posicoes[t.closest('[data-produto]').dataset.produto];
    if (x) { t.scrollLeft = x; atualizarPontos(t); }
  });
}

// Peças com fotoPorCor: ao escolher a cor, o carrossel desliza até a foto dela (ou volta à 1ª foto)
function sincronizarFotoDaCor(id) {
  const p = produtoPorId(id);
  if (!p.galeria || !p.fotoPorCor) return;
  const trilho = document.querySelector(`[data-produto="${p.id}"] .carrossel-trilho`);
  if (!trilho) return;
  const i = Math.max(0, p.galeria.indexOf(p.fotoPorCor[corAtual(p)]));
  trilho.scrollTo({ left: i * trilho.clientWidth, behavior: 'smooth' });
  atualizarPontos(trilho, i);
}

const CTAS = ['cta-hero', 'cta-rodape', 'cta-gaveta'];

function mensagem() {
  const itens = Object.entries(sacola).filter(([,q]) => q > 0);
  if (!itens.length) return 'Olá! Vi o catálogo da Coleção Natal Afetivo & Encantado e gostaria de fazer um pedido.';
  const total = subtotal();
  const linhas = itens.map(([id, q]) => {
    const p = produtoPorId(id);
    const cor = corDaChave(id) ? ` - Cor: ${corDaChave(id)}` : '';
    const valor = p.preco === 0 ? 'Item sob orcamento personalizado' : `${brl(p.preco)} cada = ${brl(p.preco * q)}`;
    return `- ${q}x ${p.nome}${cor} (${valor})`;
  });
  const mimo = mimoAtual();
  if (mimo) linhas.push(`- 1x [BRINDE NATALINO] ${mimo.nome}${corDoBrinde(mimo) ? ` - Cor: ${corDoBrinde(mimo)}` : ''} (${brl(0)})`);
  const nome = (document.getElementById('cliente-nome')?.value || '').trim() || 'Não informado';
  const bairro = (document.getElementById('cliente-endereco')?.value || '').trim() || 'Não informado';
  const div = '----------------------------------';
  return [
    'PEDIDO - COLECAO NATAL AFETIVO',
    div,
    `Cliente: ${nome}`,
    `Regiao/Bairro: ${bairro}`,
    div,
    'Itens Escolhidos:',
    ...linhas,
    div,
    `Subtotal das Peças: ${brl(total)}`,
    ...(mimo ? [`Mimo conquistado: ${mimo.rotulo} (compras acima de ${brl(mimo.meta)})`] : []),
    'Forma de Pagamento: Pix ou Cartao',
    div,
    'Oiie Esses são os da itens minha escolha  e gostaria de combinar a entrega/retirada e o pagamento.  como podemos fazer ?'
  ].join('\n');
}

const urlWhatsApp = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem())}`;

function atualizar() {
  const url = urlWhatsApp();
  CTAS.forEach(id => document.getElementById(id).href = url);

  const itens = Object.entries(sacola).filter(([,q]) => q > 0);
  const qtd = itens.reduce((s,[,q]) => s + q, 0);
  const total = subtotal();
  const mimo = mimoAtual(total);

  document.getElementById('abrir-sacola').classList.toggle('hidden', qtd === 0);
  document.getElementById('abrir-sacola').setAttribute('aria-label', `Abrir sacola: ${qtd} ${qtd > 1 ? 'itens' : 'item'}, total ${brl(total)}`);
  document.body.classList.toggle('com-sacola', qtd > 0);
  document.getElementById('flutuante-badge').textContent = qtd;
  document.getElementById('flutuante-label').textContent = qtd ? `Finalizar Pedido (${qtd} ${qtd>1?'itens':'item'}) →` : 'Finalizar Pedido →';
  document.getElementById('flutuante-total').textContent = brl(total);
  document.getElementById('gaveta-total').textContent = brl(total);
  document.getElementById('cta-rodape-txt').textContent = qtd ? `Enviar pedido (${qtd} ${qtd>1?'itens':'item'}) no WhatsApp` : 'Fazer meu pedido no WhatsApp';

  document.getElementById('lista-sacola').innerHTML = progressoMimoHTML(total, mimo) + (itens.length ? itens.map(([id,q]) => {
    const p = produtoPorId(id);
    return `<li class="flex items-center gap-3 py-4">
      <div class="h-14 w-14 shrink-0 overflow-hidden rounded-none bg-creme relative">${p.tipoEspecial ? ilustracaoEspecial(p) : imagem(p)}</div>
      <div class="min-w-0 flex-1">
        <p class="font-serif text-lg leading-tight text-pinheiro">${p.nome}</p>
        <p class="text-xs text-musgo num">${corDaChave(id) ? `Cor: ${corDaChave(id)} · ` : ''}${brl(p.preco)} cada</p>
      </div>
      <div class="flex items-center gap-1 rounded-full border border-[var(--linha)]">
        <button type="button" data-menos="${id}" class="flex h-11 w-11 items-center justify-center rounded-full text-pinheiro hover:bg-creme" aria-label="Diminuir ${esc(p.nome)}">−</button>
        <span class="w-5 text-center text-sm font-semibold num">${q}</span>
        <button type="button" data-add="${id}" class="flex h-11 w-11 items-center justify-center rounded-full text-pinheiro hover:bg-creme" aria-label="Aumentar ${esc(p.nome)}">+</button>
      </div>
    </li>`;
  }).join('') + (mimo ? `<li class="flex items-center gap-3 py-4">
      <div class="h-14 w-14 shrink-0 overflow-hidden rounded-none bg-creme relative">${imagem(produtoPorId(mimo.id))}</div>
      <div class="min-w-0 flex-1">
        <p class="text-[10px] font-semibold uppercase tracking-[0.15em] text-ouro">[Brinde Natalino]</p>
        <p class="font-serif text-lg leading-tight text-pinheiro">${mimo.nome}</p>
        <p class="text-xs text-musgo num">${corDoBrinde(mimo) ? `Cor: ${corDoBrinde(mimo)} · ` : ''}${brl(0)}</p>
      </div>
    </li>` : '')
    : `<li class="py-10 text-center text-sm text-musgo">Sua sacola está vazia. Toque em “Quero” nas peças que deseja.</li>`);
}

// Card de progresso da esteira de mimos (topo da sacola)
function progressoMimoHTML(total, mimo) {
  const prox = MIMOS.find(m => total < m.meta);
  const falta = prox ? brl(prox.meta - total) : '';
  const texto = !mimo ? `🎁 Faltam <strong class="num">${falta}</strong> para revelar e ganhar o seu Mimo Secreto de Natal!`
    : mimo.meta === 100 ? `🎉 Você ganhou o Anjo Rendado! Faltam <strong class="num">${falta}</strong> para subir para o Mimo Nível 2!`
    : mimo.meta === 200 ? `🎉 Mimo Nível 2 desbloqueado! Faltam <strong class="num">${falta}</strong> para o Super Mimo Nível 3!`
    : '🏆 Incrível! Você desbloqueou o Super Mimo Máximo de Natal!';
  const pct = prox ? Math.min(100, (total / prox.meta) * 100) : 100;
  return `<li class="py-4">
    <div class="border border-ouro/50 bg-creme px-4 py-3">
      <p class="text-xs leading-relaxed text-pinheiro">${texto}</p>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-papel" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}">
        <div class="h-full rounded-full bg-gradient-to-r from-ouro to-vinho transition-[width] duration-500" style="width:${pct}%"></div>
      </div>
    </div>
  </li>`;
}

let tId;
function toast(t) {
  const el = document.getElementById('toast'); el.textContent = t;
  el.style.opacity = '1'; el.style.transform = 'translate(-50%,0)';
  clearTimeout(tId); tId = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translate(-50%,-12px)'; }, 1800);
}

let focoAntes = null;
function gaveta(abrir) {
  const g = document.getElementById('gaveta');
  if (abrir === !g.classList.contains('fechada')) return;
  g.classList.toggle('fechada', !abrir);
  g.inert = !abrir;
  document.getElementById('veu').classList.toggle('hidden', !abrir);
  document.documentElement.classList.toggle('sem-rolagem', abrir);
  if (abrir) { focoAntes = document.activeElement; document.getElementById('fechar-sacola').focus(); }
  else focoAntes?.focus?.();
}
document.getElementById('gaveta').inert = true;

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]'), menos = e.target.closest('[data-menos]');
  if (add) {
    const id = add.dataset.add; sacola[id] = (sacola[id] || 0) + 1; atualizar(); render();
    const badge = document.getElementById('flutuante-badge');
    badge.classList.remove('pulo'); void badge.offsetWidth; badge.classList.add('pulo');
    if (!add.closest('#gaveta')) toast(`${produtoPorId(id).nome.split(' ').slice(0,4).join(' ')}${corDaChave(id) ? ` (${corDaChave(id)})` : ''} na sacola`);
  }
  const sw = e.target.closest('[data-cor]');
  if (sw) { corEscolhida[sw.dataset.cor] = sw.dataset.corNome; render(); sincronizarFotoDaCor(sw.dataset.cor); }
  if (menos) {
    const id = menos.dataset.menos;
    sacola[id] = Math.max(0, (sacola[id] || 0) - 1);
    if (!sacola[id]) delete sacola[id];
    atualizar(); render();
  }
});
document.getElementById('abrir-sacola').onclick = () => gaveta(true);
document.getElementById('fechar-sacola').onclick = () => gaveta(false);
document.getElementById('veu').onclick = () => gaveta(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { gaveta(false); modalMimos(false); } });

/* ---------- Caixas misteriosas (conteúdo surpresa, sem revelação no pop-up) ---------- */
const modal = document.getElementById('modal-mimos');

const caixaHTML = m => `<div class="flex flex-col items-center border border-[var(--linha)] bg-creme p-4">
    <svg viewBox="0 0 64 64" class="mb-3 h-20 w-20" aria-hidden="true">
      <rect x="8" y="26" width="48" height="32" fill="#8C2224"/>
      <rect x="4" y="17" width="56" height="11" fill="#A12A2C"/>
      <rect x="29" y="17" width="6" height="41" fill="#C5A059"/>
      <path d="M32 17c-5-11-17-10-13-3 2 3 8 3 13 3zm0 0c5-11 17-10 13-3-2 3-8 3-13 3z" fill="none" stroke="#C5A059" stroke-width="3"/>
      <text x="20" y="49" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="700" fill="#C5A059">?</text>
      <text x="44" y="49" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-weight="700" fill="#C5A059">?</text>
    </svg>
    <p class="font-serif text-lg font-semibold leading-tight text-pinheiro">${m.rotulo}</p>
    <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-ouro">Desbloqueia acima de <span class="num">R$ ${m.meta}</span></p>
  </div>`;

function modalMimos(abrir) {
  if (abrir) {
    document.getElementById('caixas-mimos').innerHTML = MIMOS.map(caixaHTML).join('');
    modal.classList.replace('hidden', 'flex');
    document.documentElement.classList.add('sem-rolagem');
    void modal.offsetWidth; // força reflow para a transição de opacidade rodar
    modal.classList.remove('opacity-0');
  } else if (!modal.classList.contains('hidden')) {
    modal.classList.add('opacity-0');
    document.documentElement.classList.remove('sem-rolagem');
    setTimeout(() => modal.classList.replace('flex', 'hidden'), 300);
  }
}

modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('#fechar-mimos')) return modalMimos(false);
  if (e.target.closest('#ativar-mimos')) {
    try { sessionStorage.setItem('mimos_ativados', '1'); } catch {}
    modalMimos(false);
    toast('🎁 Mimos ativados! Monte sua sacola para desbloquear.');
  }
});

let mimosAtivados = false;
try { mimosAtivados = !!sessionStorage.getItem('mimos_ativados'); } catch {}
if (!mimosAtivados) setTimeout(() => modalMimos(true), 3000);

// Neve SVG: mesma camada no hero e no rodapé (todo elemento .neve)
// Cristal de neve: 6 braços com ramificações, traço em currentColor (#FFFDF8)
const FLOCO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
  + '<path d="M12 2v20M3.34 7l17.32 10M3.34 17l17.32-10"/>'
  + '<path d="M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5M3.6 10.2l3.4-.9-.9-3.4M20.4 13.8l-3.4.9.9 3.4M6.1 17.1l.9-3.4-3.4-.9M17.9 6.9l-.9 3.4 3.4.9"/>'
  + '</svg>';
document.querySelectorAll('.neve').forEach(neve => {
  neve.innerHTML = '';
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    const t = 14 + Math.random() * 12; // tamanho entre 14px e 26px
    s.className = 'floco';
    s.innerHTML = FLOCO;
    s.style.cssText = `
      left:${Math.random() * 100}%;
      width:${t}px;
      height:${t}px;
      animation-duration:${8 + Math.random() * 8}s;
      animation-delay:-${Math.random() * 16}s;
      --op:${(0.75 + Math.random() * 0.2).toFixed(2)};
    `;
    neve.appendChild(s);
  }
  // Mantém a distância da queda igual à altura real da seção (muda com a tela)
  const ajustarQueda = () => neve.style.setProperty('--queda', `${neve.offsetHeight}px`);
  new ResizeObserver(ajustarQueda).observe(neve);
  ajustarQueda();
});

// Spotlight global: segue o cursor na viewport, atualiza --mx/--my no máximo 1x por frame
const luz = document.getElementById('luz-cursor');
if (luz) {
  let pendente = false, mx = 0, my = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(() => {
      luz.style.setProperty('--mx', `${mx}px`);
      luz.style.setProperty('--my', `${my}px`);
      luz.classList.add('ativa');
      pendente = false;
    });
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => luz.classList.remove('ativa'));
}

document.getElementById('fone-print').textContent = WHATSAPP.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
document.addEventListener('click', e => {
  const chip = e.target.closest('[data-filtro]');
  if (chip) {
    filtro = chip.dataset.filtro;
    // Alterna só a classe (sem recriar os botões) para a transição do fio dourado rodar
    document.querySelectorAll('#filtros .aba').forEach(b => {
      const ativo = b === chip;
      b.classList.toggle('ativa', ativo); b.setAttribute('aria-pressed', ativo);
    });
    render();
  }
  if (e.target.closest('#limpar')) { filtro = 'todas'; busca = ''; document.getElementById('busca').value = ''; renderFiltros(); render(); }
});
document.getElementById('busca').addEventListener('input', e => { busca = e.target.value; render(); });
document.getElementById('cliente-nome').addEventListener('input', atualizar);
document.getElementById('cliente-endereco').addEventListener('input', atualizar);

// Carrossel: setas avançam uma foto (com volta ao início/fim); pontos seguem o scroll
document.addEventListener('click', e => {
  const seta = e.target.closest('[data-carrossel]');
  if (!seta) return;
  const trilho = seta.parentElement.querySelector('.carrossel-trilho');
  const w = trilho.clientWidth, max = trilho.scrollWidth - w;
  let alvo = trilho.scrollLeft + Number(seta.dataset.carrossel) * w;
  if (alvo > max + 1) alvo = 0; else if (alvo < -1) alvo = max;
  trilho.scrollTo({ left: alvo, behavior: 'smooth' });
  atualizarPontos(trilho, Math.round(alvo / w));
});
function atualizarPontos(trilho, i = Math.round(trilho.scrollLeft / trilho.clientWidth)) {
  trilho.parentElement.querySelectorAll('.carrossel-pontos span').forEach((s, j) => {
    s.classList.toggle('bg-ouro', j === i); s.classList.toggle('bg-pinheiro/25', j !== i);
  });
}
document.addEventListener('scroll', e => {
  if (e.target.classList?.contains('carrossel-trilho')) atualizarPontos(e.target);
}, true);

renderFiltros(); render(); atualizar();
