/**
 * Logo do Kairo Obras: o K em losango da Kairo, com a metade direita virando
 * os andares de uma obra. Os arquivos SVG originais estão em docs/marca/.
 */

const CORES = {
  escuro: { contorno: '#B5D3EA', coluna: '#6E95B5', k: '#F4F8FB', andares: '#FB923C' },
  claro: { contorno: '#0E2A47', coluna: '#3D6F96', k: '#0E2A47', andares: '#EA580C' },
} as const

interface Props {
  /** "escuro" para usar em fundo escuro (menu lateral), "claro" em fundo claro. */
  variante?: keyof typeof CORES
  tamanho?: number
  className?: string
}

export function SimboloKairoObras({ variante = 'escuro', tamanho = 34, className }: Props) {
  const c = CORES[variante]
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d="M50 4L96 50L50 96L4 50ZM50 12L12 50L50 88L88 50Z" fill={c.contorno} />
      <polygon points="17,45 23,39 23,61 17,55" fill={c.coluna} />
      <polygon points="26,36 36,26 36,74 26,64" fill={c.k} />
      <polygon points="36,43 58.5,20.5 64.5,26.5 36,55" fill={c.k} />
      <polygon points="36,45 64.5,73.5 58.5,79.5 36,57" fill={c.k} />
      <g fill={c.andares}>
        <polygon points="65.75,30.25 68.25,30.25 73.75,35.75 60.25,35.75" />
        <polygon points="57.25,38.75 76.75,38.75 82.25,44.25 51.75,44.25" />
        <polygon points="48.75,47.25 85.25,47.25 88,50 85.25,52.75 48.75,52.75 46,50" />
        <polygon points="51.75,55.75 82.25,55.75 76.75,61.25 57.25,61.25" />
        <polygon points="60.25,64.25 73.75,64.25 68.25,69.75 65.75,69.75" />
      </g>
    </svg>
  )
}

export function LogoKairoObras({ variante = 'escuro' }: Pick<Props, 'variante'>) {
  const texto = variante === 'escuro' ? 'text-[#F4F8FB]' : 'text-[#0E2A47]'
  const destaque = variante === 'escuro' ? 'text-laranja-marca' : 'text-[#EA580C]'
  return (
    <span className="flex items-center gap-2.5">
      <SimboloKairoObras variante={variante} />
      <span className={`font-marca text-[15px] font-bold tracking-[0.1em] whitespace-nowrap ${texto}`}>
        KAIRO <span className={destaque}>OBRAS</span>
      </span>
    </span>
  )
}
