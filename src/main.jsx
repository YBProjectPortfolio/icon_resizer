import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import CreaditsPage from './component/CreditsPage';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/credits' element={<CreaditsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
