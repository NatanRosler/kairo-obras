-- ARQUIVO GERADO por scripts/gerar-seed.ts a partir de src/data/exemplo.ts. Não edite à mão.
--
-- Copia as obras fictícias para o usuário logado:
--   select public.carregar_dados_exemplo();

create or replace function public.carregar_dados_exemplo()
returns void
language sql
security invoker
set search_path = public
as $$
insert into public.obras (id, nome, descricao, inicio, status, bdi_percentual, jornada_horas, dias_parados) values
  (md5(auth.uid()::text || ':obra-a')::uuid, 'Residência Modelo A', 'Casa térrea · 140 m²', '2026-07-20', 'execucao', 21.5, 8, '{}'::date[]),
  (md5(auth.uid()::text || ':obra-b')::uuid, 'Residência Modelo B', 'Sobrado · 210 m²', '2026-09-14', 'execucao', 22, 8, '{}'::date[]),
  (md5(auth.uid()::text || ':obra-c')::uuid, 'Galpão Modelo C', 'Galpão · 600 m²', '2027-01-11', 'orcamento', 18.59, 8, '{}'::date[]),
  (md5(auth.uid()::text || ':obra-d')::uuid, 'Reforma Modelo D', 'Reforma · 85 m²', '2026-03-03', 'concluida', 26.93, 8, '{}'::date[])
on conflict do nothing;

insert into public.equipes (id, nome, composicao, pessoas, custo_dia) values
  (md5(auth.uid()::text || ':ped')::uuid, 'Pedreiros', '1 encarregado + 3 pedreiros', 4, 1120),
  (md5(auth.uid()::text || ':azu')::uuid, 'Azulejistas', '3 azulejistas', 3, 840),
  (md5(auth.uid()::text || ':ele')::uuid, 'Eletricistas', '2 eletricistas', 2, 620),
  (md5(auth.uid()::text || ':enc')::uuid, 'Encanadores', '2 encanadores', 2, 600),
  (md5(auth.uid()::text || ':car')::uuid, 'Carpinteiros (telhado)', '1 encarregado + 2 carpinteiros', 3, 840),
  (md5(auth.uid()::text || ':pin')::uuid, 'Pintores', '3 pintores', 3, 750),
  (md5(auth.uid()::text || ':arm')::uuid, 'Armadores', '1 encarregado + 3 armadores', 4, 1180)
on conflict do nothing;

