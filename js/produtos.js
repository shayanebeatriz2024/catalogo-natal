/* DATA LAYER — catálogo de produtos (escopo global, consumido por app.js) */
/** @typedef {{id:number, nome:string, categoria:string, preco:number, medidas:string, descricao:string, imagem?:string, galeria?:string[], cores?:{nome:string,hex:string}[], tipoEspecial?:string}} ProdutoRaw */
/** @type {ProdutoRaw[]} */
// Paleta de tonalidades dos ornamentos e esculturas com variação de cor
const CORES_ENFEITES = [
  { nome: 'Branco',         hex: '#FFFFFF' }, // branco puro e luminoso
  { nome: 'Prata',          hex: '#E5E8EC' }, // prateado acetinado claro (distinguível do branco)
  { nome: 'Creme',          hex: '#EFE5D5' }, // linho marfim suave
  { nome: 'Dourado',        hex: '#D4AF37' }, // ouro metálico nobre
  { nome: 'Vermelho',       hex: '#A82025' }, // vermelho Noel aveludado
  { nome: 'Verde Pinheiro', hex: '#1E4D34' }  // verde profundo clássico
];

const PRODUTOS_RAW = [
  // ---- Enfeites de Árvore (kits e pingentes de pendurar — primeiros da vitrine) ----
  { id: 29, nome: 'Kit 15 un Enfeites Biscoito Natalino', categoria: 'Enfeites de Árvore', preco: 69.90, medidas: 'Kit com 15 peças',
    descricao: 'Coleção temática estilo biscoito confeitado vermelho e branco com figuras clássicas natalinas.',
    imagem: './images/41_kit_enfeites_biscoito_15un_hd.jpeg',
    galeria: ['./images/41_kit_enfeites_biscoito_15un_hd.jpeg', './images/41_kit_enfeites_biscoito_variacao_azul.jpeg'] },
  { id: 28, nome: 'Kit 8 un Estrelas Vazadas de Árvore', categoria: 'Enfeites de Árvore', preco: 27.90, medidas: 'Diversos tamanhos',
    descricao: 'Pingentes de estrelas com detalhes vazados delicados para árvore de Natal e guirlandas.',
    imagem: './images/40_kit_estrelas_arvore_8un.jpeg',
    cores: CORES_ENFEITES },
  { id: 30, nome: 'Kit 6 un Enfeites de Árvore Laço Esculpido', categoria: 'Enfeites de Árvore', preco: 76.90, medidas: 'Kit com 6 unidades',
    descricao: 'Conjunto com 6 pingentes natalinos idênticos com laço escultural volumoso e acabamento aveludado fosco.',
    imagem: './images/42_enfeite_laco_natal.jpeg',
    galeria: ['./images/42_enfeite_laco_natal.jpeg', './images/42_kit_lacos_dourado_6un.jpeg', './images/42_kit_lacos_vermelho_6un.jpeg'],
    // Cor → foto da galeria exibida ao selecioná-la (cores sem foto própria voltam para a 1ª foto)
    fotoPorCor: { Dourado: './images/42_kit_lacos_dourado_6un.jpeg', Vermelho: './images/42_kit_lacos_vermelho_6un.jpeg' },
    cores: CORES_ENFEITES },
  { id: 14, nome: 'Flocos de Neve Cristais (Kit 24 un)', categoria: 'Enfeites de Árvore', preco: 99.90, medidas: '9 x 9 cm',
    descricao: '24 enfeites vazados com padrões variados.',
    imagem: './images/27_flocos_neve_kit24.jpg',
    cores: CORES_ENFEITES },
  { id: 15, nome: 'Enfeites Natalinos Geométricos (8 un)', categoria: 'Enfeites de Árvore', preco: 209.90, medidas: '6 x 6 cm',
    descricao: 'Bolas estruturadas em padrões colmeia e ondas.',
    imagem: './images/28_enfeites_modernos_kit8.jpg',
    cores: CORES_ENFEITES },
  { id: 27, nome: 'Conjunto 9 un Flocos de Neve', categoria: 'Enfeites de Árvore', preco: 29.90, medidas: 'Diversos tamanhos',
    descricao: 'Conjunto com 9 modelos exclusivos de flocos de neve texturizados para pendurar na árvore.',
    imagem: './images/39_kit_flocos_neve_9un_hd.jpeg',
    cores: CORES_ENFEITES },
  { id: 38, nome: 'Kit 5 un Sinos de Natal Vazados', categoria: 'Enfeites de Árvore', preco: 79.90, medidas: '8 cm cada',
    descricao: 'Coleção com 5 sinos ornamentais decorativos com diferentes tramas geométricas vazadas.',
    imagem: './images/52_kit_sinos_natal_5un.jpeg' },
  { id: 6, nome: 'Anjo de Natal em Oração (Rendado)', categoria: 'Enfeites de Árvore', preco: 15.90, medidas: '8 x 8 cm',
    descricao: 'Anjo em oração com vestido rendado vazado.',
    imagem: './images/15_anjo_natal_7cm.jpg',
    cores: CORES_ENFEITES },
  { id: 7, nome: 'Anjo de Natal Minimalista (Liso)', categoria: 'Enfeites de Árvore', preco: 10.90, medidas: '7 cm',
    descricao: 'Acabamento fosco liso e asas abertas.',
    imagem: './images/16_anjos_enfeite_8cm.jpg',
    cores: CORES_ENFEITES },

  // ---- Memórias & Celebração ----
  { id: 1, nome: 'Casal de Gnomos Natalinos', categoria: 'Memórias & Celebração', preco: 124.90, medidas: '15 cm',
    descricao: 'Gorrinhos entrelaçados em abraço afetuoso.',
    imagem: './images/01_casal_gnomos.jpg' },
  { id: 3, nome: 'O Grinch - Suporte de Parede', categoria: 'Memórias & Celebração', preco: 197.00, medidas: 'Suporte',
    descricao: 'Braço temático do Grinch segurando bola de Natal.',
    imagem: './images/43_braco_grinch_decorativo.jpeg' },
  { id: 4, nome: 'Boneco de Neve Escandinavo', categoria: 'Memórias & Celebração', preco: 55.90, medidas: '15 cm',
    descricao: 'Acabamento canelado com cartola e cachecol.',
    imagem: './images/boneco-neve-chapeu.jpeg' },

  // ---- Fé & Sagrada Família ----
  { id: 5, nome: 'Presépio Sagrada Família Estrelado', categoria: 'Fé & Sagrada Família', preco: 189.90, medidas: '19 x 19 cm',
    descricao: 'Cenário detalhado com estrela guia vazada.',
    imagem: './images/09_presepio_manjedoura.jpg',
    galeria: ['./images/09_presepio_manjedoura.jpg', './images/09_presepio_cenario_sala.jpeg', './images/09_presepio_luz_interna.jpeg'] },
  { id: 34, nome: 'Presépio Sagrada Família com Cabana', categoria: 'Fé & Sagrada Família', preco: 24.90, medidas: '12 x 12 cm',
    descricao: 'Cenário minimalista da Sagrada Família com estrela guia vazada e linhas suaves.',
    imagem: './images/48_presepio_cabana_12cm.jpeg' },

  // ---- Luz & Ambientes ----
  { id: 8, nome: 'Mini Árvore Luminar Vazada', categoria: 'Luz & Ambientes', preco: 42.00, medidas: '15 cm',
    descricao: 'Verde cintilante com pontos de luz estrelados.',
    imagem: './images/19_mini_arvore_vazada.jpg' },
  { id: 9, nome: 'Vila de Casas Iluminadas (5 un)', categoria: 'Luz & Ambientes', preco: 129.90, medidas: '10 a 13 cm',
    descricao: 'Conjunto com 5 casinhas e capela com luz suave.',
    imagem: './images/21_vila_casas_iluminadas.jpg',
    galeria: ['./images/21_vila_casas_iluminadas.jpg', './images/21_vila_casas_iluminadas_noite.jpeg', './images/21_casas_luz_ambiente.jpeg'] },
  { id: 25, nome: 'Lareira Natalina Iluminada', categoria: 'Luz & Ambientes', preco: 349.90, medidas: '20 x 20 cm',
    descricao: 'Cenário acolhedor com meias natalinas, vela de LED com chama cintilante e acabamento artesanal.',
    imagem: './images/37_lareira_natal.jpeg',
    galeria: ['./images/37_lareira_natal.jpeg', './images/37_lareira_natal_2.jpeg'] },

  // ---- Design & Tradição ----
  { id: 10, nome: 'Quebra-Nozes Canelado', categoria: 'Design & Tradição', preco: 59.90, medidas: '20 cm',
    descricao: 'Linhas caneladas modernas em verde e vermelho.',
    imagem: './images/22_quebra_nozes_canelado_cenario.jpeg',
    cores: CORES_ENFEITES },
  { id: 11, nome: 'Quebra-Nozes Texturizado', categoria: 'Design & Tradição', preco: 42.90, medidas: '20 cm',
    descricao: 'Acabamento aveludado fosco clássico.',
    imagem: './images/23_quebra_nozes_texturizado_cenario.jpeg',
    cores: CORES_ENFEITES },
  { id: 12, nome: 'Mini Pinheiro Contemporâneo', categoria: 'Design & Tradição', preco: 32.90, medidas: '15 cm',
    descricao: 'Camadas orgânicas com estrela no topo.',
    imagem: './images/24_pinheiro_minimalista.jpg' },
  { id: 13, nome: 'Calendário do Advento Interativo', categoria: 'Design & Tradição', preco: 169.90, medidas: '25 cm',
    descricao: 'Formato de lareira com 24 gavetinhas.',
    imagem: './images/26_calendario_advento.jpg',
    galeria: ['./images/26_calendario_advento.jpg', './images/26_calendario_advento_2.jpeg', './images/26_calendario_advento_3.jpeg', './images/26_calendario_advento_4.jpeg'] },
  { id: 24, nome: 'Roda Gigante Floco de Neve', categoria: 'Design & Tradição', preco: 297.90, medidas: '30 x 40 cm',
    descricao: 'Peça cenográfica imponente com cabines vermelhas e estrutura geométrica em floco de neve.',
    imagem: './images/36_roda_gigante_floco_neve.jpeg',
    galeria: ['./images/36_roda_gigante_floco_neve.jpeg', './images/36_roda_gigante_cenario_sala.jpeg', './images/36_roda_gigante_detalhe_cabines.jpeg'] },
  { id: 31, nome: 'Árvore de Natal Sensorial', categoria: 'Design & Tradição', preco: 24.90, medidas: '6 cm altura',
    descricao: 'Miniatura escultural com relevo espiral bicolor e estrela dourada no topo.',
    imagem: './images/45_arvore_sensorial.jpeg' },
  { id: 32, nome: 'Árvore de Natal em Ponto Tricô', categoria: 'Design & Tradição', preco: 16.90, medidas: '9 cm altura',
    descricao: 'Textura artesanal inspirada em tricô invernal com estrela acetinada.',
    imagem: './images/46_arvore_trico_cenario.jpeg' },
  { id: 35, nome: 'Dupla de Veados Esculturais (Kit 2 un)', categoria: 'Design & Tradição', preco: 69.90, medidas: '15 cm e 20 cm',
    descricao: 'Conjunto elegante com duas peças em proporções orgânicas e acabamento fosco aveludado.',
    imagem: './images/49_dupla_veados_decoracao.jpeg' },
  { id: 36, nome: 'Rena Majestade de Inverno', categoria: 'Design & Tradição', preco: 64.90, medidas: '25 cm altura',
    descricao: 'Escultura imponente com galhadura aberta para arranjos de centro de mesa e lareiras.',
    imagem: './images/50_rena_majestade_inverno.jpeg' },
  { id: 37, nome: 'Árvore de Natal Esferas (Espumantes)', categoria: 'Design & Tradição', preco: 24.90, medidas: '15 cm altura',
    descricao: 'Pinheiro moderno estruturado em esferas sobrepostas com textura suave ao toque.',
    imagem: './images/51_arvore_espumantes_15cm.jpeg' },
  { id: 39, nome: 'Rena Natalina Canelada', categoria: 'Design & Tradição', preco: 24.90, medidas: '13 cm altura',
    descricao: 'Design escultural de linhas caneladas com acabamento fosco moderno.',
    imagem: './images/53_rena_canelada_13cm.jpeg',
    cores: CORES_ENFEITES },
  { id: 40, nome: 'Quebra-Nozes Facetado Geométrico', categoria: 'Design & Tradição', preco: 49.90, medidas: '18 cm altura',
    descricao: 'Escultura moderna com planos facetados geométricos e presença marcante para aparadores e estantes.',
    imagem: './images/54_quebra_nozes_facetado_18cm.jpeg',
    cores: CORES_ENFEITES },
  { id: 42, nome: 'Árvore de Natal Japandi Canelada', categoria: 'Design & Tradição', preco: 34.90, medidas: '12,5 cm altura',
    descricao: 'Linhas caneladas contemporâneas inspiradas no minimalismo escandinavo e estética oriental.',
    imagem: './images/56_arvore_natal_japandi_12cm.jpeg',
    cores: CORES_ENFEITES },
  { id: 43, nome: 'Letreiro de Mesa Feliz Natal com Floco', categoria: 'Design & Tradição', preco: 29.90, medidas: '15 x 15 cm',
    descricao: 'Letreiro decorativo de mesa com tipografia elegante e floco de neve superior vazado para aparadores, estantes e ceia.',
    imagem: './images/57_letreiro_feliz_natal_floco.jpeg',
    cores: CORES_ENFEITES },

  // ---- Mesa Posta & Detalhes ----
  { id: 16, nome: 'Miniatura Rena Textura de Tricô', categoria: 'Mesa Posta & Detalhes', preco: 14.90, medidas: '7 cm',
    descricao: 'Miniatura colecionável com acabamento em tricô.',
    imagem: './images/29_rena_trico.jpg' },
  { id: 17, nome: 'Miniatura Papai Noel de Tricô', categoria: 'Mesa Posta & Detalhes', preco: 20.90, medidas: '8 cm',
    descricao: 'Noel compacto com textura artesanal.',
    imagem: './images/30_papai_noel_trico.jpg' },
  { id: 18, nome: 'Miniatura Boneco de Neve de Tricô', categoria: 'Mesa Posta & Detalhes', preco: 15.90, medidas: '8 cm',
    descricao: 'Gorro e cachecol em textura entrelaçada.',
    imagem: './images/31_boneco_neve_trico.jpg' },
  { id: 22, nome: 'Urso Polar de Tricô com Gorro', categoria: 'Mesa Posta & Detalhes', preco: 15.90, medidas: '7 cm',
    descricao: 'Urso polar compacto artesanal em textura de tricô com gorrinho natalino vermelho.',
    imagem: './images/32_urso_polar_trico.webp' },
  { id: 19, nome: 'Cortadores de Biscoito (Kit 7 un)', categoria: 'Mesa Posta & Detalhes', preco: 35.90, medidas: 'Kit 7 peças',
    descricao: 'Moldes anatômicos temáticos com estampador.',
    imagem: './images/33_cortadores_biscoito_7un.jpg' },
  { id: 23, nome: 'Tigela Decorativa Papai Noel', categoria: 'Mesa Posta & Detalhes', preco: 79.90, medidas: '17 x 17 x 6,5 cm',
    descricao: 'Tigela natalina temática com calça e botinhas do Noel para doces, petiscos e mesa posta.',
    imagem: './images/35_tigela_papai_noel.jpeg' },
  { id: 26, nome: 'Porta-Guardanapo Laço Clássico', categoria: 'Mesa Posta & Detalhes', preco: 69.90, medidas: '17 x 12 cm',
    descricao: 'Suporte de mesa elegante com laço texturizado marfim para recepcionar a ceia com sofisticação.',
    imagem: './images/38_porta_guardanapo_laco.jpeg' },
  { id: 33, nome: 'Saco de Doces do Noel (Porta-Mimos)', categoria: 'Mesa Posta & Detalhes', preco: 49.90, medidas: '12 cm larg x 8 cm altura',
    descricao: 'Recipiente temático aveludado com amarração de laço para doces, bombons e chaves.',
    imagem: './images/47_saco_doces_natal.jpeg' },
  { id: 41, nome: 'Kit 2 un Gnomos Esculturais Recipientes Multiuso', categoria: 'Mesa Posta & Detalhes', preco: 79.90, medidas: 'KIT COM 2 UNIDADES (20 CM)',
    descricao: 'Conjunto decorativo funcional com 2 gnomos de chapéus removíveis. Funcionam como potes secretos para bombons, mimos ou pequenos objetos de mesa.',
    imagem: './images/55_gnomo_recipiente_fechado.jpeg',
    galeria: ['./images/55_gnomo_recipiente_fechado.jpeg', './images/55_gnomo_recipiente_aberto.jpeg'] },

  // ---- Itens Especiais (orçamento sob medida, sem foto — ilustração SVG) ----
  { id: 20, nome: 'Sua Ideia Natalina Personalizada', categoria: 'Memórias & Celebração', preco: 0.00, medidas: 'Sob Medida',
    tipoEspecial: 'ideia',
    descricao: 'Pensou em alguma ideia natalina única? Fazemos o seu orçamento personalizado sob medida para transformar seu projeto em realidade!' },
  { id: 21, nome: 'Lembrancinhas de Fim de Ano', categoria: 'Design & Tradição', preco: 0.00, medidas: 'Corporativo & Mimos',
    tipoEspecial: 'lembrancinha',
    descricao: 'Quer presentear seus clientes e parceiros com um mimo exclusivo da sua marca? Vamos criar lembranças personalizadas que marcam presença!' }
];

/** @type {{id:number,nome:string,categoria:string,preco:number,medidas:string,descricao:string,imagem:string,imagemFallback:string}[]} */
const PRODUTOS = PRODUTOS_RAW.map(p => ({
  ...p,
  // %27 no apóstrofo: a URL vai dentro de aspas simples no onerror das <img>
  imagemFallback: `https://placehold.co/400x400/1B3B2B/FFFFFF?text=${encodeURIComponent(p.nome).replace(/'/g, '%27')}`
}));
