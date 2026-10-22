import { describe, expect, it } from 'vitest'
import { etapaDaLinha, obraDaLinha } from './mapeamento'
import { criarRepositorioExemplo } from './repositorio'

describe('mapeamento do banco', () => {
  it('converte numeric (string) em number e snake_case em camelCase', () => {
    const obra = obraDaLinha({
      id: 'x', nome: 'Obra', descricao: null, inicio: '2026-07-20', status: 'execucao',
      bdi_percentual: '21.500', jornada_horas: '8.00', dias_parados: null,
    })
    expect(obra).toEqual({
      id: 'x', nome: 'Obra', descricao: '', inicio: '2026-07-20', status: 'execucao',
      bdiPercentual: 21.5, jornadaHoras: 8, diasParados: [],
    })
  })

  it('monta as dependências da etapa a partir da tabela de ligação', () => {
    const etapa = etapaDaLinha(
      { id: 'e2', obra_id: 'o', ordem: 2, nome: 'Paredes', servico_guia_id: 's', quantidade: '380', equipe_id: 'q', pessoas: 4, avanco: '1.0000' },
      [
        { etapa_id: 'e2', depende_de_id: 'e1' },
        { etapa_id: 'e3', depende_de_id: 'e2' },
      ],
    )
    expect(etapa.dependeDe).toEqual(['e1'])
    expect(etapa.quantidade).toBe(380)
    expect(etapa.avanco).toBe(1)
  })
})

describe('repositório de exemplo', () => {
  it('guarda lançamentos novos sem alterar os dados originais', async () => {
    const repo = criarRepositorioExemplo()
    const antes = (await repo.carregarTudo()).lancamentos.length
    await repo.adicionarLancamento({ obraId: 'obra-a', etapaId: 'a10', data: '2026-10-22', descricao: 'Teste', tipo: 'material', valor: 100 })
    expect((await repo.carregarTudo()).lancamentos).toHaveLength(antes + 1)
    expect((await criarRepositorioExemplo().carregarTudo()).lancamentos).toHaveLength(antes)
  })
})
