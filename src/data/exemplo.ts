/**
 * Dados fictícios usados nas telas enquanto o Supabase não está conectado
 * (e na demonstração pública). São os mesmos números do protótipo aprovado.
 * O arquivo supabase/seed.sql carrega estes mesmos dados no banco.
 */
import type {
  Equipe,
  Etapa,
  ItemOrcamento,
  Lancamento,
  MedicaoProdutividade,
  ModeloBDI,
  Obra,
  Servico,
} from '@/domain/tipos'

export const HOJE = '2026-10-22'

export const obras: Obra[] = [
  { id: 'obra-a', nome: 'Residência Modelo A', descricao: 'Casa térrea · 140 m²', inicio: '2026-07-20', status: 'execucao', bdiPercentual: 21.5, jornadaHoras: 8, diasParados: [] },
  { id: 'obra-b', nome: 'Residência Modelo B', descricao: 'Sobrado · 210 m²', inicio: '2026-09-14', status: 'execucao', bdiPercentual: 22, jornadaHoras: 8, diasParados: [] },
  { id: 'obra-c', nome: 'Galpão Modelo C', descricao: 'Galpão · 600 m²', inicio: '2027-01-11', status: 'orcamento', bdiPercentual: 18.59, jornadaHoras: 8, diasParados: [] },
  { id: 'obra-d', nome: 'Reforma Modelo D', descricao: 'Reforma · 85 m²', inicio: '2026-03-03', status: 'concluida', bdiPercentual: 26.93, jornadaHoras: 8, diasParados: [] },
]

export const equipes: Equipe[] = [
  { id: 'ped', nome: 'Pedreiros', composicao: '1 encarregado + 3 pedreiros', pessoas: 4, custoDia: 1120 },
  { id: 'azu', nome: 'Azulejistas', composicao: '3 azulejistas', pessoas: 3, custoDia: 840 },
  { id: 'ele', nome: 'Eletricistas', composicao: '2 eletricistas', pessoas: 2, custoDia: 620 },
  { id: 'enc', nome: 'Encanadores', composicao: '2 encanadores', pessoas: 2, custoDia: 600 },
  { id: 'car', nome: 'Carpinteiros (telhado)', composicao: '1 encarregado + 2 carpinteiros', pessoas: 3, custoDia: 840 },
  { id: 'pin', nome: 'Pintores', composicao: '3 pintores', pessoas: 3, custoDia: 750 },
  { id: 'arm', nome: 'Armadores', composicao: '1 encarregado + 3 armadores', pessoas: 4, custoDia: 1180 },
]

const s = (
  id: string,
  categoria: Servico['categoria'],
  descricao: string,
  unidade: string,
  materialUnitario: number,
  maoDeObraUnitario: number,
  produtividadeReferenciaHh: number,
): Servico => ({ id, codigo: id, categoria, descricao, unidade, materialUnitario, maoDeObraUnitario, produtividadeReferenciaHh })

export const servicos: Servico[] = [
  s('INI-001', 'Estrutura e fundação', 'Limpeza e locação da obra', 'm²', 49.2, 32.8, 0.12),
  s('TER-001', 'Estrutura e fundação', 'Escavação de solo', 'm³', 91.33, 60.89, 1.6),
  s('FUN-001', 'Estrutura e fundação', 'Estaca pré-moldada de concreto', 'm', 104, 69.33, 0.9),
  s('EST-001', 'Estrutura e fundação', 'Concreto armado (forma + armação + concreto)', 'm³', 1690.71, 1127.14, 22),
  s('EST-002', 'Estrutura e fundação', 'Verga de concreto armado', 'm', 86.25, 65, 0.6),
  s('ALV-001', 'Alvenaria', 'Alvenaria de bloco de concreto esp. 15 cm', 'm²', 58, 32, 1.1),
  s('ALV-002', 'Alvenaria', 'Alvenaria de tijolos furados esp. 15 cm', 'm²', 42, 30, 1.1),
  s('COB-001', 'Cobertura', 'Estrutura de madeira + telha fibrocimento 6 mm', 'm²', 108, 72, 0.9),
  s('INS-001', 'Instalações', 'Ponto elétrico completo', 'pt', 153.47, 102.32, 1.5),
  s('INS-002', 'Instalações', 'Ponto hidráulico completo', 'pt', 344.21, 229.47, 3),
  s('IMP-001', 'Acabamento', 'Impermeabilização com manta 4 mm', 'm²', 79, 52.67, 0.8),
  s('ACA-001', 'Acabamento', 'Chapisco + reboco', 'm²', 26.53, 17.68, 0.82),
  s('ACA-002', 'Acabamento', 'Forro de PVC', 'm²', 42, 28, 0.6),
  s('ACA-003', 'Acabamento', 'Piso cerâmico 45×45', 'm²', 110, 73.33, 1),
  s('ACA-004', 'Acabamento', 'Pintura acrílica (2 demãos)', 'm²', 13.07, 8.71, 0.45),
  s('ESQ-001', 'Acabamento', 'Instalação de portas e janelas', 'pç', 835.38, 556.92, 3),
  s('LOU-001', 'Instalações', 'Instalação de louças e metais', 'pç', 420, 280, 2),
  s('LIM-001', 'Acabamento', 'Limpeza final da obra', 'm²', 13.71, 9.14, 0.2),
]