insert into public.servicos (id, codigo, categoria, descricao, unidade, material_unitario, mao_de_obra_unitario, produtividade_referencia_hh) values
  (md5(auth.uid()::text || ':INI-001')::uuid, 'INI-001', 'Estrutura e fundação', 'Limpeza e locação da obra', 'm²', 49.2, 32.8, 0.12),
  (md5(auth.uid()::text || ':TER-001')::uuid, 'TER-001', 'Estrutura e fundação', 'Escavação de solo', 'm³', 91.33, 60.89, 1.6),
  (md5(auth.uid()::text || ':FUN-001')::uuid, 'FUN-001', 'Estrutura e fundação', 'Estaca pré-moldada de concreto', 'm', 104, 69.33, 0.9),
  (md5(auth.uid()::text || ':EST-001')::uuid, 'EST-001', 'Estrutura e fundação', 'Concreto armado (forma + armação + concreto)', 'm³', 1690.71, 1127.14, 22),
  (md5(auth.uid()::text || ':EST-002')::uuid, 'EST-002', 'Estrutura e fundação', 'Verga de concreto armado', 'm', 86.25, 65, 0.6),
  (md5(auth.uid()::text || ':ALV-001')::uuid, 'ALV-001', 'Alvenaria', 'Alvenaria de bloco de concreto esp. 15 cm', 'm²', 58, 32, 1.1),
  (md5(auth.uid()::text || ':ALV-002')::uuid, 'ALV-002', 'Alvenaria', 'Alvenaria de tijolos furados esp. 15 cm', 'm²', 42, 30, 1.1),
  (md5(auth.uid()::text || ':COB-001')::uuid, 'COB-001', 'Cobertura', 'Estrutura de madeira + telha fibrocimento 6 mm', 'm²', 108, 72, 0.9),
  (md5(auth.uid()::text || ':INS-001')::uuid, 'INS-001', 'Instalações', 'Ponto elétrico completo', 'pt', 153.47, 102.32, 1.5),
  (md5(auth.uid()::text || ':INS-002')::uuid, 'INS-002', 'Instalações', 'Ponto hidráulico completo', 'pt', 344.21, 229.47, 3),
  (md5(auth.uid()::text || ':IMP-001')::uuid, 'IMP-001', 'Acabamento', 'Impermeabilização com manta 4 mm', 'm²', 79, 52.67, 0.8),
  (md5(auth.uid()::text || ':ACA-001')::uuid, 'ACA-001', 'Acabamento', 'Chapisco + reboco', 'm²', 26.53, 17.68, 0.82),
  (md5(auth.uid()::text || ':ACA-002')::uuid, 'ACA-002', 'Acabamento', 'Forro de PVC', 'm²', 42, 28, 0.6),
  (md5(auth.uid()::text || ':ACA-003')::uuid, 'ACA-003', 'Acabamento', 'Piso cerâmico 45×45', 'm²', 110, 73.33, 1),
  (md5(auth.uid()::text || ':ACA-004')::uuid, 'ACA-004', 'Acabamento', 'Pintura acrílica (2 demãos)', 'm²', 13.07, 8.71, 0.45),
  (md5(auth.uid()::text || ':ESQ-001')::uuid, 'ESQ-001', 'Acabamento', 'Instalação de portas e janelas', 'pç', 835.38, 556.92, 3),
  (md5(auth.uid()::text || ':LOU-001')::uuid, 'LOU-001', 'Instalações', 'Instalação de louças e metais', 'pç', 420, 280, 2),
  (md5(auth.uid()::text || ':LIM-001')::uuid, 'LIM-001', 'Acabamento', 'Limpeza final da obra', 'm²', 13.71, 9.14, 0.2)
on conflict do nothing;

insert into public.medicoes_produtividade (id, servico_id, obra_id, data, produtividade_hh) values
  (md5(auth.uid()::text || ':med-1')::uuid, md5(auth.uid()::text || ':ACA-001')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, '2026-04-30', 0.78),
  (md5(auth.uid()::text || ':med-2')::uuid, md5(auth.uid()::text || ':ACA-001')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, '2026-10-20', 0.73),
  (md5(auth.uid()::text || ':med-3')::uuid, md5(auth.uid()::text || ':ACA-004')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, '2026-05-25', 0.4)
on conflict do nothing;

