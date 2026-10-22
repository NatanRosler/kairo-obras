/**
 * Junta os dados do domínio com o motor de cálculo.
 * As telas chamam estas funções; elas nunca fazem conta sozinhas.
 */
import {
  calcularCronograma,
  calcularDuracao,
  criarCalendario,
  datasDoCronograma,
  desvioDaEtapa,
  precoDeVenda,
  resumirCustos,
  type Alocacao,
  type Calendario,
  type DataISO,
  type ResultadoDuracao,
  type ResumoCustos,
} from '@/engine'
import type { Etapa, ItemOrcamento, Lancamento, MedicaoProdutividade, Obra, Servico } from './tipos'

/** Média das medições do serviço; sem medições, vale a referência. */
export function produtividadeEfetiva(servico: Servico, medicoes: MedicaoProdutividade[]): number {
  const minhas = medicoes.filter((m) => m.servicoId === servico.id)
  if (minhas.length === 0) return servico.produtividadeReferenciaHh
  return minhas.reduce((total, m) => total + m.produtividadeHh, 0) / minhas.length
}

export function calendarioDaObra(obra: Obra): Calendario {
  return criarCalendario({ inicio: obra.inicio, diasParados: obra.diasParados })
}

export interface ContextoObra {
  obra: Obra
  etapas: Etapa[]
  servicos: Servico[]
  medicoes: MedicaoProdutividade[]
  /** Simulação: troca o número de pessoas de algumas etapas (id da etapa → pessoas). */
  pessoasSimuladas?: Record<string, number>
}

export interface LinhaCronograma {
  etapa: Etapa
  servico: Servico
  pessoas: number
  produtividadeHh: number
  duracao: ResultadoDuracao
  inicio: DataISO
  fim: DataISO
  folga: number
  critica: boolean
}

export interface CronogramaObra {
  duracaoTotal: number
  termino: DataISO | null
  linhas: LinhaCronograma[]
}

export function cronogramaDaObra(ctx: ContextoObra): CronogramaObra {
  const daObra = ctx.etapas.filter((e) => e.obraId === ctx.obra.id)
  const servicoPorId = new Map(ctx.servicos.map((s) => [s.id, s]))

  const detalhes = daObra.map((etapa) => {
    const servico = servicoPorId.get(etapa.servicoGuiaId)
    if (!servico) throw new Error(`Serviço "${etapa.servicoGuiaId}" da etapa "${etapa.nome}" não existe na base.`)
    const pessoas = ctx.pessoasSimuladas?.[etapa.id] ?? etapa.pessoas
    const produtividadeHh = produtividadeEfetiva(servico, ctx.medicoes)
    const duracao = calcularDuracao({
      quantidade: etapa.quantidade,
      produtividadeHh,
      equipe: pessoas,
      jornadaHoras: ctx.obra.jornadaHoras,
    })
    return { etapa, servico, pessoas, produtividadeHh, duracao }
  })

  const resultado = calcularCronograma(
    detalhes.map((d) => ({ id: d.etapa.id, duracao: d.duracao.dias, dependeDe: d.etapa.dependeDe })),
  )
  const datas = datasDoCronograma(resultado, calendarioDaObra(ctx.obra))
  const calcPorId = new Map(resultado.etapas.map((e) => [e.id, e]))
  const datasPorId = new Map(datas.etapas.map((e) => [e.id, e]))

  const linhas = detalhes
    .map((d) => {
      const calc = calcPorId.get(d.etapa.id)!
      const periodo = datasPorId.get(d.etapa.id)!
      return { ...d, inicio: periodo.inicio, fim: periodo.fim, folga: calc.folga, critica: calc.critica }
    })
    .sort((x, y) => x.inicio.localeCompare(y.inicio) || x.etapa.ordem - y.etapa.ordem)

  return { duracaoTotal: resultado.duracaoTotal, termino: datas.termino, linhas }
}

/** Alocações de equipe de uma obra, para a detecção de conflitos entre obras. */
export function alocacoesDaObra(obra: Obra, cronograma: CronogramaObra): Alocacao[] {
  return cronograma.linhas
    .filter((l) => l.etapa.avanco < 1)
    .map((l) => ({ equipeId: l.etapa.equipeId, obraId: obra.id, etapaId: l.etapa.id, inicio: l.inicio, fim: l.fim }))
}

export function custoDiretoDosItens(itens: ItemOrcamento[]): number {
  return itens.reduce((total, i) => total + i.quantidade * (i.materialUnitario + i.maoDeObraUnitario), 0)
}

export interface CustoEtapa {
  etapa: Etapa
  custoDireto: number
  orcado: number
  real: number
  /** Desvio sobre o que foi executado, em %. Null quando a etapa não começou. */
  desvio: number | null
}

export function custosDaObra(
  obra: Obra,
  etapas: Etapa[],
  itens: ItemOrcamento[],
  lancamentos: Lancamento[],
): { etapas: CustoEtapa[]; resumo: ResumoCustos; custoDireto: number; preco: number } {
  const daObra = etapas.filter((e) => e.obraId === obra.id)
  const linhas = daObra.map((etapa) => {
    const custoDireto = custoDiretoDosItens(itens.filter((i) => i.etapaId === etapa.id))
    const orcado = precoDeVenda(custoDireto, obra.bdiPercentual)
    const real = lancamentos.filter((l) => l.etapaId === etapa.id).reduce((t, l) => t + l.valor, 0)
    return { etapa, custoDireto, orcado, real, desvio: desvioDaEtapa({ orcado, avanco: etapa.avanco, real }) }
  })
  const custoDireto = linhas.reduce((t, l) => t + l.custoDireto, 0)
  return {
    etapas: linhas,
    resumo: resumirCustos(linhas.map((l) => ({ orcado: l.orcado, avanco: l.etapa.avanco, real: l.real }))),
    custoDireto,
    preco: precoDeVenda(custoDireto, obra.bdiPercentual),
  }
}
