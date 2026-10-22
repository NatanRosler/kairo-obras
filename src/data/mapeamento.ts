/**
 * Conversão entre as linhas do banco (snake_case, numeric como string)
 * e os tipos do domínio (camelCase, number).
 */
import type {
  CategoriaServico,
  Equipe,
  Etapa,
  ItemOrcamento,
  Lancamento,
  MedicaoProdutividade,
  ModeloBDI,
  Obra,
  Servico,
  StatusObra,
  TipoLancamento,
} from '@/domain/tipos'

// O PostgREST devolve colunas numeric como string para não perder precisão.
const n = (v: unknown): number => (typeof v === 'number' ? v : Number(v))

export type Linha = Record<string, unknown>

export const obraDaLinha = (r: Linha): Obra => ({
  id: String(r.id),
  nome: String(r.nome),
  descricao: String(r.descricao ?? ''),
  inicio: String(r.inicio),
  status: r.status as StatusObra,
  bdiPercentual: n(r.bdi_percentual),
  jornadaHoras: n(r.jornada_horas),
  diasParados: (r.dias_parados as string[] | null) ?? [],
})

export const equipeDaLinha = (r: Linha): Equipe => ({
  id: String(r.id),
  nome: String(r.nome),
  composicao: String(r.composicao ?? ''),
  pessoas: n(r.pessoas),
  custoDia: n(r.custo_dia),
})

export const servicoDaLinha = (r: Linha): Servico => ({
  id: String(r.id),
  codigo: String(r.codigo),
  categoria: r.categoria as CategoriaServico,
  descricao: String(r.descricao),
  unidade: String(r.unidade),
  materialUnitario: n(r.material_unitario),
  maoDeObraUnitario: n(r.mao_de_obra_unitario),
  produtividadeReferenciaHh: n(r.produtividade_referencia_hh),
})

export const medicaoDaLinha = (r: Linha): MedicaoProdutividade => ({
  id: String(r.id),
  servicoId: String(r.servico_id),
  obraId: String(r.obra_id),
  data: String(r.data),
  produtividadeHh: n(r.produtividade_hh),
})

/** `dependencias` são as linhas de etapa_dependencias de todas as etapas. */
export const etapaDaLinha = (r: Linha, dependencias: Linha[]): Etapa => ({
  id: String(r.id),
  obraId: String(r.obra_id),
  ordem: n(r.ordem),
  nome: String(r.nome),
  servicoGuiaId: String(r.servico_guia_id),
  quantidade: n(r.quantidade),
  equipeId: String(r.equipe_id),
  pessoas: n(r.pessoas),
  avanco: n(r.avanco),
  dependeDe: dependencias.filter((d) => d.etapa_id === r.id).map((d) => String(d.depende_de_id)),
})

export const itemDaLinha = (r: Linha): ItemOrcamento => ({
  id: String(r.id),
  etapaId: String(r.etapa_id),
  codigo: String(r.codigo),
  descricao: String(r.descricao),
  unidade: String(r.unidade),
  quantidade: n(r.quantidade),
  materialUnitario: n(r.material_unitario),
  maoDeObraUnitario: n(r.mao_de_obra_unitario),
})

export const lancamentoDaLinha = (r: Linha): Lancamento => ({
  id: String(r.id),
  obraId: String(r.obra_id),
  etapaId: String(r.etapa_id),
  data: String(r.data),
  descricao: String(r.descricao),
  tipo: r.tipo as TipoLancamento,
  valor: n(r.valor),
})

export const modeloBDIDaLinha = (r: Linha): ModeloBDI => ({
  id: String(r.id),
  nome: String(r.nome),
  indiretos: (r.indiretos as Record<string, number>) ?? {},
  sobrePreco: (r.sobre_preco as Record<string, number>) ?? {},
})