insert into public.etapas (id, obra_id, ordem, nome, servico_guia_id, quantidade, equipe_id, pessoas, avanco) values
  (md5(auth.uid()::text || ':a01')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 1, 'Serviços iniciais', md5(auth.uid()::text || ':INI-001')::uuid, 300, md5(auth.uid()::text || ':ped')::uuid, 2, 1),
  (md5(auth.uid()::text || ':a02')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 2, 'Movimento de terra', md5(auth.uid()::text || ':TER-001')::uuid, 45, md5(auth.uid()::text || ':arm')::uuid, 2, 1),
  (md5(auth.uid()::text || ':a03')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 3, 'Fundação', md5(auth.uid()::text || ':FUN-001')::uuid, 180, md5(auth.uid()::text || ':arm')::uuid, 3, 1),
  (md5(auth.uid()::text || ':a04')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 4, 'Estrutura em concreto', md5(auth.uid()::text || ':EST-001')::uuid, 28, md5(auth.uid()::text || ':arm')::uuid, 4, 1),
  (md5(auth.uid()::text || ':a05')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 5, 'Paredes', md5(auth.uid()::text || ':ALV-001')::uuid, 380, md5(auth.uid()::text || ':ped')::uuid, 4, 1),
  (md5(auth.uid()::text || ':a06')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 6, 'Cobertura', md5(auth.uid()::text || ':COB-001')::uuid, 165, md5(auth.uid()::text || ':car')::uuid, 3, 1),
  (md5(auth.uid()::text || ':a07')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 7, 'Instalações elétricas', md5(auth.uid()::text || ':INS-001')::uuid, 95, md5(auth.uid()::text || ':ele')::uuid, 2, 1),
  (md5(auth.uid()::text || ':a08')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 8, 'Hidráulica', md5(auth.uid()::text || ':INS-002')::uuid, 38, md5(auth.uid()::text || ':enc')::uuid, 2, 1),
  (md5(auth.uid()::text || ':a09')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 9, 'Impermeabilização', md5(auth.uid()::text || ':IMP-001')::uuid, 60, md5(auth.uid()::text || ':azu')::uuid, 2, 1),
  (md5(auth.uid()::text || ':a10')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 10, 'Revestimento de paredes', md5(auth.uid()::text || ':ACA-001')::uuid, 760, md5(auth.uid()::text || ':ped')::uuid, 4, 0.5),
  (md5(auth.uid()::text || ':a11')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 11, 'Forros', md5(auth.uid()::text || ':ACA-002')::uuid, 140, md5(auth.uid()::text || ':car')::uuid, 2, 0),
  (md5(auth.uid()::text || ':a12')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 12, 'Pisos', md5(auth.uid()::text || ':ACA-003')::uuid, 150, md5(auth.uid()::text || ':azu')::uuid, 3, 0),
  (md5(auth.uid()::text || ':a13')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 13, 'Esquadrias', md5(auth.uid()::text || ':ESQ-001')::uuid, 26, md5(auth.uid()::text || ':car')::uuid, 2, 0),
  (md5(auth.uid()::text || ':a14')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 14, 'Louças e metais', md5(auth.uid()::text || ':LOU-001')::uuid, 22, md5(auth.uid()::text || ':enc')::uuid, 1, 0),
  (md5(auth.uid()::text || ':a15')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 15, 'Pinturas', md5(auth.uid()::text || ':ACA-004')::uuid, 900, md5(auth.uid()::text || ':pin')::uuid, 3, 0),
  (md5(auth.uid()::text || ':a16')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, 16, 'Limpeza da obra', md5(auth.uid()::text || ':LIM-001')::uuid, 140, md5(auth.uid()::text || ':ped')::uuid, 2, 0),
  (md5(auth.uid()::text || ':b01')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 1, 'Fundação', md5(auth.uid()::text || ':FUN-001')::uuid, 260, md5(auth.uid()::text || ':arm')::uuid, 3, 1),
  (md5(auth.uid()::text || ':b02')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 2, 'Estrutura em concreto', md5(auth.uid()::text || ':EST-001')::uuid, 34, md5(auth.uid()::text || ':arm')::uuid, 4, 0.75),
  (md5(auth.uid()::text || ':b03')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 3, 'Paredes', md5(auth.uid()::text || ':ALV-001')::uuid, 560, md5(auth.uid()::text || ':ped')::uuid, 4, 0),
  (md5(auth.uid()::text || ':b04')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 4, 'Cobertura', md5(auth.uid()::text || ':COB-001')::uuid, 230, md5(auth.uid()::text || ':car')::uuid, 3, 0),
  (md5(auth.uid()::text || ':b05')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 5, 'Instalações elétricas', md5(auth.uid()::text || ':INS-001')::uuid, 120, md5(auth.uid()::text || ':ele')::uuid, 2, 0),
  (md5(auth.uid()::text || ':b06')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, 6, 'Hidráulica', md5(auth.uid()::text || ':INS-002')::uuid, 52, md5(auth.uid()::text || ':enc')::uuid, 2, 0),
  (md5(auth.uid()::text || ':c01')::uuid, md5(auth.uid()::text || ':obra-c')::uuid, 1, 'Fundação', md5(auth.uid()::text || ':FUN-001')::uuid, 620, md5(auth.uid()::text || ':arm')::uuid, 4, 0),
  (md5(auth.uid()::text || ':c02')::uuid, md5(auth.uid()::text || ':obra-c')::uuid, 2, 'Estrutura em concreto', md5(auth.uid()::text || ':EST-001')::uuid, 140, md5(auth.uid()::text || ':arm')::uuid, 4, 0),
  (md5(auth.uid()::text || ':c03')::uuid, md5(auth.uid()::text || ':obra-c')::uuid, 3, 'Cobertura', md5(auth.uid()::text || ':COB-001')::uuid, 640, md5(auth.uid()::text || ':car')::uuid, 3, 0),
  (md5(auth.uid()::text || ':d01')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, 1, 'Paredes', md5(auth.uid()::text || ':ALV-002')::uuid, 60, md5(auth.uid()::text || ':ped')::uuid, 2, 1),
  (md5(auth.uid()::text || ':d02')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, 2, 'Revestimento de paredes', md5(auth.uid()::text || ':ACA-001')::uuid, 200, md5(auth.uid()::text || ':ped')::uuid, 2, 1),
  (md5(auth.uid()::text || ':d03')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, 3, 'Pinturas', md5(auth.uid()::text || ':ACA-004')::uuid, 300, md5(auth.uid()::text || ':pin')::uuid, 2, 1)
