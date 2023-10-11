import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './component/Header.js';
import Home from './component/Home';
import Community from './component/Community';
import Write from './component/Write';
import Singup from './component/Singup';
import Login from './component/Login';
import CommunityDetail from './component/CommunityDetail';

function App() {
  return (
    <div className="App">
      <Header />

      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/store" element={<div>Store</div>} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/write" element={<Write />} />
          <Route path="/singup" element={<Singup />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<div>404!!</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
