/**
 * BDI — Benefícios e Despesas Indiretas.
 *
 * Mesma conta da planilha original (aba "Cálculo BDI", modo percentual):
 *
 *   subtotal       = custo direto × (1 + Σ custos indiretos)
 *   preço de venda = subtotal ÷ (1 − Σ itens sobre o preço)
 *   BDI            = preço de venda ÷ custo direto − 1
 *
 * Custos indiretos (administração, risco...) incidem sobre o custo direto.
 * Impostos, lucro, seguro e reserva incidem sobre o preço final, por isso dividem.
 * Os percentuais entram como número: 6,65% → 6.65.
 */

export interface EntradaBDI {
  /** Percentuais sobre o custo direto (adm. central, adm. local, despesas, risco...). */
  indiretos: number[]
  /** Percentuais sobre o preço de venda (impostos, lucro, seguro, reserva técnica). */
  sobrePreco: number[]
}

export interface ResultadoBDI {
  /** BDI em percentual (21.5 = 21,5%). */
  bdi: number
  /** 1 + Σ indiretos. */
  fatorIndiretos: number
  /** 1 − Σ itens sobre o preço. */
  fatorPreco: number
}

const soma = (valores: number[]) => valores.reduce((total, v) => total + v, 0)

export function calcularBDI(entrada: EntradaBDI): ResultadoBDI {
  for (const v of [...entrada.indiretos, ...entrada.sobrePreco]) {
    if (!Number.isFinite(v) || v < 0) throw new Error(`Percentual inválido no BDI: ${v}.`)
  }
  const fatorIndiretos = 1 + soma(entrada.indiretos) / 100
  const fatorPreco = 1 - soma(entrada.sobrePreco) / 100
  if (fatorPreco <= 0) {
    throw new Error('Os itens sobre o preço somam 100% ou mais: o preço de venda ficaria infinito.')
  }
  return { bdi: (fatorIndiretos / fatorPreco - 1) * 100, fatorIndiretos, fatorPreco }
}

export function precoDeVenda(custoDireto: number, bdiPercentual: number): number {
  return custoDireto * (1 + bdiPercentual / 100)
}