export const medicoes: MedicaoProdutividade[] = [
  { id: 'med-1', servicoId: 'ACA-001', obraId: 'obra-d', data: '2026-04-30', produtividadeHh: 0.78 },
  { id: 'med-2', servicoId: 'ACA-001', obraId: 'obra-a', data: '2026-10-20', produtividadeHh: 0.73 },
  { id: 'med-3', servicoId: 'ACA-004', obraId: 'obra-d', data: '2026-05-25', produtividadeHh: 0.4 },
]

type LinhaEtapa = [id: string, nome: string, servico: string, qtd: number, equipe: string, pessoas: number, dependeDe: string[], avanco: number]

const etapasDe = (obraId: string, linhas: LinhaEtapa[]): Etapa[] =>
  linhas.map(([id, nome, servicoGuiaId, quantidade, equipeId, pessoas, dependeDe, avanco], i) => ({
    id, obraId, ordem: i + 1, nome, servicoGuiaId, quantidade, equipeId, pessoas, dependeDe, avanco,
  }))

export const etapas: Etapa[] = [
  ...etapasDe('obra-a', [
    ['a01', 'Serviços iniciais', 'INI-001', 300, 'ped', 2, [], 1],
    ['a02', 'Movimento de terra', 'TER-001', 45, 'arm', 2, ['a01'], 1],
    ['a03', 'Fundação', 'FUN-001', 180, 'arm', 3, ['a02'], 1],
    ['a04', 'Estrutura em concreto', 'EST-001', 28, 'arm', 4, ['a03'], 1],
    ['a05', 'Paredes', 'ALV-001', 380, 'ped', 4, ['a04'], 1],
    ['a06', 'Cobertura', 'COB-001', 165, 'car', 3, ['a05'], 1],
    ['a07', 'Instalações elétricas', 'INS-001', 95, 'ele', 2, ['a05'], 1],
    ['a08', 'Hidráulica', 'INS-002', 38, 'enc', 2, ['a05'], 1],
    ['a09', 'Impermeabilização', 'IMP-001', 60, 'azu', 2, ['a04'], 1],
    ['a10', 'Revestimento de paredes', 'ACA-001', 760, 'ped', 4, ['a07', 'a08'], 0.5],
    ['a11', 'Forros', 'ACA-002', 140, 'car', 2, ['a06', 'a10'], 0],
    ['a12', 'Pisos', 'ACA-003', 150, 'azu', 3, ['a10', 'a09'], 0],
    ['a13', 'Esquadrias', 'ESQ-001', 26, 'car', 2, ['a12'], 0],
    ['a14', 'Louças e metais', 'LOU-001', 22, 'enc', 1, ['a12'], 0],
    ['a15', 'Pinturas', 'ACA-004', 900, 'pin', 3, ['a11', 'a13'], 0],
    ['a16', 'Limpeza da obra', 'LIM-001', 140, 'ped', 2, ['a15', 'a14'], 0],
  ]),
  ...etapasDe('obra-b', [
    ['b01', 'Fundação', 'FUN-001', 260, 'arm', 3, [], 1],
    ['b02', 'Estrutura em concreto', 'EST-001', 34, 'arm', 4, ['b01'], 0.75],
    ['b03', 'Paredes', 'ALV-001', 560, 'ped', 4, ['b02'], 0],
    ['b04', 'Cobertura', 'COB-001', 230, 'car', 3, ['b03'], 0],
    ['b05', 'Instalações elétricas', 'INS-001', 120, 'ele', 2, ['b03'], 0],
    ['b06', 'Hidráulica', 'INS-002', 52, 'enc', 2, ['b03'], 0],
  ]),
  ...etapasDe('obra-c', [
    ['c01', 'Fundação', 'FUN-001', 620, 'arm', 4, [], 0],
    ['c02', 'Estrutura em concreto', 'EST-001', 140, 'arm', 4, ['c01'], 0],
    ['c03', 'Cobertura', 'COB-001', 640, 'car', 3, ['c02'], 0],
  ]),
  ...etapasDe('obra-d', [
    ['d01', 'Paredes', 'ALV-002', 60, 'ped', 2, [], 1],
    ['d02', 'Revestimento de paredes', 'ACA-001', 200, 'ped', 2, ['d01'], 1],
    ['d03', 'Pinturas', 'ACA-004', 300, 'pin', 2, ['d02'], 1],
  ]),
]

/**
 * Itens do orçamento. A etapa "Paredes" da obra A tem os itens detalhados da planilha;
 * as demais etapas têm um item só, igual ao serviço que define o prazo.
 */
