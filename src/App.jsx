import React from 'react'
import toast from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'

const App = () => {
  return ( 
    <div className='relative min-h-screen w-full'>
      <div className='absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]' />
      <div className='relative z-10'>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} /> 
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
    </div>
  )
}

export default App