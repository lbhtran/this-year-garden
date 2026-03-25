import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { ClerkAuthBridge } from './contexts/AuthContext.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

const root = document.getElementById('root')!

createRoot(root).render(
  <StrictMode>
    {publishableKey ? (
      <ClerkProvider publishableKey={publishableKey}>
        <ClerkAuthBridge>
          <App />
        </ClerkAuthBridge>
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
