import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Productos } from '../src/components/Productos/Productos';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/productos' element={<Productos/>} />
      </Routes>
    </div>
  );
}

export default App;
