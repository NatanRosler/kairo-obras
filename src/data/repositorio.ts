/**
 * De onde vêm os dados. As telas só conhecem a interface `Repositorio`:
 * - `repositorioExemplo`: dados fictícios em memória (demonstração e desenvolvimento);
 * - `criarRepositorioSupabase`: banco de verdade, com login.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Equipe,
  Etapa,
  ItemOrcamento,
  Lancamento,
  MedicaoProdutividade,
  ModeloBDI,
  Obra,
  Servico,
} from '@/domain/tipos'
import * as exemplo from './exemplo'
import {
  equipeDaLinha,
  etapaDaLinha,
  itemDaLinha,
  lancamentoDaLinha,
  medicaoDaLinha,
  modeloBDIDaLinha,
  obraDaLinha,
  servicoDaLinha,
  type Linha,
} from './mapeamento'

export interface DadosEmpresa {
  obras: Obra[]
  equipes: Equipe[]
  servicos: Servico[]
  medicoes: MedicaoProdutividade[]
  etapas: Etapa[]
  itens: ItemOrcamento[]
  lancamentos: Lancamento[]
  modelosBDI: ModeloBDI[]
}

export type NovoLancamento = Omit<Lancamento, 'id'>

export interface Repositorio {
  /** "exemplo" não salva nada de verdade; "supabase" grava no banco. */
  readonly tipo: 'exemplo' | 'supabase'
  carregarTudo(): Promise<DadosEmpresa>
  adicionarLancamento(lancamento: NovoLancamento): Promise<Lancamento>
  atualizarEtapa(id: string, mudancas: Partial<Pick<Etapa, 'pessoas' | 'avanco' | 'quantidade'>>): Promise<void>
  /** Copia as obras fictícias para a conta (útil para quem acabou de criar o login). */
  carregarDadosExemplo(): Promise<void>
}

/** Em memória: as mudanças valem até recarregar a página. */
export function criarRepositorioExemplo(): Repositorio {
  const dados: DadosEmpresa = structuredClone({
    obras: exemplo.obras,
    equipes: exemplo.equipes,
    servicos: exemplo.servicos,
    medicoes: exemplo.medicoes,
    etapas: exemplo.etapas,
    itens: exemplo.itens,
    lancamentos: exemplo.lancamentos,
    modelosBDI: exemplo.modelosBDI,
  })
  return {
    tipo: 'exemplo',
    async carregarTudo() {
      return structuredClone(dados)
    },
    async adicionarLancamento(novo) {
      const lancamento = { ...novo, id: crypto.randomUUID() }
      dados.lancamentos.push(lancamento)
      return lancamento
    },
    async atualizarEtapa(id, mudancas) {
      const etapa = dados.etapas.find((e) => e.id === id)
      if (!etapa) throw new Error(`Etapa ${id} não encontrada.`)
      Object.assign(etapa, mudancas)
    },
    async carregarDadosExemplo() {
      // Os dados de exemplo já estão carregados.
    },
  }
}

async function selecionar(supabase: SupabaseClient, tabela: string): Promise<Linha[]> {
  const { data, error } = await supabase.from(tabela).select('*')
  if (error) throw new Error(`Erro ao ler ${tabela}: ${error.message}`)
  return data as Linha[]
}

export function criarRepositorioSupabase(supabase: SupabaseClient): Repositorio {
  return {
    tipo: 'supabase',
    async carregarTudo() {
      const [obras, equipes, servicos, medicoes, etapas, dependencias, itens, lancamentos, modelos] =
        await Promise.all(
          [
            'obras', 'equipes', 'servicos', 'medicoes_produtividade', 'etapas',
            'etapa_dependencias', 'itens_orcamento', 'lancamentos', 'modelos_bdi',
          ].map((t) => selecionar(supabase, t)),
        )
      return {
        obras: obras.map(obraDaLinha),
        equipes: equipes.map(equipeDaLinha),
        servicos: servicos.map(servicoDaLinha),
        medicoes: medicoes.map(medicaoDaLinha),
        etapas: etapas.map((e) => etapaDaLinha(e, dependencias)),
        itens: itens.map(itemDaLinha),
        lancamentos: lancamentos.map(lancamentoDaLinha),
        modelosBDI: modelos.map(modeloBDIDaLinha),
      }
    },
    async adicionarLancamento(novo) {
      const { data, error } = await supabase
        .from('lancamentos')
        .insert({
          obra_id: novo.obraId,
          etapa_id: novo.etapaId,
          data: novo.data,
          descricao: novo.descricao,
          tipo: novo.tipo,
          valor: novo.valor,
        })
        .select()
        .single()
      if (error) throw new Error(`Erro ao salvar o lançamento: ${error.message}`)
      return lancamentoDaLinha(data as Linha)
    },
    async atualizarEtapa(id, mudancas) {
      const { error } = await supabase.from('etapas').update(mudancas).eq('id', id)
      if (error) throw new Error(`Erro ao atualizar a etapa: ${error.message}`)
    },
    async carregarDadosExemplo() {
      const { error } = await supabase.rpc('carregar_dados_exemplo')
      if (error) throw new Error(`Erro ao carregar os dados de exemplo: ${error.message}`)
    },
  }
}
