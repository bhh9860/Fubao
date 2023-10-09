import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/community.css';
import '../css/common.css';

const About = () => {
  //최신 데이터부터 보여주기 위해 reverseData 사용
  let [reverseData, setReverseData] = useState([]);
  useEffect(() => {
    data()
      .then((res) => {
        let copy = [...res];
        setReverseData(copy.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      <div className="menu_title">
        <h1>커뮤니티</h1>
      </div>
      <div className="table-container">
        <table className="table">
          <tr className="bg-grey">
            <th>글번호</th>
            <th>제목</th>
            <th>첨부파일</th>
            <th>닉네임</th>
            <th>조회수</th>
            <th>추천</th>
            <th>작성시간</th>
          </tr>
          {/* 최신 데이터부터 보여줌 */}
          {reverseData.reverse().map((item, i) => {
            const date = new Date(item.time);
            return (
              <>
                <tr key={i}>
                  <td style={{ textAlign: 'center' }}>{item._id}</td>
                  <td>
                    <Link to={`/community/${item._id}`} style={{ color: 'black' }}>
                      {item.title}
                    </Link>
                  </td>
                  <td className="center">{item.addFile == 1 ? 'O' : 'X'}</td>
                  <td className="center">{item.nickName}</td>
                  <td className="center">{item.views}</td>
                  <td className="center">{item.likes}</td>
                  <td>{date.toLocaleString()}</td>
                </tr>
              </>
            );
          })}
        </table>
        <Link to="/write" className="write">
          글쓰기
        </Link>
      </div>
    </div>
  );
};

//data 요청함수
const data = () => {
  return axios
    .get('https://port-0-server-2rrqq2blmqlhn5j.sel5.cloudtype.app/community')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export default About;