on conflict do nothing;

insert into public.etapa_dependencias (etapa_id, depende_de_id) values
  (md5(auth.uid()::text || ':a02')::uuid, md5(auth.uid()::text || ':a01')::uuid),
  (md5(auth.uid()::text || ':a03')::uuid, md5(auth.uid()::text || ':a02')::uuid),
  (md5(auth.uid()::text || ':a04')::uuid, md5(auth.uid()::text || ':a03')::uuid),
  (md5(auth.uid()::text || ':a05')::uuid, md5(auth.uid()::text || ':a04')::uuid),
  (md5(auth.uid()::text || ':a06')::uuid, md5(auth.uid()::text || ':a05')::uuid),
  (md5(auth.uid()::text || ':a07')::uuid, md5(auth.uid()::text || ':a05')::uuid),
  (md5(auth.uid()::text || ':a08')::uuid, md5(auth.uid()::text || ':a05')::uuid),
  (md5(auth.uid()::text || ':a09')::uuid, md5(auth.uid()::text || ':a04')::uuid),
  (md5(auth.uid()::text || ':a10')::uuid, md5(auth.uid()::text || ':a07')::uuid),
  (md5(auth.uid()::text || ':a10')::uuid, md5(auth.uid()::text || ':a08')::uuid),
  (md5(auth.uid()::text || ':a11')::uuid, md5(auth.uid()::text || ':a06')::uuid),
  (md5(auth.uid()::text || ':a11')::uuid, md5(auth.uid()::text || ':a10')::uuid),
  (md5(auth.uid()::text || ':a12')::uuid, md5(auth.uid()::text || ':a10')::uuid),
  (md5(auth.uid()::text || ':a12')::uuid, md5(auth.uid()::text || ':a09')::uuid),
  (md5(auth.uid()::text || ':a13')::uuid, md5(auth.uid()::text || ':a12')::uuid),
  (md5(auth.uid()::text || ':a14')::uuid, md5(auth.uid()::text || ':a12')::uuid),
  (md5(auth.uid()::text || ':a15')::uuid, md5(auth.uid()::text || ':a11')::uuid),
  (md5(auth.uid()::text || ':a15')::uuid, md5(auth.uid()::text || ':a13')::uuid),
  (md5(auth.uid()::text || ':a16')::uuid, md5(auth.uid()::text || ':a15')::uuid),
  (md5(auth.uid()::text || ':a16')::uuid, md5(auth.uid()::text || ':a14')::uuid),
  (md5(auth.uid()::text || ':b02')::uuid, md5(auth.uid()::text || ':b01')::uuid),
  (md5(auth.uid()::text || ':b03')::uuid, md5(auth.uid()::text || ':b02')::uuid),
  (md5(auth.uid()::text || ':b04')::uuid, md5(auth.uid()::text || ':b03')::uuid),
  (md5(auth.uid()::text || ':b05')::uuid, md5(auth.uid()::text || ':b03')::uuid),
  (md5(auth.uid()::text || ':b06')::uuid, md5(auth.uid()::text || ':b03')::uuid),
  (md5(auth.uid()::text || ':c02')::uuid, md5(auth.uid()::text || ':c01')::uuid),
  (md5(auth.uid()::text || ':c03')::uuid, md5(auth.uid()::text || ':c02')::uuid),
  (md5(auth.uid()::text || ':d02')::uuid, md5(auth.uid()::text || ':d01')::uuid),
  (md5(auth.uid()::text || ':d03')::uuid, md5(auth.uid()::text || ':d02')::uuid)
