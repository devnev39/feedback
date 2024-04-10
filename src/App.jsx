import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Feedback from './pages/Feedback'
import About from './pages/About'
import Navbar from './components/Navbar'
import IAM from './pages/IAM'

function App() {
  return (
   <>
    <Navbar />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/about' element={<About />} />
        <Route path='/iam' element={<IAM />} />
      </Routes>
    </BrowserRouter>
   </> 
  )
}

export default App
