/**
 * Cronograma pelo Método do Caminho Crítico (CPM).
 *
 * Cada etapa tem uma duração em dias úteis e uma lista de etapas que precisam terminar
 * antes dela começar (dependência "término-início"). O cálculo faz:
 *
 *  1. ida:   início mais cedo (ES) e término mais cedo (EF) de cada etapa;
 *  2. volta: início mais tarde (LS) e término mais tarde (LF) sem atrasar a obra;
 *  3. folga = LS − ES. Etapas com folga zero formam o caminho crítico.
 *
 * Os dias são índices de dias úteis (0 = primeiro dia da obra). O `Calendario`
 * converte esses índices em datas.
 */

import type { Calendario, DataISO } from './calendario'

export interface EtapaEntrada {
  id: string
  /** Duração em dias úteis (inteiro ≥ 0). */
  duracao: number
  /** Ids das etapas que precisam terminar antes desta começar. */
  dependeDe: string[]
  /** "Não começar antes do dia útil N" (ex.: material só chega depois). */
  inicioMinimo?: number
}

export interface EtapaCalculada {
  id: string
  duracao: number
  inicioCedo: number
  fimCedo: number
  inicioTarde: number
  fimTarde: number
  folga: number
  critica: boolean
}

export interface ResultadoCronograma {
  /** Duração total da obra, em dias úteis. */
  duracaoTotal: number
  /** Etapas na ordem em que podem ser executadas. */
  etapas: EtapaCalculada[]
  /** Ids das etapas sem folga, na ordem de execução. */
  caminhoCritico: string[]
}

export class ErroCronograma extends Error {
  readonly ids: string[]
  constructor(mensagem: string, ids: string[]) {
    super(mensagem)
    this.name = 'ErroCronograma'
    this.ids = ids
  }
}

/** Ordena as etapas para que toda etapa venha depois das que ela depende (algoritmo de Kahn). */
function ordenarTopologicamente(etapas: EtapaEntrada[]): EtapaEntrada[] {
  const porId = new Map<string, EtapaEntrada>()
  for (const etapa of etapas) {
    if (porId.has(etapa.id)) throw new ErroCronograma(`Etapa duplicada: "${etapa.id}".`, [etapa.id])
    porId.set(etapa.id, etapa)
  }

  const pendentes = new Map<string, number>()
  const sucessores = new Map<string, string[]>()
  for (const etapa of etapas) {
    pendentes.set(etapa.id, 0)
    sucessores.set(etapa.id, [])
  }
  for (const etapa of etapas) {
    for (const dep of new Set(etapa.dependeDe)) {
      if (!porId.has(dep)) {
        throw new ErroCronograma(`A etapa "${etapa.id}" depende de "${dep}", que não existe.`, [etapa.id, dep])
      }
      if (dep === etapa.id) {
        throw new ErroCronograma(`A etapa "${etapa.id}" não pode depender dela mesma.`, [etapa.id])
      }
      pendentes.set(etapa.id, (pendentes.get(etapa.id) ?? 0) + 1)
      sucessores.get(dep)!.push(etapa.id)
    }
  }

  // Mantém a ordem original entre etapas "empatadas", para o resultado ser previsível.
  const fila = etapas.filter((e) => pendentes.get(e.id) === 0).map((e) => e.id)
  const ordem: EtapaEntrada[] = []
  while (fila.length > 0) {
    const id = fila.shift()!
    ordem.push(porId.get(id)!)
    for (const suc of sucessores.get(id)!) {
      const restante = pendentes.get(suc)! - 1
      pendentes.set(suc, restante)
      if (restante === 0) fila.push(suc)
    }
  }

  if (ordem.length !== etapas.length) {
    const emCiclo = etapas.filter((e) => pendentes.get(e.id)! > 0).map((e) => e.id)
    throw new ErroCronograma(`Dependências em círculo entre as etapas: ${emCiclo.join(', ')}.`, emCiclo)
  }
  return ordem
}

export function calcularCronograma(etapas: EtapaEntrada[]): ResultadoCronograma {
  for (const etapa of etapas) {
    if (!Number.isInteger(etapa.duracao) || etapa.duracao < 0) {
      throw new ErroCronograma(`Duração inválida na etapa "${etapa.id}": ${etapa.duracao}.`, [etapa.id])
    }
  }

  const ordem = ordenarTopologicamente(etapas)
  const inicioCedo = new Map<string, number>()
  const fimCedo = new Map<string, number>()

  for (const etapa of ordem) {
    const aposDependencias = etapa.dependeDe.reduce((max, dep) => Math.max(max, fimCedo.get(dep)!), 0)
    const es = Math.max(aposDependencias, etapa.inicioMinimo ?? 0)
    inicioCedo.set(etapa.id, es)
    fimCedo.set(etapa.id, es + etapa.duracao)
  }

  const duracaoTotal = ordem.reduce((max, e) => Math.max(max, fimCedo.get(e.id)!), 0)

  const sucessores = new Map<string, string[]>(ordem.map((e) => [e.id, []]))
  for (const etapa of ordem) for (const dep of etapa.dependeDe) sucessores.get(dep)!.push(etapa.id)

  const inicioTarde = new Map<string, number>()
  const fimTarde = new Map<string, number>()
  for (const etapa of [...ordem].reverse()) {
    const lf = sucessores.get(etapa.id)!.reduce((min, suc) => Math.min(min, inicioTarde.get(suc)!), duracaoTotal)
    fimTarde.set(etapa.id, lf)
    inicioTarde.set(etapa.id, lf - etapa.duracao)
  }

  const calculadas: EtapaCalculada[] = ordem.map((e) => {
    const folga = inicioTarde.get(e.id)! - inicioCedo.get(e.id)!
    return {
      id: e.id,
      duracao: e.duracao,
      inicioCedo: inicioCedo.get(e.id)!,
      fimCedo: fimCedo.get(e.id)!,
      inicioTarde: inicioTarde.get(e.id)!,
      fimTarde: fimTarde.get(e.id)!,
      folga,
      critica: folga === 0,
    }
  })

  return {
    duracaoTotal,
    etapas: calculadas,
    caminhoCritico: calculadas.filter((e) => e.critica).map((e) => e.id),
  }
}

export interface PeriodoEtapa {
  id: string
  /** Primeiro dia de trabalho da etapa. */
  inicio: DataISO
  /** Último dia de trabalho da etapa (para duração zero, igual ao início). */
  fim: DataISO
}

/** Converte os índices de dias úteis do cronograma em datas reais. */
export function datasDoCronograma(resultado: ResultadoCronograma, calendario: Calendario): {
  termino: DataISO | null
  etapas: PeriodoEtapa[]
} {
  return {
    termino: resultado.duracaoTotal > 0 ? calendario.data(resultado.duracaoTotal - 1) : null,
    etapas: resultado.etapas.map((e) => ({
      id: e.id,
      inicio: calendario.data(e.inicioCedo),
      fim: calendario.data(Math.max(e.inicioCedo, e.fimCedo - 1)),
    })),
  }
}
