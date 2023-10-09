import React from 'react';
import '../css/header.css';
import '../css/initial.css';
import Logo from '../assets/img/logo.png';

const header = () => {
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
              <a href="/store">
                <li>STORE</li>
              </a>
              <a href="/community">
                <li>COMMUNITY</li>
              </a>
            </ul>
          </div>
        </div>
        <div className="header_user">
          <div className="header_user_signup">
            <a href="/singup">
              <p>Sign Up</p>
            </a>
          </div>
          <div className="header_user_login">
            <a href="/login">
              <p>Login</p>
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default header;
