import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/initial.css';
import '../css/communityDetail.css';

const CommunityId = () => {
  let { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    // 비동기 함수로 데이터를 불러옵니다.
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_LOCALURL}/community/${id}`);
        // 데이터 요청이 성공한 경우 데이터 상태를 업데이트합니다.
        setData(response.data);
        console.log(data[0].content);
      } catch (error) {
        console.log(error);
      }
    };

    // fetchData 함수를 호출하여 데이터를 불러옵니다.
    fetchData();
  }, [id]); // id 매개변수가 변경될 때마다 요청을 다시 보냅니다.

  return (
    <div className="container">
      {/* 데이터가 불러와지지 않았을 경우 예외 처리 */}
      {data.length > 0 ? (
        <div className="info">
          <div className="title">
            <h1>{data[0].title}</h1>
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: data[0].content }}></div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CommunityId;
