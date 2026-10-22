-- Kairo Obras — esquema inicial
--
-- Cada linha pertence a um usuário (owner_id). As políticas de RLS garantem que
-- cada um só vê e altera os próprios dados. O front nunca precisa filtrar por usuário.

create extension if not exists "pgcrypto";

-- Obras --------------------------------------------------------------------
create table public.obras (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome            text not null check (char_length(nome) between 1 and 120),
  descricao       text not null default '',
  inicio          date not null,
  status          text not null default 'orcamento' check (status in ('orcamento', 'execucao', 'concluida')),
  bdi_percentual  numeric(6, 3) not null default 0 check (bdi_percentual >= 0),
  jornada_horas   numeric(4, 2) not null default 8 check (jornada_horas > 0 and jornada_horas <= 24),
  dias_parados    date[] not null default '{}',
  created_at      timestamptz not null default now()
);

-- Equipes (são da empresa e vão de obra em obra) ----------------------------
create table public.equipes (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome        text not null,
  composicao  text not null default '',
  pessoas     integer not null check (pessoas >= 1),
  custo_dia   numeric(12, 2) not null default 0 check (custo_dia >= 0),
  created_at  timestamptz not null default now()
);

-- Base de preços e produtividade (compartilhada entre as obras do usuário) ---
create table public.servicos (
  id                           uuid primary key default gen_random_uuid(),
  owner_id                     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  codigo                       text not null,
  categoria                    text not null,
  descricao                    text not null,
  unidade                      text not null,
  material_unitario            numeric(14, 2) not null default 0 check (material_unitario >= 0),
  mao_de_obra_unitario         numeric(14, 2) not null default 0 check (mao_de_obra_unitario >= 0),
  produtividade_referencia_hh  numeric(10, 4) not null check (produtividade_referencia_hh >= 0),
  created_at                   timestamptz not null default now(),
  unique (owner_id, codigo)
);

create table public.medicoes_produtividade (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  servico_id         uuid not null references public.servicos (id) on delete cascade,
  obra_id            uuid not null references public.obras (id) on delete cascade,
  data               date not null,
  produtividade_hh   numeric(10, 4) not null check (produtividade_hh > 0),
  created_at         timestamptz not null default now()
);

-- Etapas do cronograma ----------------------------------------------------------
create table public.etapas (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  obra_id          uuid not null references public.obras (id) on delete cascade,
  ordem            integer not null,
  nome             text not null,
  servico_guia_id  uuid not null references public.servicos (id) on delete restrict,
  quantidade       numeric(14, 3) not null check (quantidade >= 0),
  equipe_id        uuid not null references public.equipes (id) on delete restrict,
  pessoas          integer not null check (pessoas >= 1),
  avanco           numeric(5, 4) not null default 0 check (avanco between 0 and 1),
  created_at       timestamptz not null default now(),
  unique (obra_id, ordem)
);

-- Dependência "término-início": etapa_id só começa depois que depende_de_id termina.
-- Ciclos são barrados no motor de cálculo (src/engine/cronograma.ts) antes de salvar.
create table public.etapa_dependencias (
  etapa_id       uuid not null references public.etapas (id) on delete cascade,
  depende_de_id  uuid not null references public.etapas (id) on delete cascade,
  owner_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  primary key (etapa_id, depende_de_id),
  check (etapa_id <> depende_de_id)
);

-- Itens do orçamento --------------------------------------------------------------
create table public.itens_orcamento (
  id                    uuid primary key default gen_random_uuid(),
  owner_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  etapa_id              uuid not null references public.etapas (id) on delete cascade,
  codigo                text not null,
  descricao             text not null,
  unidade               text not null,
  quantidade            numeric(14, 3) not null check (quantidade >= 0),
  material_unitario     numeric(14, 2) not null default 0 check (material_unitario >= 0),
  mao_de_obra_unitario  numeric(14, 2) not null default 0 check (mao_de_obra_unitario >= 0),
  created_at            timestamptz not null default now()
);

-- Custos reais ----------------------------------------------------------------------
create table public.lancamentos (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  obra_id     uuid not null references public.obras (id) on delete cascade,
  etapa_id    uuid not null references public.etapas (id) on delete cascade,
  data        date not null,
  descricao   text not null,
  tipo        text not null check (tipo in ('material', 'mao_de_obra', 'equipamento')),
  valor       numeric(14, 2) not null check (valor > 0),
  created_at  timestamptz not null default now()
);

-- Modelos de BDI ---------------------------------------------------------------------
create table public.modelos_bdi (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome         text not null,
  indiretos    jsonb not null default '{}'::jsonb,
  sobre_preco  jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

-- Índices para as consultas mais comuns ------------------------------------------------
create index on public.obras (owner_id);
create index on public.equipes (owner_id);
create index on public.servicos (owner_id);
create index on public.etapas (obra_id);
create index on public.etapas (equipe_id);
create index on public.itens_orcamento (etapa_id);
create index on public.lancamentos (obra_id, data);
create index on public.medicoes_produtividade (servico_id);

-- Row Level Security: cada usuário só enxerga o que é dele ---------------------------
do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'obras', 'equipes', 'servicos', 'medicoes_produtividade', 'etapas',
    'etapa_dependencias', 'itens_orcamento', 'lancamentos', 'modelos_bdi'
  ]
  loop
    execute format('alter table public.%I enable row level security', tabela);
    execute format(
      'create policy "dono acessa os próprios dados" on public.%I
         for all to authenticated
         using (owner_id = (select auth.uid()))
         with check (owner_id = (select auth.uid()))',
      tabela
    );
  end loop;
end
$$;
