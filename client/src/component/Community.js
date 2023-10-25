import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/community.css';
import '../css/common.css';
import { useNavigate } from 'react-router-dom';

const About = (props) => {
  const navigate = useNavigate();
  const { nickName } = props;
  //최신 데이터부터 보여주기 위해 reverseData 사용
  let [reverseData, setReverseData] = useState([]);
  useEffect(() => {
    data()
      .then((res) => {
        let copy = [...res];
        let temp = copy.reverse();
        console.log('res', res);
        console.log('temp', res.reverse());
        setReverseData(temp);
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
          {reverseData.map((item, i) => {
            const date = new Date(item.time);
            return (
              <>
                <tr key={i}>
                  <td style={{ textAlign: 'center' }}>{item.boardId}</td>
                  <td>
                    <Link to={`/community/${item.boardId}`} style={{ color: 'black' }}>
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

        <button
          onClick={() => {
            if (nickName == '') {
              alert('로그인 후 이용해주세요');
              navigate('/login');
            } else {
              navigate('/write');
            }
          }}
          className="write"
        >
          글쓰기
        </button>
      </div>
    </div>
  );
};

//data 요청함수
const data = () => {
  return axios
    .get(`${process.env.REACT_APP_API_LOCALURL}/community`)
    .then((res) => {
      console.log(process.env.REACT_APP_API_LOCALURL);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export default About;
