import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render without StrictMode in development for better HMR performance
// StrictMode causes double-rendering which can trigger full page reloads
ReactDOM.createRoot(document.getElementById('root')!).render(
  import.meta.env.DEV ? <App /> : (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
)
