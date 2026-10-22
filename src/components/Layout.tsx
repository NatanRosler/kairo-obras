import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDados } from '@/app/dados'
import { lembrarObra, useObraAtual } from '@/app/obraAtual'
import { LogoKairoObras } from './LogoKairoObras'

const STATUS: Record<string, string> = { execucao: 'em execução', orcamento: 'orçamento', concluida: 'concluída' }

const link = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2.5 text-sm no-underline ${
    isActive ? 'bg-menu-ativo font-semibold text-white' : 'text-menu-texto hover:bg-menu-ativo/60'
  }`

const rotulo = 'px-2.5 pt-5 pb-1.5 text-[11px] uppercase tracking-[0.08em] text-[#9CA3AF]'

export function Layout() {
  const { dados, repositorio } = useDados()
  const obra = useObraAtual()
  const local = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    if (obra) lembrarObra(obra.id)
  }, [obra])

  // Fecha o seletor de obra ao trocar de página.
  useEffect(() => setMenuAberto(false), [local.pathname])

  return (
    <div className="flex min-h-screen flex-wrap bg-chao text-tinta">
      <nav aria-label="Navegação principal" className="flex flex-[1_1_220px] flex-col gap-1 bg-menu px-3.5 py-6">
        <Link to="/obras" className="px-2.5 pb-5 no-underline" aria-label="Kairo Obras — todas as obras">
          <LogoKairoObras />
        </Link>

        <NavLink to="/obras" end className={link}>
          Todas as obras
        </NavLink>

        {obra && (
          <>
            <div className={rotulo}>Obra atual</div>
            <button
              type="button"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              className="mb-1.5 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-menu-borda px-3 py-2.5 text-left text-sm font-semibold text-white"
            >
              {obra.nome}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={menuAberto ? 'rotate-180' : ''}>
                <path d="M7 10l5 5 5-5" />
              </svg>
            </button>
            {menuAberto && (
              <div className="mb-2 flex flex-col gap-0.5 rounded-lg border border-menu-borda bg-[#22272E] p-1.5">
                {dados.obras.map((o) => (
                  <Link
                    key={o.id}
                    to={`/obras/${o.id}`}
                    aria-current={o.id === obra.id ? 'true' : undefined}
                    className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-[13px] no-underline ${
                      o.id === obra.id ? 'bg-menu-ativo font-semibold text-white' : 'text-[#E9E7E1]'
                    }`}
                  >
                    {o.nome}
                    <span className="text-[11px] font-normal text-[#9CA3AF]">{STATUS[o.status]}</span>
                  </Link>
                ))}
                <Link to="/obras" className="mt-1 border-t border-menu-borda px-2.5 pt-2 pb-1.5 text-[13px] font-semibold text-[#FDBA74] no-underline">
                  Ver todas as obras
                </Link>
              </div>
            )}
            <NavLink to={`/obras/${obra.id}`} end className={link}>Visão geral</NavLink>
            <NavLink to={`/obras/${obra.id}/orcamento`} className={link}>Orçamento</NavLink>
            <NavLink to={`/obras/${obra.id}/cronograma`} className={link}>Cronograma</NavLink>
            <NavLink to={`/obras/${obra.id}/custos`} className={link}>Orçado × real</NavLink>
            <NavLink to={`/obras/${obra.id}/bdi`} className={link}>Cálculo do BDI</NavLink>
          </>
        )}

        <div className={rotulo}>Cadastros</div>
        <NavLink to="/base" className={link}>Base de preços e produtividade</NavLink>
        <NavLink to="/equipes" className={link}>Equipes</NavLink>

        {repositorio.tipo === 'exemplo' && (
          <p className="mt-auto px-2.5 pt-6 text-xs leading-relaxed text-[#9CA3AF]">
            Modo demonstração: dados fictícios, nada é salvo.
          </p>
        )}
      </nav>

      <main className="min-w-0 flex-[999_1_560px] px-9 pt-7 pb-12 max-sm:px-4">
        <Outlet />
      </main>
    </div>
  )
}
