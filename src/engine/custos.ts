/**
 * Orçado × real, pela técnica de Valor Agregado (Earned Value).
 *
 * Comparar o gasto real com o orçamento total engana: no meio da obra o real sempre é
 * menor. O justo é comparar com o **valor agregado**, que é quanto deveria ter custado
 * o que já foi executado (orçado da etapa × percentual concluído).
 */

export interface EtapaCusto {
  /** Valor orçado da etapa (com BDI). */
  orcado: number
  /** Avanço físico, de 0 a 1. */
  avanco: number
  /** Gasto real lançado até agora. */
  real: number
}

export interface ResumoCustos {
  orcadoTotal: number
  /** Orçado do que já foi feito. */
  valorAgregado: number
  real: number
  /** real − valor agregado (positivo = gastou mais do que devia). */
  desvio: number
  /** desvio ÷ valor agregado, em percentual. */
  desvioPercentual: number
  /** Avanço físico da obra inteira, de 0 a 1, ponderado pelo orçado. */
  avancoFisico: number
  /** Custo final estimado se o ritmo de gasto continuar igual (orçado ÷ índice de desempenho). */
  projecaoFinal: number
}

export function resumirCustos(etapas: EtapaCusto[]): ResumoCustos {
  let orcadoTotal = 0
  let valorAgregado = 0
  let real = 0
  for (const e of etapas) {
    if (e.avanco < 0 || e.avanco > 1) throw new Error(`Avanço deve ficar entre 0 e 1 (recebido ${e.avanco}).`)
    orcadoTotal += e.orcado
    valorAgregado += e.orcado * e.avanco
    real += e.real
  }
  const desvio = real - valorAgregado
  const indiceDesempenho = real > 0 ? valorAgregado / real : 1
  return {
    orcadoTotal,
    valorAgregado,
    real,
    desvio,
    desvioPercentual: valorAgregado > 0 ? (desvio / valorAgregado) * 100 : 0,
    avancoFisico: orcadoTotal > 0 ? valorAgregado / orcadoTotal : 0,
    projecaoFinal: indiceDesempenho > 0 ? orcadoTotal / indiceDesempenho : orcadoTotal,
  }
}

/** Desvio de uma etapa sobre o que foi executado dela, em percentual. */
export function desvioDaEtapa(etapa: EtapaCusto): number | null {
  const agregado = etapa.orcado * etapa.avanco
  if (agregado === 0) return null
  return (etapa.real / agregado - 1) * 100
}
