import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path='/' element={<App />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
        </>
    )
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>

        <RouterProvider router={router} />
    </StrictMode>
)
