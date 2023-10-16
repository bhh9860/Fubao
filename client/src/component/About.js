import React, { useEffect, useState } from 'react';
import '../css/initial.css';
import '../css/about.css';

const About = () => {
  const [birth, setBirth] = useState('');

  function calculateTimePassed() {
    // 2020년 7월 20일을 설정
    const startDate = new Date(2020, 6, 20, 21, 49, 0);

    // 현재 날짜와 시간을 가져옵니다.
    const now = new Date();

    // 두 날짜의 차이를 밀리초로 구합니다.
    const differenceInMilliseconds = now - startDate;

    // 밀리초를 일, 시간, 분, 초로 변환합니다.
    let seconds = Math.floor(differenceInMilliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 31);
    let years = Math.floor(months / 12);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 31;
    months = months % 31;
    years = years % 12;

    // 결과를 출력합니다.
    setBirth(`${years}년 ${months}월 ${days}일 ${hours}시간 ${minutes}분 ${seconds}초`);
  }

  useEffect(() => {
    // 함수를 1초마다 호출합니다.
    setInterval(calculateTimePassed, 1000);
  }, []);

  return (
    <div className="about_container">
      <div className="about_text">
        <div className="text_1">
          <p>PUBAO STORY!</p>
        </div>
        <div className="text_2">
          <p>태어난지</p>
          <h1>{birth}</h1>
          <p>태어났을 때 몸무게</p>
          <h2>197g</h2>
        </div>
        <div className="text_3">
          <p>
            2014년 중국 주석 시진핑의 방한 이후 에버랜드로 들여온 러바오와 아이바오의 새끼로, 2020년 7월 20일에 대한민국
            최초로 자연 분만으로 태어난 판다이다. 현재 에버랜드에서 사육 중인 동물들 중 호랑이 남매들(태범, 무궁, 호랑이
            오둥이)과 함께 가장 인기가 높은 동물이다. 이름의 뜻은 '행복을 주는 보물'이라는 뜻이다.가족은 아빠 러바오,
            엄마 아이바오, 쌍둥이 여동생들이 있다.
          </p>
        </div>
        <div className="text_4">
          <a href="https://namu.wiki/w/%ED%91%B8%EB%B0%94%EC%98%A4">더보기</a>
        </div>
      </div>
    </div>
  );
};

export default About;
