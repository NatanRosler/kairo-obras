import { describe, expect, it } from 'vitest'
import {
  calcularBDI,
  calcularCronograma,
  calcularDuracao,
  criarCalendario,
  desvioDaEtapa,
  encontrarConflitos,
  ErroCronograma,
  feriadosNacionais,
  pascoa,
  precoDeVenda,
  resumirCustos,
} from '.'

describe('calendário', () => {
  it('calcula a Páscoa e a Sexta-feira Santa', () => {
    expect(pascoa(2026)).toBe('2026-04-05')
    expect(pascoa(2027)).toBe('2027-03-28')
    expect(feriadosNacionais(2026)).toContain('2026-04-03')
  })

  it('inclui o Dia da Consciência Negra e não inclui o Carnaval', () => {
    const f = feriadosNacionais(2026)
    expect(f).toContain('2026-11-20')
    expect(f).not.toContain('2026-02-17')
  })

  it('pula fins de semana e feriados', () => {
    const cal = criarCalendario({ inicio: '2026-09-04' }) // sexta
    expect(cal.data(0)).toBe('2026-09-04')
    expect(cal.data(1)).toBe('2026-09-08') // 05-06 fim de semana, 07 feriado
  })

  it('começa no próximo dia útil quando o início cai num sábado', () => {
    const cal = criarCalendario({ inicio: '2026-07-18' })
    expect(cal.data(0)).toBe('2026-07-20')
  })

  it('aceita sábado como dia trabalhado e dias parados por chuva', () => {
    const cal = criarCalendario({ inicio: '2026-07-20', diasDaSemana: [1, 2, 3, 4, 5, 6], diasParados: ['2026-07-21'] })
    expect([0, 1, 2, 3, 4, 5].map((i) => cal.data(i))).toEqual([
      '2026-07-20', '2026-07-22', '2026-07-23', '2026-07-24', '2026-07-25', '2026-07-27',
    ])
  })

  it('converte data em índice e de volta', () => {
    const cal = criarCalendario({ inicio: '2026-07-20' })
    expect(cal.indice('2026-10-22')).toBe(66)
    expect(cal.data(66)).toBe('2026-10-22')
    expect(cal.indice('2026-09-07')).toBe(cal.indice('2026-09-08')) // feriado vira o próximo dia útil
  })

  it('recusa datas inválidas', () => {
    expect(() => criarCalendario({ inicio: '2026-02-30' })).toThrow(/inexistente/)
    expect(() => criarCalendario({ inicio: '20/07/2026' })).toThrow(/formato/)
  })
})

describe('duração', () => {
  it('reproduz a conta das paredes do protótipo', () => {
    const r = calcularDuracao({ quantidade: 380, produtividadeHh: 1.1, equipe: 4 })
    expect(r.horasDeTrabalho).toBeCloseTo(418)
    expect(r.diasExatos).toBeCloseTo(13.06, 2)
    expect(r.dias).toBe(14)
  })

  it('não arredonda para cima por erro de ponto flutuante', () => {
    // 0.1 × 3 = 0.30000000000000004 em ponto flutuante
    expect(calcularDuracao({ quantidade: 3, produtividadeHh: 0.1 * 8, equipe: 3, jornadaHoras: 0.1 * 8 }).dias).toBe(1)
  })

  it('valida a equipe', () => {
    expect(() => calcularDuracao({ quantidade: 10, produtividadeHh: 1, equipe: 0 })).toThrow()
    expect(() => calcularDuracao({ quantidade: 10, produtividadeHh: 1, equipe: 1.5 })).toThrow()
  })
})

