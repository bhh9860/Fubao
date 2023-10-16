import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './component/Header.js';
import Home from './component/Home';
import Community from './component/Community';
import Write from './component/Write';
import Singup from './component/Singup';
import Login from './component/Login';
import CommunityDetail from './component/CommunityDetail';
import About from './component/About';
import { useEffect, useState } from 'react';
import axios from 'axios';
function App() {
  const [nickName, setNickName] = useState('');
  const [reload, setReload] = useState(false);

  const token = localStorage.getItem('loginToken');
  useEffect(() => {
    token
      ? axios
          .post(`${process.env.REACT_APP_API_LOCALURL}/token`, { token })
          .then((res) => {
            setNickName(res.data.nickName);
          })
          .catch((err) => {
            if (err.response.status == 401) {
              localStorage.removeItem('loginToken');
            }
            setNickName('');
          })
      : console.log('로그인안됨');
  }, [reload]);

  console.log(reload);
  return (
    <div className="App">
      <Router>
        <Header nickName={nickName} setNickName={setNickName} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/write" element={<Write nickName={nickName} />} />
          <Route path="/singup" element={<Singup />} />
          <Route path="/login" element={<Login reload={reload} setReload={setReload} />} />

          <Route path="*" element={<div>404!!</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
