/**
 * Telas ainda em construção. Cada uma mostra o que construir e quais funções usar.
 * Quando for construir uma tela, mova-a para um arquivo próprio em src/pages/
 * (como VisaoGeral.tsx) e substitua o <PaginaGuia>.
 */
import { useObraAtual } from '@/app/obraAtual'
import { Cabecalho, PaginaGuia } from '@/components/PaginaGuia'
import { ObraNaoEncontrada } from './ObraNaoEncontrada'

export function TodasObras() {
  return (
    <>
      <Cabecalho trilha="Kairo Obras" titulo="Todas as obras" subtitulo="Prazos, custos e equipes de todas as obras num lugar só." />
      <PaginaGuia
        prancha="0 · Todas as obras"
        construir={[
          'Indicadores: obras em execução, valor da carteira, gasto do mês, conflitos de equipe.',
          'Cartão por obra (link para a visão geral): status, avanço, prazo, preço e desvio.',
          'Linha do tempo com todas as obras e a linha de "hoje".',
          'Aviso de conflito de equipe com a sugestão de mudança.',
        ]}
        usar={['cronogramaDaObra(...) para cada obra', 'custosDaObra(...)', 'alocacoesDaObra(...) + encontrarConflitos(...)']}
      />
    </>
  )
}

function TelaDeObra({ titulo, prancha, construir, usar }: { titulo: string; prancha: string; construir: string[]; usar: string[] }) {
  const obra = useObraAtual()
  if (!obra) return <ObraNaoEncontrada />
  return (
    <>
      <Cabecalho trilha={`${obra.nome} / ${titulo}`} titulo={titulo} />
      <PaginaGuia prancha={prancha} construir={construir} usar={usar} />
    </>
  )
}

export const Orcamento = () => (
  <TelaDeObra
    titulo="Orçamento"
    prancha="2 · Orçamento + cálculo do prazo"
    construir={[
      'Resumo: custo direto, BDI, preço de venda.',
      'Tabela de etapas: serviço que define o prazo, equipe, dias, custo direto, % do total.',
      'Ao clicar numa etapa: painel com a conta do prazo passo a passo e os itens do orçamento.',
    ]}
    usar={['cronogramaDaObra(...).linhas (tem duracao.horasDeTrabalho e diasExatos)', 'custosDaObra(...).etapas', 'custoDiretoDosItens(itens)']}
  />
)

export const Cronograma = () => (
  <TelaDeObra
    titulo="Cronograma calculado"
    prancha="3 · Cronograma calculado"
    construir={[
      'Gantt com as etapas, caminho crítico em laranja, concluídas em cinza e a linha de "hoje".',
      'Botões − / + de equipe por etapa (só nas não concluídas) que recalculam o término na hora.',
      'Faixa com término, duração e diferença contra o planejado; botão para voltar às equipes originais.',
    ]}
    usar={['cronogramaDaObra({ ..., pessoasSimuladas: { a10: 6 } })', 'useState para guardar as pessoas simuladas', 'repositorio.atualizarEtapa(id, { pessoas }) para salvar']}
  />
)

export const Custos = () => (
  <TelaDeObra
    titulo="Orçado × real"
    prancha="4 · Orçado × real"
    construir={[
      'Indicadores: orçamento total, orçado do executado, gasto real, desvio e projeção no fim.',
      'Gráfico de gasto por mês (orçado × real) e desvio por etapa.',
      'Últimos lançamentos e formulário de novo lançamento.',
    ]}
    usar={['custosDaObra(...).resumo e .etapas', 'repositorio.adicionarLancamento(...) e depois recarregar()']}
  />
)

export const BDI = () => (
  <TelaDeObra
    titulo="Cálculo do BDI"
    prancha="5 · Cálculo do BDI"
    construir={[
      'Campos editáveis de custos indiretos e de itens sobre o preço.',
      'BDI e preço de venda recalculando na hora, com a faixa de referência.',
      'Botões dos modelos salvos (dados.modelosBDI).',
    ]}
    usar={['calcularBDI({ indiretos, sobrePreco })', 'precoDeVenda(custoDireto, bdi)']}
  />
)

export function Base() {
  return (
    <>
      <Cabecalho trilha="Cadastros" titulo="Base de preços e produtividade" />
      <PaginaGuia
        prancha="6 · Base de preços e produtividade"
        construir={['Busca e filtro por categoria.', 'Tabela de serviços com origem (referência ou ajustado).', 'Painel do serviço com as medições por obra.']}
        usar={['dados.servicos, dados.medicoes', 'produtividadeEfetiva(servico, medicoes)']}
      />
    </>
  )
}

export function Equipes() {
  return (
    <>
      <Cabecalho trilha="Cadastros" titulo="Equipes" />
      <PaginaGuia
        prancha="7 · Equipes"
        construir={['Indicadores de ocupação e conflitos.', 'Agenda das próximas 8 semanas por equipe, colorida por obra.', 'Cadastro das equipes e painel com as próximas alocações.']}
        usar={['alocacoesDaObra(obra, cronograma) para todas as obras', 'encontrarConflitos(alocacoes)']}
      />
    </>
  )
}
