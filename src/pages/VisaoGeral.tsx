/**
 * Visão geral da obra.
 *
 * Os indicadores do topo já estão prontos e servem de MODELO para as outras telas:
 *   1. pegar os dados com useDados() e a obra com useObraAtual();
 *   2. calcular com as funções de src/domain (nunca fazer conta na tela);
 *   3. formatar com src/lib/formato.ts.
 */
import { useMemo } from 'react'
import { useDados } from '@/app/dados'
import { useObraAtual } from '@/app/obraAtual'
import { cronogramaDaObra, custosDaObra, type LinhaCronograma } from '@/domain/obra'
import { brl, brlInteiro, dataCompleta, diaMes, percentual, percentualComSinal } from '@/lib/formato'
import { Cabecalho, PaginaGuia } from '@/components/PaginaGuia'
import { ObraNaoEncontrada } from './ObraNaoEncontrada'

interface PropsIndicador {
  rotulo: string
  valor: string
  /** Unidade em letra menor ao lado do número (ex.: "dias úteis"). */
  unidade?: string
  detalhe: string
  alerta?: boolean
}

function Indicador({ rotulo, valor, unidade, detalhe, alerta = false }: PropsIndicador) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-borda bg-cartao px-5 py-4">
      <span className="text-[13px] text-apagado">{rotulo}</span>
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[28px] font-semibold">{valor}</span>
        {unidade && <span className="text-[15px] font-medium text-apagado">{unidade}</span>}
      </span>
      <span className={`text-[13px] ${alerta ? 'font-semibold text-laranja' : 'text-apagado'}`}>{detalhe}</span>
    </div>
  )
}
function situacao(avanco: number): string {
  if (avanco === 1) {
    return 'Concluída'
  } else if (avanco > 0) {
    return 'Em andamento'
  } else {
    return 'A iniciar'
  }
}

function periodo(etapaId: string, linhasCronograma: LinhaCronograma[]): string {
  const encontrada = linhasCronograma.find((l) => l.etapa.id === etapaId)
  if (encontrada === undefined) {
    return '—'
  }
  return `${diaMes(encontrada.inicio)}–${diaMes(encontrada.fim)}`
}

export function VisaoGeral() {
  const { dados } = useDados()
  const obra = useObraAtual()

  // useMemo: só recalcula quando os dados mudam.
  const calculo = useMemo(() => {
    if (!obra) return null
    return {
      cronograma: cronogramaDaObra({ obra, etapas: dados.etapas, servicos: dados.servicos, medicoes: dados.medicoes }),
      custos: custosDaObra(obra, dados.etapas, dados.itens, dados.lancamentos),
    }
  }, [obra, dados])

  if (!obra || !calculo) return <ObraNaoEncontrada />
  const { cronograma, custos } = calculo
  const r = custos.resumo

  return (
    <>
      <Cabecalho trilha={`Obras / ${obra.nome}`} titulo={obra.nome} subtitulo={`${obra.descricao} · início ${dataCompleta(obra.inicio)}`} />

      <section aria-label="Indicadores" className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <Indicador
          rotulo="Prazo calculado"
          valor={String(cronograma.duracaoTotal)}
          unidade="dias úteis"
          detalhe={cronograma.termino ? `${dataCompleta(obra.inicio)} → ${dataCompleta(cronograma.termino)}` : 'sem etapas'}
        />
        <Indicador
          rotulo="Preço da obra"
          valor={brlInteiro(custos.preco)}
          detalhe={`${brlInteiro(custos.custoDireto)} custo direto + BDI ${percentual(obra.bdiPercentual)}`}
        />
        <Indicador rotulo="Avanço físico" valor={percentual(r.avancoFisico * 100)} detalhe="ponderado pelo orçado de cada etapa" />
        <Indicador
          rotulo="Gasto até agora"
          valor={brlInteiro(r.real)}
          detalhe={r.valorAgregado > 0 ? `${percentualComSinal(r.desvioPercentual)} contra o previsto para o executado` : 'obra ainda não começou'}
          alerta={r.desvioPercentual > 0}
        />
      </section>
      <section className="mt-6 rounded-xl border border-borda bg-cartao p-5">
        <h2 className="text-[17px] font-semibold">Etapas</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-apagado">
              <th className="px-3 py-2">Etapa</th>
              <th className="px-3 py-2 text-right">Orçado</th>
              <th className="px-3 py-2 text-right">Real</th>
              <th className="px-3 py-2 text-right">Desvio</th>
              <th className="px-3 py-2">Situação</th>
              <th className="px-3 py-2">Período</th>
            </tr>
          </thead>
          <tbody>
            {custos.etapas.map((linha) => (
              <tr key={linha.etapa.id} className="border-t border-linha">
                <td className="px-3 py-2">{linha.etapa.nome}</td>
                <td className="px-3 py-2 text-right font-mono">{brl(linha.orcado)}</td>
                <td className="px-3 py-2 text-right font-mono">{brl(linha.real)}</td>
                <td className="px-3 py-2 text-right font-mono">{linha.desvio === null ? '—' : percentualComSinal(linha.desvio)}</td>
                <td className="px-3 py-2">{situacao(linha.etapa.avanco)}</td>
                <td className="px-3 py-2 font-mono">{periodo(linha.etapa.id, cronograma.linhas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <PaginaGuia
        prancha="1 · Visão geral da obra"
        construir={[
          'Curva S: gasto acumulado orçado × real por mês, com a linha de "hoje".',
          'Pontos de atenção: etapa crítica em andamento, etapas acima do orçado, próximas etapas.',
          'Tabela de etapas: período, situação (concluída / em andamento / a iniciar), avanço, orçado, real e desvio.',
        ]}
        usar={['cronogramaDaObra(...)', 'custosDaObra(...).etapas', 'HOJE (src/data/exemplo.ts)', 'brl, diaMes, percentualComSinal']}
      />
    </>
  )
}
