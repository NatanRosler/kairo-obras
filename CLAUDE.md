# Kairo Obras — instruções para assistentes de código

- Interface e nomes do domínio em português do Brasil (obra, etapa, equipe, lançamento). README em inglês.
- **Telas não fazem conta.** Todo cálculo fica em `src/engine` (funções puras) ou `src/domain`, sempre com teste em Vitest.
- O autor está aprendendo TypeScript e constrói as telas ele mesmo: ao revisar, explique o porquê e compare com Python quando ajudar; não reescreva telas inteiras sem ele pedir.
- Datas são strings ISO (`AAAA-MM-DD`) calculadas em UTC; nunca use `new Date('2026-07-20')` direto numa tela.
- Ao mudar `src/data/exemplo.ts`, rode `npm run gerar:seed` para atualizar o SQL dos dados de exemplo.
- Antes de commitar: `npm run typecheck && npm run lint && npm test`.
- Protótipo visual de referência: canvas "Sistema de Obras — telas" (cores em `src/index.css`).