on conflict do nothing;

insert into public.itens_orcamento (id, etapa_id, codigo, descricao, unidade, quantidade, material_unitario, mao_de_obra_unitario) values
  (md5(auth.uid()::text || ':a01-1')::uuid, md5(auth.uid()::text || ':a01')::uuid, '1.1', 'Limpeza e locação da obra', 'm²', 300, 49.2, 32.8),
  (md5(auth.uid()::text || ':a02-1')::uuid, md5(auth.uid()::text || ':a02')::uuid, '2.1', 'Escavação de solo', 'm³', 45, 91.33, 60.89),
  (md5(auth.uid()::text || ':a03-1')::uuid, md5(auth.uid()::text || ':a03')::uuid, '3.1', 'Estaca pré-moldada de concreto', 'm', 180, 104, 69.33),
  (md5(auth.uid()::text || ':a04-1')::uuid, md5(auth.uid()::text || ':a04')::uuid, '4.1', 'Concreto armado (forma + armação + concreto)', 'm³', 28, 1690.71, 1127.14),
  (md5(auth.uid()::text || ':a05-1')::uuid, md5(auth.uid()::text || ':a05')::uuid, '5.1', 'Alvenaria de bloco de concreto esp. 15 cm', 'm²', 210, 58, 32),
  (md5(auth.uid()::text || ':a05-2')::uuid, md5(auth.uid()::text || ':a05')::uuid, '5.2', 'Alvenaria de tijolos furados esp. 15 cm', 'm²', 170, 42, 30),
  (md5(auth.uid()::text || ':a05-3')::uuid, md5(auth.uid()::text || ':a05')::uuid, '5.3', 'Verga de concreto armado', 'm', 48, 86.25, 65),
  (md5(auth.uid()::text || ':a06-1')::uuid, md5(auth.uid()::text || ':a06')::uuid, '6.1', 'Estrutura de madeira + telha fibrocimento 6 mm', 'm²', 165, 108, 72),
  (md5(auth.uid()::text || ':a07-1')::uuid, md5(auth.uid()::text || ':a07')::uuid, '7.1', 'Ponto elétrico completo', 'pt', 95, 153.47, 102.32),
  (md5(auth.uid()::text || ':a08-1')::uuid, md5(auth.uid()::text || ':a08')::uuid, '8.1', 'Ponto hidráulico completo', 'pt', 38, 344.21, 229.47),
  (md5(auth.uid()::text || ':a09-1')::uuid, md5(auth.uid()::text || ':a09')::uuid, '9.1', 'Impermeabilização com manta 4 mm', 'm²', 60, 79, 52.67),
  (md5(auth.uid()::text || ':a10-1')::uuid, md5(auth.uid()::text || ':a10')::uuid, '10.1', 'Chapisco + reboco', 'm²', 760, 26.53, 17.68),
  (md5(auth.uid()::text || ':a11-1')::uuid, md5(auth.uid()::text || ':a11')::uuid, '11.1', 'Forro de PVC', 'm²', 140, 42, 28),
  (md5(auth.uid()::text || ':a12-1')::uuid, md5(auth.uid()::text || ':a12')::uuid, '12.1', 'Piso cerâmico 45×45', 'm²', 150, 110, 73.33),
  (md5(auth.uid()::text || ':a13-1')::uuid, md5(auth.uid()::text || ':a13')::uuid, '13.1', 'Instalação de portas e janelas', 'pç', 26, 835.38, 556.92),
  (md5(auth.uid()::text || ':a14-1')::uuid, md5(auth.uid()::text || ':a14')::uuid, '14.1', 'Instalação de louças e metais', 'pç', 22, 420, 280),
  (md5(auth.uid()::text || ':a15-1')::uuid, md5(auth.uid()::text || ':a15')::uuid, '15.1', 'Pintura acrílica (2 demãos)', 'm²', 900, 13.07, 8.71),
  (md5(auth.uid()::text || ':a16-1')::uuid, md5(auth.uid()::text || ':a16')::uuid, '16.1', 'Limpeza final da obra', 'm²', 140, 13.71, 9.14),
  (md5(auth.uid()::text || ':b01-1')::uuid, md5(auth.uid()::text || ':b01')::uuid, '1.1', 'Estaca pré-moldada de concreto', 'm', 260, 104, 69.33),
  (md5(auth.uid()::text || ':b02-1')::uuid, md5(auth.uid()::text || ':b02')::uuid, '2.1', 'Concreto armado (forma + armação + concreto)', 'm³', 34, 1690.71, 1127.14),
  (md5(auth.uid()::text || ':b03-1')::uuid, md5(auth.uid()::text || ':b03')::uuid, '3.1', 'Alvenaria de bloco de concreto esp. 15 cm', 'm²', 560, 58, 32),
  (md5(auth.uid()::text || ':b04-1')::uuid, md5(auth.uid()::text || ':b04')::uuid, '4.1', 'Estrutura de madeira + telha fibrocimento 6 mm', 'm²', 230, 108, 72),
  (md5(auth.uid()::text || ':b05-1')::uuid, md5(auth.uid()::text || ':b05')::uuid, '5.1', 'Ponto elétrico completo', 'pt', 120, 153.47, 102.32),
  (md5(auth.uid()::text || ':b06-1')::uuid, md5(auth.uid()::text || ':b06')::uuid, '6.1', 'Ponto hidráulico completo', 'pt', 52, 344.21, 229.47),
  (md5(auth.uid()::text || ':c01-1')::uuid, md5(auth.uid()::text || ':c01')::uuid, '1.1', 'Estaca pré-moldada de concreto', 'm', 620, 104, 69.33),
  (md5(auth.uid()::text || ':c02-1')::uuid, md5(auth.uid()::text || ':c02')::uuid, '2.1', 'Concreto armado (forma + armação + concreto)', 'm³', 140, 1690.71, 1127.14),
  (md5(auth.uid()::text || ':c03-1')::uuid, md5(auth.uid()::text || ':c03')::uuid, '3.1', 'Estrutura de madeira + telha fibrocimento 6 mm', 'm²', 640, 108, 72),
  (md5(auth.uid()::text || ':d01-1')::uuid, md5(auth.uid()::text || ':d01')::uuid, '1.1', 'Alvenaria de tijolos furados esp. 15 cm', 'm²', 60, 42, 30),
  (md5(auth.uid()::text || ':d02-1')::uuid, md5(auth.uid()::text || ':d02')::uuid, '2.1', 'Chapisco + reboco', 'm²', 200, 26.53, 17.68),
  (md5(auth.uid()::text || ':d03-1')::uuid, md5(auth.uid()::text || ':d03')::uuid, '3.1', 'Pintura acrílica (2 demãos)', 'm²', 300, 13.07, 8.71)
