import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import ToastContainer from './components/ToastContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <ToastProvider>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
)
