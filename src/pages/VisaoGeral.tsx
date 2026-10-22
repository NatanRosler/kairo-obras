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
import { cronogramaDaObra, custosDaObra } from '@/domain/obra'
import { brlInteiro, dataCompleta, percentual, percentualComSinal } from '@/lib/formato'
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
