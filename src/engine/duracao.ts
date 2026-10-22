/**
 * Duração de um serviço a partir da quantidade, da produtividade e do tamanho da equipe.
 *
 *   horas de trabalho = quantidade × produtividade (Hh por unidade)
 *   duração (dias)    = horas ÷ (pessoas × jornada diária)
 *
 * O resultado é arredondado para cima: meio dia de trabalho ainda ocupa o dia.
 */

export interface EntradaDuracao {
  /** Quantidade do serviço (ex.: 380 m²). */
  quantidade: number
  /** Homem-hora por unidade (ex.: 1,10 Hh/m²). */
  produtividadeHh: number
  /** Número de pessoas na equipe. */
  equipe: number
  /** Horas trabalhadas por dia. Padrão: 8. */
  jornadaHoras?: number
}

export interface ResultadoDuracao {
  horasDeTrabalho: number
  diasExatos: number
  dias: number
}

export function calcularDuracao(entrada: EntradaDuracao): ResultadoDuracao {
  const jornada = entrada.jornadaHoras ?? 8
  if (!(entrada.quantidade >= 0)) throw new Error('A quantidade não pode ser negativa.')
  if (!(entrada.produtividadeHh >= 0)) throw new Error('A produtividade não pode ser negativa.')
  if (!Number.isInteger(entrada.equipe) || entrada.equipe < 1) {
    throw new Error('A equipe precisa ter pelo menos 1 pessoa (número inteiro).')
  }
  if (!(jornada > 0 && jornada <= 24)) throw new Error('A jornada deve ficar entre 0 e 24 horas.')

  const horasDeTrabalho = entrada.quantidade * entrada.produtividadeHh
  const diasExatos = horasDeTrabalho / (entrada.equipe * jornada)
  // O épsilon evita que 14.000000000000002 vire 15 por erro de ponto flutuante.
  const dias = Math.ceil(diasExatos - 1e-9)
  return { horasDeTrabalho, diasExatos, dias }
}
