/**
 * Contexto com todos os dados da empresa. Qualquer tela usa:
 *
 *   const { dados, repositorio, recarregar } = useDados()
 *
 * Sem as variáveis do Supabase no .env, carrega os dados de exemplo.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import {
  criarRepositorioExemplo,
  criarRepositorioSupabase,
  type DadosEmpresa,
  type Repositorio,
} from '@/data/repositorio'

interface ValorDados {
  dados: DadosEmpresa
  repositorio: Repositorio
  recarregar: () => Promise<void>
}

const ContextoDados = createContext<ValorDados | null>(null)

export function DadosProvider({ children }: { children: ReactNode }) {
  const repositorio = useMemo(
    () => (supabase ? criarRepositorioSupabase(supabase) : criarRepositorioExemplo()),
    [],
  )
  const [dados, setDados] = useState<DadosEmpresa | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    try {
      setDados(await repositorio.carregarTudo())
      setErro(null)
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e))
    }
  }, [repositorio])

  useEffect(() => {
    void recarregar()
  }, [recarregar])

  if (erro) {
    return (
      <div role="alert" className="m-8 rounded-xl border border-laranja-borda bg-laranja-claro p-6 text-[#7C2D12]">
        <p className="font-semibold">Não foi possível carregar os dados.</p>
        <p className="mt-1 text-sm">{erro}</p>
        <button type="button" onClick={() => void recarregar()} className="mt-4 min-h-11 rounded-lg bg-laranja px-4 font-semibold text-white">
          Tentar de novo
        </button>
      </div>
    )
  }
  if (!dados) {
    return <p className="p-8 text-apagado">Carregando…</p>
  }
  return <ContextoDados.Provider value={{ dados, repositorio, recarregar }}>{children}</ContextoDados.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDados(): ValorDados {
  const valor = useContext(ContextoDados)
  if (!valor) throw new Error('useDados precisa estar dentro de <DadosProvider>.')
  return valor
}
