import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { PortalApp } from './portal/PortalApp'
import { readPortalRoute } from './portal/access'
import './style.css'

const RootApplication = readPortalRoute(window.location.search) ? PortalApp : App

createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  <StrictMode>
    <RootApplication />
  </StrictMode>,
)
