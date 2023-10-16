import React, { useEffect, useState } from 'react';
import '../css/header.css';
import '../css/initial.css';
import Logo from '../assets/img/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const { nickName, setNickName } = props;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('loginToken');
    // 새로고침 하면 헤더 정보 업데이트
    // eslint-disable-next-line no-restricted-globals
    location.reload();
    navigate('/home');
  };

  return (
    <>
      <header className="header">
        <div className="header_logo">
          <a href="/home">
            <img src={Logo} alt="logo" className="header_logo_img" />
          </a>
        </div>
        <div className="header_center">
          <div className="header_center_name">
            <a href="/home">
              <p>푸바오 팬카페</p>
            </a>
          </div>
          <div className="header_center_menu">
            <ul className="header_center_menu_ul">
              <a href="/home">
                <li>HOME</li>
              </a>
              <a href="/about">
                <li>ABOUT</li>
              </a>
              <a href="/community">
                <li>COMMUNITY</li>
              </a>
            </ul>
          </div>
        </div>

        {nickName != '' ? (
          <div className="header_user">
            <button className="header_user_signup">
              <a href="#">
                <p>{nickName}</p>
              </a>
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="header_user_login"
            >
              <p>로그아웃</p>
            </button>
          </div>
        ) : (
          <div className="header_user">
            <div className="header_user_signup">
              <a href="/singup">
                <p>회원가입</p>
              </a>
            </div>
            <div className="header_user_login">
              <a href="/login">
                <p>로그인</p>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
