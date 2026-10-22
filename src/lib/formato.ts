/** Formatação em português do Brasil. Use sempre estas funções nas telas. */

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const reaisInteiros = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

/** R$ 496.874,25 */
export const brl = (v: number) => reais.format(v)

/** R$ 496.874 (sem centavos, para indicadores grandes) */
export const brlInteiro = (v: number) => reaisInteiros.format(Math.round(v))

/** 21,5% — `v` já em percentual (21.5). */
export const percentual = (v: number, casas = 1) =>
  `${v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`

/** +2,7% / −1,6%, com o sinal de menos tipográfico. */
export const percentualComSinal = (v: number, casas = 1) =>
  `${v >= 0 ? '+' : '−'}${percentual(Math.abs(v), casas)}`

export const numero = (v: number, casas = 0) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

/** "2026-10-22" → "22/10" */
export const diaMes = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

/** "2026-10-22" → "22/10/2026" */
export const dataCompleta = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`
