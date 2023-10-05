import React from 'react';
import '../css/home.css';
import Video from '../assets/video/HomeVideo.mp4';

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="home_video">
          <video muted autoPlay loop>
            <source src={Video} type="video/mp4" />
          </video>
        </div>
        <div className="home_text">
          <div className="home_text_title">
            <h1>푸바오 팬카페에 오신 것을 환영합니다 !</h1>
            <h2>즐겁게 놀다가세요 ~</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
