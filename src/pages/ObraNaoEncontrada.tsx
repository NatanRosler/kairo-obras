import { Link } from 'react-router-dom'

export function ObraNaoEncontrada() {
  return (
    <div className="rounded-xl border border-borda bg-cartao p-8">
      <h1 className="text-xl font-semibold">Obra não encontrada</h1>
      <p className="mt-2 text-sm text-apagado">O endereço pode estar errado ou a obra foi excluída.</p>
      <Link to="/obras" className="mt-4 inline-block font-semibold text-laranja">Ver todas as obras</Link>
    </div>
  )
}

export function PaginaNaoEncontrada() {
  return (
    <div className="rounded-xl border border-borda bg-cartao p-8">
      <h1 className="text-xl font-semibold">Página não encontrada</h1>
      <Link to="/obras" className="mt-4 inline-block font-semibold text-laranja">Voltar para as obras</Link>
    </div>
  )
}
