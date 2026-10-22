import { describe, expect, it } from 'vitest'
import { encontrarConflitos } from '@/engine'
import * as exemplo from '@/data/exemplo'
import { alocacoesDaObra, cronogramaDaObra, custosDaObra, produtividadeEfetiva } from './obra'

const obra = (id: string) => exemplo.obras.find((o) => o.id === id)!
const ctx = (id: string, pessoasSimuladas?: Record<string, number>) => ({
  obra: obra(id),
  etapas: exemplo.etapas,
  servicos: exemplo.servicos,
  medicoes: exemplo.medicoes,
  pessoasSimuladas,
})

describe('Residência Modelo A (dados do protótipo)', () => {
  it('usa a média das medições quando existem', () => {
    const reboco = exemplo.servicos.find((s) => s.id === 'ACA-001')!
    expect(produtividadeEfetiva(reboco, exemplo.medicoes)).toBeCloseTo(0.755)
  })

  it('calcula 105 dias úteis, de 20/07 a 17/12/2026', () => {
    const c = cronogramaDaObra(ctx('obra-a'))
    expect(c.duracaoTotal).toBe(105)
    expect(c.termino).toBe('2026-12-17')
  })

  it('encontra o caminho crítico e as folgas do protótipo', () => {
    const c = cronogramaDaObra(ctx('obra-a'))
    const folga = (nome: string) => c.linhas.find((l) => l.etapa.nome === nome)!.folga
    expect(folga('Cobertura')).toBe(26)
    expect(folga('Impermeabilização')).toBe(38)
    expect(folga('Forros')).toBe(6)
    expect(folga('Louças e metais')).toBe(14)
    expect(folga('Revestimento de paredes')).toBe(0)
    const revestimento = c.linhas.find((l) => l.etapa.nome === 'Revestimento de paredes')!
    expect(revestimento).toMatchObject({ inicio: '2026-10-09', fim: '2026-11-05' })
  })

  it('reduz o prazo quando a equipe do caminho crítico aumenta', () => {
    const c = cronogramaDaObra(ctx('obra-a', { a10: 6 }))
    expect(c.duracaoTotal).toBe(99)
  })

  it('soma custo direto, preço e o desvio da obra', () => {
    const r = custosDaObra(obra('obra-a'), exemplo.etapas, exemplo.itens, exemplo.lancamentos)
    expect(r.custoDireto).toBeCloseTo(408950, -2)
    expect(r.resumo.real).toBe(349900)
    expect(r.resumo.avancoFisico).toBeCloseTo(0.686, 2)
    expect(r.resumo.desvioPercentual).toBeGreaterThan(2)
  })
})

describe('várias obras', () => {
  it('acha o conflito dos pedreiros entre as obras A e B', () => {
    const alocacoes = ['obra-a', 'obra-b'].flatMap((id) => alocacoesDaObra(obra(id), cronogramaDaObra(ctx(id))))
    const conflitos = encontrarConflitos(alocacoes)
    expect(conflitos).toHaveLength(1)
    expect(conflitos[0]).toMatchObject({ equipeId: 'ped', de: '2026-11-03', ate: '2026-11-05' })
  })
})
