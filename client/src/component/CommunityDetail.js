import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/initial.css';
import '../css/communityDetail.css';

const CommunityId = (props) => {
  const { nickName } = props;
  let { id } = useParams();
  const [data, setData] = useState([]);
  const [date, setDate] = useState('');
  const [likeState, setLikeState] = useState(0); // 0이면 좋아요, 1이면 싫어요
  const [replyWrite, setReplyWrite] = useState(''); // 댓글작성(input)
  const [replys, setReplys] = useState([]); // 댓글작성
  const [toggle, setToggle] = useState(false); // 댓글작성창 토글

  useEffect(() => {
    // 비동기 함수로 데이터를 불러옵니다.
    // 게시글 데이터
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_LOCALURL}/community/${id}`);
        const temp = new Date(response.data[0].time);
        setDate(temp.toLocaleString());
        // 데이터 요청이 성공한 경우 데이터 상태를 업데이트합니다.
        setData(response.data);
        setLikeState(response.data[0].likes);
      } catch (error) {
        console.log(error);
      }
    };

    // fetchData 함수를 호출하여 데이터를 불러옵니다.
    fetchData();

    // 댓글 데이터
    const fetchReply = async () => {
      try {
        const ReplysData = await axios.get(`${process.env.REACT_APP_API_LOCALURL}/reply/${id}`);
        // setReplys(ReplysData.data);
        let temp = [];
        ReplysData.data.map((item) => {
          temp.push(item);
        });
        setReplyWrite('');
        setReplys(temp);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReply();
  }, [id, toggle]); // id 매개변수가 변경될 때마다 요청을 다시 보냅니다.

  //좋아요싫어요 기능
  //click이 1이면 좋아요, 0이면 싫어요
  const like = (click) => {
    let a = { id, click };
    axios.post(`${process.env.REACT_APP_API_LOCALURL}/like`, a).then((res) => {
      console.log(res.data.result);
    });
  };

  function replyHandle() {
    console.log(replyWrite);
    axios
      .post(`${process.env.REACT_APP_API_LOCALURL}/reply`, { id, replyWrite, nickName })
      .then((res) => {
        {
          console.log('댓글등록완료');
          console.log(res.data.result);
          setToggle(!toggle);
        }
      })
      .catch((err) => {
        console.log('댓글등록실패, err');
      });
  }

  return (
    <div className="container">
      {/* 데이터가 불러와지지 않았을 경우 예외 처리 */}
      {data.length > 0 ? (
        <div className="info">
          <div className="text">
            <div className="text_up_container">
              <div className="text_up_title">
                <h1>{data[0].title}</h1>
              </div>
              <div className="text_up_info">
                <h3>
                  조회수 : {data[0].views} 추천 : {likeState}
                </h3>
              </div>
            </div>
            <div className="text_down_container">
              <div className="text_down_name">
                <h3>작성자 : {data[0].nickName}</h3>
              </div>
              <div className="text_down_info">
                <h3>{date.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: data[0].content }}></div>
          <div className="button_container">
            <div className="button_like button">
              <button
                onClick={() => {
                  like(1);
                  setLikeState(likeState + 1);
                }}
              >
                좋아요
              </button>
            </div>
            <div className="button_hate button">
              {' '}
              <button
                onClick={() => {
                  like(0);
                  setLikeState(likeState - 1);
                }}
              >
                싫어요
              </button>
            </div>
          </div>
          <div className="reply_container">
            <h2>댓글</h2>
            <div className="replys">
              {replys.map((item, i) => (
                <div key={i} className="reply">
                  <div className="replyNickName">
                    <p>{item.replyNickName}</p>
                  </div>
                  <div className="replyComment">
                    <p>{item.replyComment}</p>
                  </div>
                  <div className="replyTime">
                    <p>{new Date(item.replyTime).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="reply_write_container">
              <div className="reply_write">
                <textarea
                  placeholder="댓글을 입력하세요"
                  value={replyWrite}
                  onChange={(e) => {
                    setReplyWrite(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="reply_button">
                <button
                  onClick={() => {
                    replyHandle();
                  }}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CommunityId;
