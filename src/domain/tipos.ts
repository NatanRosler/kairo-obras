/**
 * Tipos do domínio. Espelham as tabelas do Supabase (supabase/migrations),
 * com nomes em camelCase no front e snake_case no banco.
 */
import type { DataISO } from '@/engine'

export type StatusObra = 'orcamento' | 'execucao' | 'concluida'

export interface Obra {
  id: string
  nome: string
  /** Ex.: "Casa térrea · 140 m²". */
  descricao: string
  inicio: DataISO
  status: StatusObra
  bdiPercentual: number
  jornadaHoras: number
  /** Dias em que a obra não trabalha além dos feriados nacionais (chuva, feriado municipal...). */
  diasParados: DataISO[]
}

export interface Equipe {
  id: string
  nome: string
  composicao: string
  pessoas: number
  custoDia: number
}

export type CategoriaServico =
  | 'Estrutura e fundação'
  | 'Alvenaria'
  | 'Cobertura'
  | 'Instalações'
  | 'Acabamento'

/** Serviço da base de preços e produtividade, compartilhada por todas as obras. */
export interface Servico {
  id: string
  codigo: string
  categoria: CategoriaServico
  descricao: string
  unidade: string
  materialUnitario: number
  maoDeObraUnitario: number
  /** Produtividade de referência (ex.: SINAPI), em Hh por unidade. */
  produtividadeReferenciaHh: number
}

/**
 * Produtividade medida numa obra real. Quando um serviço tem medições,
 * o cálculo usa a média delas no lugar da referência.
 */
export interface MedicaoProdutividade {
  id: string
  servicoId: string
  obraId: string
  data: DataISO
  produtividadeHh: number
}

export interface Etapa {
  id: string
  obraId: string
  ordem: number
  nome: string
  /** Serviço que define o prazo da etapa. */
  servicoGuiaId: string
  /** Quantidade do serviço que define o prazo. */
  quantidade: number
  equipeId: string
  /** Pessoas desta equipe trabalhando na etapa (usado no cálculo do prazo). */
  pessoas: number
  dependeDe: string[]
  /** Avanço físico, de 0 a 1. */
  avanco: number
}

export interface ItemOrcamento {
  id: string
  etapaId: string
  /** Numeração do orçamento, ex.: "5.1". */
  codigo: string
  descricao: string
  unidade: string
  quantidade: number
  materialUnitario: number
  maoDeObraUnitario: number
}

export type TipoLancamento = 'material' | 'mao_de_obra' | 'equipamento'

export interface Lancamento {
  id: string
  obraId: string
  etapaId: string
  data: DataISO
  descricao: string
  tipo: TipoLancamento
  valor: number
}

export interface ModeloBDI {
  id: string
  nome: string
  /** Percentuais sobre o custo direto. */
  indiretos: Record<string, number>
  /** Percentuais sobre o preço de venda. */
  sobrePreco: Record<string, number>
}
