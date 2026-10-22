/**
 * Cartão provisório que diz o que construir em cada tela.
 * Apague este componente da página quando a tela estiver pronta.
 */
interface Props {
  /** Nome da prancha no canvas do protótipo. */
  prancha: string
  construir: string[]
  usar: string[]
}

export function PaginaGuia({ prancha, construir, usar }: Props) {
  return (
    <section className="mt-6 rounded-xl border border-dashed border-ardosia/50 bg-cartao p-6">
      <p className="font-mono text-xs tracking-[0.12em] text-apagado">TELA EM CONSTRUÇÃO · PROTÓTIPO: {prancha.toUpperCase()}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold">O que construir</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#3F454C]">
            {construir.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold">Funções prontas para usar</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {usar.map((u) => <li key={u}><code className="rounded bg-chao px-1.5 py-0.5 font-mono text-[13px]">{u}</code></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Cabecalho({ trilha, titulo, subtitulo }: { trilha: string; titulo: string; subtitulo?: string }) {
  return (
    <header className="flex flex-col gap-1.5">
      <p className="text-[13px] text-apagado">{trilha}</p>
      <h1 className="m-0 text-[28px] font-bold tracking-[-0.02em]">{titulo}</h1>
      {subtitulo && <p className="text-sm text-apagado">{subtitulo}</p>}
    </header>
  )
}
