import React, { useState } from 'react';
import '../css/initial.css';
import '../css/common.css';
import '../css/singup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Singup = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [nickName, setNickName] = useState('');
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div classNmae="menu_title">
        <h1>회원가입</h1>
      </div>
      <div className="singupInput_container">
        <div className="singupInput_text">
          <h2>
            회원 가입을 위해
            <br />
            정보를 입력해주세요
          </h2>
        </div>
        <div className="singupInput">
          <div className="singupInput_email singupForm">
            <div>* 이메일</div>
            <input
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div className="singupInput_pw singupForm">
            <div>* 비밀번호</div>
            <input
              type="password"
              onChange={(e) => {
                setPw(e.target.value);
              }}
            ></input>
          </div>
          <div className="singupInput_pwCheck singupForm">
            <div>* 비밀번호 확인</div>
            <input
              type="password"
              onChange={(e) => {
                setPwCheck(e.target.value);
              }}
            ></input>
          </div>
          <div className="singupInput_nickName singupForm">
            <div>* 닉네임</div>
            <input
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            ></input>
          </div>
          <div className="singupInput_checkbox">
            <label for="agreeCheckbox">
              <input
                type="checkbox"
                id="agreeCheckbox"
                onChange={(e) => {
                  setAgree(e.target.checked);
                }}
              ></input>{' '}
              이용약관 개인정보 수집 및 이용에 동의합니다.
            </label>
          </div>
          <hr></hr>
          <div className="singupInput_button">
            <button
              onClick={() => {
                if (check(email, pw, pwCheck, nickName, agree)) {
                  axios
                    .post('http://localhost:8000/singup', {
                      email: email,
                      pw: pw,
                      nickName: nickName,
                    })
                    .then((res) => {
                      console.log(res);
                      navigate('/home');
                    })
                    .catch((err) => {
                      if (err.response.data.err === '이메일 중복') {
                        alert('이미 존재하는 이메일입니다');
                      } else if (err.response.data.err === '닉네임 중복') {
                        alert('이미 존재하는 닉네임입니다');
                      }
                    });
                }
              }}
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//입력 형식 검사
const check = (email, pw, pwCheck, nickName, agree) => {
  if (email === '' || pw === '' || pwCheck === '' || nickName === '') {
    alert('빈칸을 모두 입력해주세요');
    return false;
  }
  if (!isValidEmail(email)) {
    alert('이메일 형식이 올바르지 않습니다');
    return false;
  }
  if (pw.trim() !== pwCheck.trim()) {
    alert('비밀번호가 일치하지 않습니다');
    return false;
  }
  if (pw.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다');
    return false;
  }
  if (nickName.length > 10 || nickName.length < 2) {
    alert('닉네임은 2자 이상 10자 이하로 입력해주세요');
    return false;
  }
  if (agree === false) {
    alert('이용약관에 동의해주세요');
    return false;
  }
  return true;
};

//이메일 형식 검사
const isValidEmail = (email) => {
  // 이메일 형식을 정의한 정규 표현식
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  // 정규 표현식을 사용하여 이메일 검사
  return emailRegex.test(email);
};
export default Singup;
