/**
 * Conflitos de equipe entre obras.
 *
 * Uma equipe é da empresa, não da obra. Se duas etapas (da mesma obra ou de obras
 * diferentes) usam a mesma equipe em períodos que se cruzam, há conflito.
 */

import type { DataISO } from './calendario'

export interface Alocacao {
  equipeId: string
  obraId: string
  etapaId: string
  /** Primeiro dia da equipe na etapa. */
  inicio: DataISO
  /** Último dia da equipe na etapa (inclusive). */
  fim: DataISO
}

export interface ConflitoEquipe {
  equipeId: string
  a: Alocacao
  b: Alocacao
  /** Primeiro dia em que a equipe está nas duas etapas. */
  de: DataISO
  /** Último dia em que a equipe está nas duas etapas. */
  ate: DataISO
}

export function encontrarConflitos(alocacoes: Alocacao[]): ConflitoEquipe[] {
  for (const a of alocacoes) {
    if (a.fim < a.inicio) {
      throw new Error(`Alocação com fim antes do início: etapa "${a.etapaId}" da obra "${a.obraId}".`)
    }
  }

  const porEquipe = new Map<string, Alocacao[]>()
  for (const a of alocacoes) {
    const lista = porEquipe.get(a.equipeId) ?? []
    lista.push(a)
    porEquipe.set(a.equipeId, lista)
  }

  const conflitos: ConflitoEquipe[] = []
  for (const [equipeId, lista] of porEquipe) {
    // Ordenar pelo início permite parar cedo: depois que uma alocação começa
    // após o fim da atual, nenhuma das seguintes cruza com ela.
    const ordenadas = [...lista].sort((x, y) => x.inicio.localeCompare(y.inicio))
    for (let i = 0; i < ordenadas.length; i++) {
      const a = ordenadas[i]
      for (let j = i + 1; j < ordenadas.length; j++) {
        const b = ordenadas[j]
        if (b.inicio > a.fim) break
        conflitos.push({
          equipeId,
          a,
          b,
          de: b.inicio,
          ate: a.fim < b.fim ? a.fim : b.fim,
        })
      }
    }
  }
  return conflitos.sort((x, y) => x.de.localeCompare(y.de) || x.equipeId.localeCompare(y.equipeId))
}