describe('cronograma (CPM)', () => {
  const etapas = [
    { id: 'A', duracao: 3, dependeDe: [] },
    { id: 'B', duracao: 5, dependeDe: ['A'] },
    { id: 'C', duracao: 2, dependeDe: ['A'] },
    { id: 'D', duracao: 4, dependeDe: ['B', 'C'] },
  ]

  it('calcula início, término e folga', () => {
    const r = calcularCronograma(etapas)
    expect(r.duracaoTotal).toBe(12)
    const c = r.etapas.find((e) => e.id === 'C')!
    expect(c).toMatchObject({ inicioCedo: 3, fimCedo: 5, inicioTarde: 6, folga: 3, critica: false })
    expect(r.caminhoCritico).toEqual(['A', 'B', 'D'])
  })

  it('respeita "não começar antes de"', () => {
    const r = calcularCronograma([...etapas.slice(0, 3), { id: 'D', duracao: 4, dependeDe: ['B', 'C'], inicioMinimo: 10 }])
    expect(r.duracaoTotal).toBe(14)
  })

  it('detecta dependências em círculo', () => {
    const ciclo = [
      { id: 'A', duracao: 1, dependeDe: ['C'] },
      { id: 'B', duracao: 1, dependeDe: ['A'] },
      { id: 'C', duracao: 1, dependeDe: ['B'] },
    ]
    expect(() => calcularCronograma(ciclo)).toThrow(ErroCronograma)
    try {
      calcularCronograma(ciclo)
    } catch (e) {
      expect((e as ErroCronograma).ids.sort()).toEqual(['A', 'B', 'C'])
    }
  })

  it('detecta dependência inexistente e duplicada', () => {
    expect(() => calcularCronograma([{ id: 'A', duracao: 1, dependeDe: ['X'] }])).toThrow(/não existe/)
    expect(() => calcularCronograma([
      { id: 'A', duracao: 1, dependeDe: [] },
      { id: 'A', duracao: 2, dependeDe: [] },
    ])).toThrow(/duplicada/)
  })

  it('aceita etapa de duração zero (marco)', () => {
    const r = calcularCronograma([
      { id: 'A', duracao: 2, dependeDe: [] },
      { id: 'M', duracao: 0, dependeDe: ['A'] },
    ])
    expect(r.duracaoTotal).toBe(2)
    expect(r.etapas.find((e) => e.id === 'M')!.inicioCedo).toBe(2)
  })
})

describe('BDI', () => {
  it('reproduz a fórmula da planilha original', () => {
    const r = calcularBDI({ indiretos: [3, 0, 0.4, 0.8, 0.4, 0.8], sobrePreco: [6.65, 6.1, 0.5, 0] })
    expect(r.fatorIndiretos).toBeCloseTo(1.054)
    expect(r.fatorPreco).toBeCloseTo(0.8675)
    expect(r.bdi).toBeCloseTo(21.5, 1)
    expect(precoDeVenda(408950, 21.5)).toBeCloseTo(496874.25, 2)
  })

  it('recusa itens sobre o preço que somam 100% ou mais', () => {
    expect(() => calcularBDI({ indiretos: [], sobrePreco: [60, 40] })).toThrow(/100%/)
  })
})

describe('custos (valor agregado)', () => {
  it('compara o real com o orçado do que foi executado', () => {
    const r = resumirCustos([
      { orcado: 100, avanco: 1, real: 110 },
      { orcado: 100, avanco: 0.5, real: 40 },
      { orcado: 200, avanco: 0, real: 0 },
    ])
    expect(r.valorAgregado).toBe(150)
    expect(r.desvio).toBe(0)
    expect(r.avancoFisico).toBeCloseTo(0.375)
    expect(r.projecaoFinal).toBeCloseTo(400)
  })

  it('calcula o desvio da etapa só quando ela começou', () => {
    expect(desvioDaEtapa({ orcado: 100, avanco: 0.5, real: 55 })).toBeCloseTo(10)
    expect(desvioDaEtapa({ orcado: 100, avanco: 0, real: 0 })).toBeNull()
  })
})

describe('conflitos de equipe', () => {
  it('encontra a mesma equipe em duas obras ao mesmo tempo', () => {
    const conflitos = encontrarConflitos([
      { equipeId: 'ped', obraId: 'A', etapaId: 'revestimento', inicio: '2026-10-09', fim: '2026-11-05' },
      { equipeId: 'ped', obraId: 'B', etapaId: 'paredes', inicio: '2026-11-03', fim: '2026-12-01' },
      { equipeId: 'pin', obraId: 'A', etapaId: 'pintura', inicio: '2026-11-03', fim: '2026-11-20' },
    ])
    expect(conflitos).toHaveLength(1)
    expect(conflitos[0]).toMatchObject({ equipeId: 'ped', de: '2026-11-03', ate: '2026-11-05' })
  })

  it('não acusa conflito quando uma termina no dia anterior ao início da outra', () => {
    expect(encontrarConflitos([
      { equipeId: 'ped', obraId: 'A', etapaId: 'x', inicio: '2026-10-01', fim: '2026-11-05' },
      { equipeId: 'ped', obraId: 'B', etapaId: 'y', inicio: '2026-11-06', fim: '2026-11-30' },
    ])).toEqual([])
  })
})