export const itens: ItemOrcamento[] = etapas.flatMap((etapa) => {
  if (etapa.id === 'a05') {
    return [
      { id: 'a05-1', etapaId: 'a05', codigo: '5.1', descricao: 'Alvenaria de bloco de concreto esp. 15 cm', unidade: 'm²', quantidade: 210, materialUnitario: 58, maoDeObraUnitario: 32 },
      { id: 'a05-2', etapaId: 'a05', codigo: '5.2', descricao: 'Alvenaria de tijolos furados esp. 15 cm', unidade: 'm²', quantidade: 170, materialUnitario: 42, maoDeObraUnitario: 30 },
      { id: 'a05-3', etapaId: 'a05', codigo: '5.3', descricao: 'Verga de concreto armado', unidade: 'm', quantidade: 48, materialUnitario: 86.25, maoDeObraUnitario: 65 },
    ]
  }
  const servico = servicos.find((x) => x.id === etapa.servicoGuiaId)!
  return [{
    id: `${etapa.id}-1`,
    etapaId: etapa.id,
    codigo: `${etapa.ordem}.1`,
    descricao: servico.descricao,
    unidade: servico.unidade,
    quantidade: etapa.quantidade,
    materialUnitario: servico.materialUnitario,
    maoDeObraUnitario: servico.maoDeObraUnitario,
  }]
})

type LinhaLancamento = [etapaId: string, data: string, descricao: string, tipo: Lancamento['tipo'], valor: number]

const lancamentosDe = (obraId: string, linhas: LinhaLancamento[]): Lancamento[] =>
  linhas.map(([etapaId, data, descricao, tipo, valor], i) => ({ id: `${obraId}-l${i + 1}`, obraId, etapaId, data, descricao, tipo, valor }))

export const lancamentos: Lancamento[] = [
  ...lancamentosDe('obra-a', [
    ['a01', '2026-07-22', 'Serviços iniciais — fechamento', 'mao_de_obra', 28700],
    ['a02', '2026-07-29', 'Escavação e bota-fora — fechamento', 'equipamento', 9450],
    ['a03', '2026-08-07', 'Estacas e cravação — fechamento', 'material', 41200],
    ['a04', '2026-09-04', 'Estrutura em concreto — fechamento', 'material', 99300],
    ['a09', '2026-09-10', 'Impermeabilização — fechamento', 'material', 9100],
    ['a05', '2026-09-25', 'Paredes — fechamento', 'material', 45900],
    ['a07', '2026-10-02', 'Instalações elétricas — medições anteriores', 'mao_de_obra', 24420],
    ['a06', '2026-10-06', 'Cobertura — fechamento', 'material', 37100],
    ['a08', '2026-10-07', 'Hidráulica — fechamento', 'material', 27950],
    ['a07', '2026-10-08', 'Fiação e quadros de distribuição', 'material', 4380],
    ['a10', '2026-10-09', 'Equipe de reboco — semana 1', 'mao_de_obra', 5900],
    ['a10', '2026-10-13', 'Telas e cantoneiras', 'material', 1980],
    ['a10', '2026-10-14', 'Chapisco — cimento e areia', 'material', 2140],
    ['a10', '2026-10-16', 'Equipe de reboco — semana 2', 'mao_de_obra', 5900],
    ['a10', '2026-10-21', 'Argamassa usinada — 12 m³', 'material', 6480],
  ]),
  ...lancamentosDe('obra-b', [
    ['b01', '2026-09-28', 'Fundação — fechamento', 'material', 52400],
    ['b02', '2026-10-16', 'Concreto e aço — parcial', 'material', 61200],
  ]),
  ...lancamentosDe('obra-d', [
    ['d01', '2026-03-13', 'Paredes — fechamento', 'material', 5600],
    ['d02', '2026-04-30', 'Revestimento — fechamento', 'material', 11200],
    ['d03', '2026-05-29', 'Pinturas — fechamento', 'material', 8300],
  ]),
]

export const modelosBDI: ModeloBDI[] = [
  {
    id: 'bdi-residencial',
    nome: 'Residencial padrão',
    indiretos: { 'Administração central': 3, 'Administração local': 0, 'Despesas indiretas': 0.4, 'Despesa financeira': 0.8, 'Pós-obra': 0.4, Risco: 0.8 },
    sobrePreco: { 'Impostos (PIS, COFINS, ISS)': 6.65, 'Margem de lucro': 6.1, Seguro: 0.5, 'Reserva técnica': 0 },
  },
  {
    id: 'bdi-galpao',
    nome: 'Galpão',
    indiretos: { 'Administração central': 2.5, 'Administração local': 0, 'Despesas indiretas': 0.3, 'Despesa financeira': 0.6, 'Pós-obra': 0.3, Risco: 0.6 },
    sobrePreco: { 'Impostos (PIS, COFINS, ISS)': 6.65, 'Margem de lucro': 5, Seguro: 0.4, 'Reserva técnica': 0 },
  },
  {
    id: 'bdi-reforma',
    nome: 'Reforma',
    indiretos: { 'Administração central': 4, 'Administração local': 0, 'Despesas indiretas': 0.6, 'Despesa financeira': 1, 'Pós-obra': 0.6, Risco: 1.5 },
    sobrePreco: { 'Impostos (PIS, COFINS, ISS)': 6.65, 'Margem de lucro': 8, Seguro: 0.5, 'Reserva técnica': 0 },
  },
]
