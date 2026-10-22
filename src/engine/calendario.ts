/**
 * Calendário de dias úteis da obra.
 *
 * Todas as datas são strings ISO ("2026-07-20") e todo o cálculo é feito em UTC,
 * para que o fuso horário do navegador nunca mude um dia de lugar.
 */

export type DataISO = string

export interface OpcoesCalendario {
  /** Primeiro dia possível de trabalho (se não for dia útil, a obra começa no próximo). */
  inicio: DataISO
  /** Dias da semana trabalhados: 0 = domingo ... 6 = sábado. Padrão: segunda a sexta. */
  diasDaSemana?: number[]
  /** Considerar os feriados nacionais. Padrão: true. */
  feriadosNacionais?: boolean
  /** Feriados locais, recessos ou dias parados por chuva. */
  diasParados?: DataISO[]
}

export interface Calendario {
  /** Data do dia útil de número `indice` (0 = primeiro dia da obra). */
  data(indice: number): DataISO
  /** Número do dia útil de uma data. Se a data não for dia útil, devolve o próximo. */
  indice(data: DataISO): number
  /** A data é dia útil neste calendário? */
  ehDiaUtil(data: DataISO): boolean
}

const UM_DIA_MS = 24 * 60 * 60 * 1000

export function paraDate(data: DataISO): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error(`Data inválida: "${data}". Use o formato AAAA-MM-DD.`)
  }
  const [ano, mes, dia] = data.split('-').map(Number)
  const d = new Date(Date.UTC(ano, mes - 1, dia))
  if (d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) {
    throw new Error(`Data inexistente: "${data}".`)
  }
  return d
}

export function paraISO(d: Date): DataISO {
  return d.toISOString().slice(0, 10)
}

export function somarDias(data: DataISO, dias: number): DataISO {
  return paraISO(new Date(paraDate(data).getTime() + dias * UM_DIA_MS))
}

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher, calendário gregoriano). */
export function pascoa(ano: number): DataISO {
  const a = ano % 19
  const b = Math.floor(ano / 100)
  const c = ano % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mes = Math.floor((h + l - 7 * m + 114) / 31)
  const dia = ((h + l - 7 * m + 114) % 31) + 1
  return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

/**
 * Feriados nacionais (Lei 662/1949 e alterações, incluindo o Dia da Consciência Negra,
 * Lei 14.759/2023). Carnaval e Corpus Christi são pontos facultativos e não entram aqui:
 * quem para nesses dias deve informá-los em `diasParados`.
 */
export function feriadosNacionais(ano: number): DataISO[] {
  const fixos = ['01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '11-20', '12-25']
  const sextaSanta = somarDias(pascoa(ano), -2)
  return [...fixos.map((md) => `${ano}-${md}`), sextaSanta].sort()
}

export function criarCalendario(opcoes: OpcoesCalendario): Calendario {
  const diasDaSemana = new Set(opcoes.diasDaSemana ?? [1, 2, 3, 4, 5])
  if (diasDaSemana.size === 0) {
    throw new Error('O calendário precisa de pelo menos um dia da semana trabalhado.')
  }
  const usarFeriados = opcoes.feriadosNacionais ?? true
  const parados = new Set(opcoes.diasParados ?? [])
  const feriadosPorAno = new Map<number, Set<DataISO>>()

  const ehFeriado = (data: DataISO): boolean => {
    if (!usarFeriados) return false
    const ano = Number(data.slice(0, 4))
    let lista = feriadosPorAno.get(ano)
    if (!lista) {
      lista = new Set(feriadosNacionais(ano))
      feriadosPorAno.set(ano, lista)
    }
    return lista.has(data)
  }

  const ehDiaUtil = (data: DataISO): boolean =>
    diasDaSemana.has(paraDate(data).getUTCDay()) && !ehFeriado(data) && !parados.has(data)

  // Dias úteis já calculados, gerados sob demanda.
  const dias: DataISO[] = []
  let cursor = opcoes.inicio
  paraDate(cursor) // valida a data de início

  const garantir = (indice: number) => {
    while (dias.length <= indice) {
      if (ehDiaUtil(cursor)) dias.push(cursor)
      cursor = somarDias(cursor, 1)
    }
  }

  return {
    ehDiaUtil,
    data(indice) {
      if (!Number.isInteger(indice) || indice < 0) {
        throw new Error(`Índice de dia útil inválido: ${indice}`)
      }
      garantir(indice)
      return dias[indice]
    },
    indice(data) {
      paraDate(data)
      if (data < opcoes.inicio) return 0
      let i = 0
      garantir(i)
      while (dias[i] < data) {
        i++
        garantir(i)
      }
      return i
    },
  }
}
