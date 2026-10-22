/**
 * Gera supabase/migrations/..._dados_exemplo.sql a partir de src/data/exemplo.ts.
 *
 * O SQL cria a função public.carregar_dados_exemplo(), que copia as obras fictícias
 * para o usuário logado. Os ids viram UUIDs determinísticos por usuário
 * (md5 de "usuário:id"), então chamar duas vezes não duplica nada.
 *
 * Uso: npm run gerar:seed
 */
import { writeFileSync } from 'node:fs'
import * as ex from '../src/data/exemplo'

const id = (local: string) => `md5(auth.uid()::text || ':${local}')::uuid`
const txt = (v: string) => `'${v.replace(/'/g, "''")}'`
const num = (v: number) => String(v)
const json = (v: unknown) => `${txt(JSON.stringify(v))}::jsonb`
const datas = (v: string[]) => (v.length ? `array[${v.map(txt).join(', ')}]::date[]` : `'{}'::date[]`)

function insert(tabela: string, colunas: string[], linhas: string[][]): string {
  if (linhas.length === 0) return ''
  const valores = linhas.map((l) => `  (${l.join(', ')})`).join(',\n')
  return `insert into public.${tabela} (${colunas.join(', ')}) values\n${valores}\non conflict do nothing;\n`
}

const partes = [
  insert('obras', ['id', 'nome', 'descricao', 'inicio', 'status', 'bdi_percentual', 'jornada_horas', 'dias_parados'],
    ex.obras.map((o) => [id(o.id), txt(o.nome), txt(o.descricao), txt(o.inicio), txt(o.status), num(o.bdiPercentual), num(o.jornadaHoras), datas(o.diasParados)])),
  insert('equipes', ['id', 'nome', 'composicao', 'pessoas', 'custo_dia'],
    ex.equipes.map((e) => [id(e.id), txt(e.nome), txt(e.composicao), num(e.pessoas), num(e.custoDia)])),
  insert('servicos', ['id', 'codigo', 'categoria', 'descricao', 'unidade', 'material_unitario', 'mao_de_obra_unitario', 'produtividade_referencia_hh'],
    ex.servicos.map((s) => [id(s.id), txt(s.codigo), txt(s.categoria), txt(s.descricao), txt(s.unidade), num(s.materialUnitario), num(s.maoDeObraUnitario), num(s.produtividadeReferenciaHh)])),
  insert('medicoes_produtividade', ['id', 'servico_id', 'obra_id', 'data', 'produtividade_hh'],
    ex.medicoes.map((m) => [id(m.id), id(m.servicoId), id(m.obraId), txt(m.data), num(m.produtividadeHh)])),
  insert('etapas', ['id', 'obra_id', 'ordem', 'nome', 'servico_guia_id', 'quantidade', 'equipe_id', 'pessoas', 'avanco'],
    ex.etapas.map((e) => [id(e.id), id(e.obraId), num(e.ordem), txt(e.nome), id(e.servicoGuiaId), num(e.quantidade), id(e.equipeId), num(e.pessoas), num(e.avanco)])),
  insert('etapa_dependencias', ['etapa_id', 'depende_de_id'],
    ex.etapas.flatMap((e) => e.dependeDe.map((d) => [id(e.id), id(d)]))),
  insert('itens_orcamento', ['id', 'etapa_id', 'codigo', 'descricao', 'unidade', 'quantidade', 'material_unitario', 'mao_de_obra_unitario'],
    ex.itens.map((i) => [id(i.id), id(i.etapaId), txt(i.codigo), txt(i.descricao), txt(i.unidade), num(i.quantidade), num(i.materialUnitario), num(i.maoDeObraUnitario)])),
  insert('lancamentos', ['id', 'obra_id', 'etapa_id', 'data', 'descricao', 'tipo', 'valor'],
    ex.lancamentos.map((l) => [id(l.id), id(l.obraId), id(l.etapaId), txt(l.data), txt(l.descricao), txt(l.tipo), num(l.valor)])),
  insert('modelos_bdi', ['id', 'nome', 'indiretos', 'sobre_preco'],
    ex.modelosBDI.map((m) => [id(m.id), txt(m.nome), json(m.indiretos), json(m.sobrePreco)])),
]

const sql = `-- ARQUIVO GERADO por scripts/gerar-seed.ts a partir de src/data/exemplo.ts. Não edite à mão.
--
-- Copia as obras fictícias para o usuário logado:
--   select public.carregar_dados_exemplo();

create or replace function public.carregar_dados_exemplo()
returns void
language sql
security invoker
set search_path = public
as $$
${partes.join('\n')}$$;

grant execute on function public.carregar_dados_exemplo() to authenticated;
`

const destino = 'supabase/migrations/20261022000100_dados_exemplo.sql'
writeFileSync(destino, sql)
console.log(`Gerado ${destino}`)
