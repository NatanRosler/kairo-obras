import { useParams } from 'react-router-dom'
import { useDados } from './dados'
import type { Obra } from '@/domain/tipos'

const CHAVE = 'kairo-obras:ultima-obra'

/** Lembra a última obra aberta neste navegador (só conveniência; pode falhar sem problema). */
export function lembrarObra(id: string) {
  try {
    localStorage.setItem(CHAVE, id)
  } catch {
    /* navegação privada ou armazenamento bloqueado */
  }
}

function ultimaObraLembrada(): string | null {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return null
  }
}

/**
 * Obra da rota (/obras/:obraId/...). Fora das rotas de obra (base de preços, equipes),
 * devolve a última obra aberta ou a primeira em execução.
 */
export function useObraAtual(): Obra | null {
  const { dados } = useDados()
  const { obraId } = useParams()
  const id = obraId ?? ultimaObraLembrada()
  return (
    dados.obras.find((o) => o.id === id) ??
    (obraId ? null : dados.obras.find((o) => o.status === 'execucao') ?? dados.obras[0] ?? null)
  )
}
