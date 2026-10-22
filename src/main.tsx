import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import { DadosProvider } from '@/app/dados'
import { Layout } from '@/components/Layout'
import { VisaoGeral } from '@/pages/VisaoGeral'
import { BDI, Base, Cronograma, Custos, Equipes, Orcamento, TodasObras } from '@/pages/telas'
import { PaginaNaoEncontrada } from '@/pages/ObraNaoEncontrada'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/obras" replace /> },
      { path: '/obras', element: <TodasObras /> },
      { path: '/obras/:obraId', element: <VisaoGeral /> },
      { path: '/obras/:obraId/orcamento', element: <Orcamento /> },
      { path: '/obras/:obraId/cronograma', element: <Cronograma /> },
      { path: '/obras/:obraId/custos', element: <Custos /> },
      { path: '/obras/:obraId/bdi', element: <BDI /> },
      { path: '/base', element: <Base /> },
      { path: '/equipes', element: <Equipes /> },
      { path: '*', element: <PaginaNaoEncontrada /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DadosProvider>
      <RouterProvider router={router} />
    </DadosProvider>
  </StrictMode>,
)
