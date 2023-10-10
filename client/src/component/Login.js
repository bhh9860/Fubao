import React, { useState } from 'react';
import '../css/initial.css';
import '../css/common.css';
import '../css/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function check(email, pw) {
    const trimEmail = email.trim();
    const trimPw = pw.trim();

    if (!trimEmail.length) {
      return '이메일을 입력해주세요';
    }

    if (!trimPw.length) {
      return '비밀번호를 입력해주세요';
    }

    return false;
  }

  function handleLogin() {
    const alertText = check(email, pw);
    // alertText가 있으면 에러메세지 출력
    if (alertText) {
      setErrorMessage(alertText);
    } else {
      axios
        .post(`${process.env.REACT_APP_API_LOCALURL}/Login`, {
          email: email,
          pw: pw,
        })
        .then((res) => {
          console.log('로그인 성공');
          navigate('/home');
        })
        .catch((err) => {
          if (err.response.status == 401) {
            console.log('일치하는 회원정보가 없습니다.');
            setErrorMessage('일치하는 회원정보가 없습니다.');
          }
        });
    }
  }

  return (
    <div className="container">
      <div classNmae="menu_title">
        <h1>로그인</h1>
      </div>
      <div className="loginInput_container">
        <div className="loginInput_id">
          <input
            type="text"
            placeholder="이메일"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className="loginInput_pw">
          <input
            type="password"
            placeholder="비밀번호"
            onChange={(e) => {
              setPw(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          ></input>
        </div>
        <div className="errorMessage">{errorMessage}</div>
        <div className="loginButton_container">
          <button
            className="loginButton"
            onClick={() => {
              handleLogin();
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