on conflict do nothing;

insert into public.lancamentos (id, obra_id, etapa_id, data, descricao, tipo, valor) values
  (md5(auth.uid()::text || ':obra-a-l1')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a01')::uuid, '2026-07-22', 'Serviços iniciais — fechamento', 'mao_de_obra', 28700),
  (md5(auth.uid()::text || ':obra-a-l2')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a02')::uuid, '2026-07-29', 'Escavação e bota-fora — fechamento', 'equipamento', 9450),
  (md5(auth.uid()::text || ':obra-a-l3')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a03')::uuid, '2026-08-07', 'Estacas e cravação — fechamento', 'material', 41200),
  (md5(auth.uid()::text || ':obra-a-l4')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a04')::uuid, '2026-09-04', 'Estrutura em concreto — fechamento', 'material', 99300),
  (md5(auth.uid()::text || ':obra-a-l5')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a09')::uuid, '2026-09-10', 'Impermeabilização — fechamento', 'material', 9100),
  (md5(auth.uid()::text || ':obra-a-l6')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a05')::uuid, '2026-09-25', 'Paredes — fechamento', 'material', 45900),
  (md5(auth.uid()::text || ':obra-a-l7')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a07')::uuid, '2026-10-02', 'Instalações elétricas — medições anteriores', 'mao_de_obra', 24420),
  (md5(auth.uid()::text || ':obra-a-l8')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a06')::uuid, '2026-10-06', 'Cobertura — fechamento', 'material', 37100),
  (md5(auth.uid()::text || ':obra-a-l9')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a08')::uuid, '2026-10-07', 'Hidráulica — fechamento', 'material', 27950),
  (md5(auth.uid()::text || ':obra-a-l10')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a07')::uuid, '2026-10-08', 'Fiação e quadros de distribuição', 'material', 4380),
  (md5(auth.uid()::text || ':obra-a-l11')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a10')::uuid, '2026-10-09', 'Equipe de reboco — semana 1', 'mao_de_obra', 5900),
  (md5(auth.uid()::text || ':obra-a-l12')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a10')::uuid, '2026-10-13', 'Telas e cantoneiras', 'material', 1980),
  (md5(auth.uid()::text || ':obra-a-l13')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a10')::uuid, '2026-10-14', 'Chapisco — cimento e areia', 'material', 2140),
  (md5(auth.uid()::text || ':obra-a-l14')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a10')::uuid, '2026-10-16', 'Equipe de reboco — semana 2', 'mao_de_obra', 5900),
  (md5(auth.uid()::text || ':obra-a-l15')::uuid, md5(auth.uid()::text || ':obra-a')::uuid, md5(auth.uid()::text || ':a10')::uuid, '2026-10-21', 'Argamassa usinada — 12 m³', 'material', 6480),
  (md5(auth.uid()::text || ':obra-b-l1')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, md5(auth.uid()::text || ':b01')::uuid, '2026-09-28', 'Fundação — fechamento', 'material', 52400),
  (md5(auth.uid()::text || ':obra-b-l2')::uuid, md5(auth.uid()::text || ':obra-b')::uuid, md5(auth.uid()::text || ':b02')::uuid, '2026-10-16', 'Concreto e aço — parcial', 'material', 61200),
  (md5(auth.uid()::text || ':obra-d-l1')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, md5(auth.uid()::text || ':d01')::uuid, '2026-03-13', 'Paredes — fechamento', 'material', 5600),
  (md5(auth.uid()::text || ':obra-d-l2')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, md5(auth.uid()::text || ':d02')::uuid, '2026-04-30', 'Revestimento — fechamento', 'material', 11200),
  (md5(auth.uid()::text || ':obra-d-l3')::uuid, md5(auth.uid()::text || ':obra-d')::uuid, md5(auth.uid()::text || ':d03')::uuid, '2026-05-29', 'Pinturas — fechamento', 'material', 8300)
on conflict do nothing;

insert into public.modelos_bdi (id, nome, indiretos, sobre_preco) values
  (md5(auth.uid()::text || ':bdi-residencial')::uuid, 'Residencial padrão', '{"Administração central":3,"Administração local":0,"Despesas indiretas":0.4,"Despesa financeira":0.8,"Pós-obra":0.4,"Risco":0.8}'::jsonb, '{"Impostos (PIS, COFINS, ISS)":6.65,"Margem de lucro":6.1,"Seguro":0.5,"Reserva técnica":0}'::jsonb),
  (md5(auth.uid()::text || ':bdi-galpao')::uuid, 'Galpão', '{"Administração central":2.5,"Administração local":0,"Despesas indiretas":0.3,"Despesa financeira":0.6,"Pós-obra":0.3,"Risco":0.6}'::jsonb, '{"Impostos (PIS, COFINS, ISS)":6.65,"Margem de lucro":5,"Seguro":0.4,"Reserva técnica":0}'::jsonb),
  (md5(auth.uid()::text || ':bdi-reforma')::uuid, 'Reforma', '{"Administração central":4,"Administração local":0,"Despesas indiretas":0.6,"Despesa financeira":1,"Pós-obra":0.6,"Risco":1.5}'::jsonb, '{"Impostos (PIS, COFINS, ISS)":6.65,"Margem de lucro":8,"Seguro":0.5,"Reserva técnica":0}'::jsonb)
on conflict do nothing;
$$;

grant execute on function public.carregar_dados_exemplo() to authenticated;
