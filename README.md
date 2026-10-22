<p align="center">
  <img src="docs/marca/kairo-obras-logo-claro.svg" alt="Kairo Obras" width="360">
</p>

<p align="center">
  Construction budgeting and scheduling for small builders running several jobs at once.<br>
  <em>Orçamento, cronograma calculado e equipes de várias obras num lugar só.</em>
</p>

---

## Why

Small construction companies in Brazil still plan jobs in spreadsheets. The one this project started from had a 346-line budget, a BDI sheet, a Gantt chart and a cost tracker — but **the schedule was typed in by hand**: someone guessed start and end dates for every task, and the "duration" was just the difference between them.

Kairo Obras **calculates** the schedule instead:

```
work hours   = quantity × productivity (man-hours per unit)
duration     = work hours ÷ (crew size × hours per day)       → rounded up to whole working days
```

Then it runs the **Critical Path Method** over the task dependencies, maps working-day indexes to real dates (weekends, Brazilian national holidays and rain days skipped), and shows which tasks have slack and which ones delay the whole job.

Because crews belong to the company and move between jobs, it also checks every job's schedule together and **flags when the same crew is booked on two sites on the same day**.

## Features

| | Status |
|---|---|
| Duration from quantity × productivity × crew size | ✅ engine + tests |
| Critical path, slack, cycle detection, "not before" constraints | ✅ engine + tests |
| Working-day calendar with national holidays (incl. Good Friday via Easter algorithm) | ✅ engine + tests |
| BDI (overhead and markup) using the same formula as the original spreadsheet | ✅ engine + tests |
| Budget vs. actual using Earned Value (not "spent vs. total budget") | ✅ engine + tests |
| Crew conflicts across jobs | ✅ engine + tests |
| Productivity that learns from measurements on past jobs | ✅ domain + tests |
| Postgres schema with row-level security and owner-scoped foreign keys, idempotent demo data | ✅ live on Supabase |
| Screens: overview, budget, schedule simulator, costs, BDI, price base, crews, all jobs | 🚧 in progress |
| Login with Supabase Auth | 🔜 |

## How it's built

- **React 19 + TypeScript + Vite**, styled with **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + RLS) for persistence — the app also runs fully offline in demo mode with fictional data
- **Vitest** for the calculation engine
- **Vercel** for hosting, **GitHub Actions** for CI (types, lint, tests, build)

```
src/
  engine/   Pure calculation functions. No React, no database. 100% unit tested.
  domain/   Domain types and functions that combine data + engine (schedule of a job, costs of a job).
  data/     Where data comes from: in-memory demo repository or Supabase repository, plus row mapping.
  app/      React context for data and the current job.
  components/, pages/   UI.
supabase/
  migrations/   Schema + RLS, and a generated function that loads the demo data for the logged-in user.
scripts/
  gerar-seed.ts   Generates the demo-data SQL from src/data/exemplo.ts, so the UI and the database never drift.
```

The rule that keeps this maintainable: **screens never do math**. Every number on screen comes from a function in `src/engine` or `src/domain`, and every one of those is tested.

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173 — demo mode, no setup needed
npm test           # engine and domain tests
```

To use a real database, create a Supabase project, run the files in `supabase/migrations/` in order, copy `.env.example` to `.env.local` and fill in the URL and anon key. After signing in, `select public.carregar_dados_exemplo();` loads the demo jobs into your account.

## Versão em português

O **Kairo Obras** nasceu de uma planilha de cronograma e orçamento de obra civil. Na planilha, as datas de cada tarefa eram digitadas à mão; aqui, o prazo é **calculado** a partir da quantidade de cada serviço, da produtividade e do tamanho da equipe, e o caminho crítico mostra quais etapas atrasam a obra. Como as equipes passam de uma obra para outra, o sistema também avisa quando a mesma equipe foi marcada em duas obras no mesmo dia.

Projeto de portfólio de [Natã Rösler](https://github.com/NatanRosler) · produto da **Kairo** — sistemas web sob medida. Todos os dados do repositório são fictícios.

## License

[MIT](LICENSE)
