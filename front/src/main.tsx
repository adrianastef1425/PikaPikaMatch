import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { VotingProvider } from './context/VotingContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VotingProvider>
      <App />
    </VotingProvider>
  </StrictMode>,
)
