# Roteiro de construção das telas

A base está pronta: motor de cálculo testado, banco de dados, dados de exemplo, menu com o
seletor de obra e as rotas. Cada tela hoje mostra um cartão "Tela em construção" dizendo o que
construir e quais funções usar. O protótipo aprovado (canvas "Sistema de Obras — telas") é a
referência visual.

## Como uma tela funciona

A **Visão geral** (`src/pages/VisaoGeral.tsx`) já tem os indicadores prontos e serve de modelo:

1. **Pegar os dados:** `const { dados } = useDados()` e `const obra = useObraAtual()`.
2. **Calcular com as funções prontas** (dentro de `useMemo`): `cronogramaDaObra(...)`, `custosDaObra(...)`.
   A tela nunca faz conta sozinha. Se precisar de um cálculo novo, ele vai em `src/domain` com teste.
3. **Formatar** com `src/lib/formato.ts`: `brl`, `brlInteiro`, `percentual`, `diaMes`...
4. **Cores e fontes** pelas classes do Tailwind definidas em `src/index.css`
   (`bg-cartao`, `text-apagado`, `border-borda`, `bg-laranja`, `font-mono`...).

Ao começar uma tela, mova-a de `src/pages/telas.tsx` para um arquivo próprio e apague o `<PaginaGuia>`.

## Ordem sugerida

Da mais simples para a mais difícil, para o TypeScript ir ficando natural:

| # | Tela | O que você treina |
|---|---|---|
| 1 | Visão geral (completar) | listas com `.map`, tabela, componentes pequenos |
| 2 | Orçamento | estado de seleção com `useState`, painel que muda conforme o clique |
| 3 | Base de preços | busca e filtro, `useMemo` com dependências |
| 4 | Cálculo do BDI | formulário controlado, `onChange`, conversão de texto em número |
| 5 | Orçado × real | gráfico em SVG, formulário que grava (`repositorio.adicionarLancamento`) |
| 6 | Cronograma | Gantt com posições calculadas, simulação de equipe com `pessoasSimuladas` |
| 7 | Todas as obras | combinar cálculos de várias obras |
| 8 | Equipes | `encontrarConflitos`, agenda semanal |

## Comandos

```bash
npm run dev          # app em modo demonstração
npm test             # testes do motor e do domínio
npm run typecheck    # erros de tipo
npm run lint         # padrões de código
npm run gerar:seed   # depois de mudar src/data/exemplo.ts, regenera o SQL dos dados de exemplo
```

## Depois das telas

- [ ] Login com Supabase Auth (e-mail) e botão "carregar obras de exemplo" para contas novas.
- [ ] Criar e editar obras, etapas, itens e equipes (hoje o repositório só grava lançamentos e etapas).
- [ ] Impedir no banco que uma etapa aponte para serviço ou equipe de outro usuário
      (hoje o RLS protege leitura e escrita, mas a chave estrangeira não confere o dono).
- [ ] Importar a planilha .xlsx original.
- [ ] Publicar na Vercel e colocar o link e um print no README.
