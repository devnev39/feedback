import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Feedback from './pages/Feedback'
import About from './pages/About'
import Navbar from './components/Navbar'

function App() {
  return (
   <>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
   </> 
  )
}

export default App
