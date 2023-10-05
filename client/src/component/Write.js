import React from 'react';
import { useState } from 'react';
import '../css/initial.css';
import '../css/common.css';
import '../css/write.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Write = () => {
  let navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  return (
    <div className="container">
      <div className="menu_title">
        <h1>글 쓰기</h1>
        <hr></hr>
      </div>
      <div class="input-container">
        <input
          className="title"
          placeholder="제목"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
        <textarea
          className="content"
          placeholder="내용"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
      </div>
      <button
        onClick={() => {
          if (submitCheck(title, content)) {
            submit(title, content);
            navigate('/community');
          }
        }}
      >
        작성
      </button>
    </div>
  );
};

const submit = (title, content) => {
  const data = {
    title: title,
    content: content,
  };

  axios
    .post('http://localhost:8000/write', data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 작성 시 제목과 내용을 입력했는지, 제목과 내용의 길이가 적절한지 확인
const submitCheck = (title, content) => {
  const t = title.trim();
  const c = content.trim();

  if (t === '' && c === '') {
    alert('제목과 내용을 입력해주세요');
    return false;
  }
  if (t === '') {
    alert('제목을 입력해주세요');
    return false;
  }
  if (c === '') {
    alert('내용을 입력해주세요');
    return false;
  }
  if (t.length > 40) {
    alert('제목은 40자 이하로 입력해주세요');
    return false;
  }
  if (c.length > 1000) {
    alert('내용은 1000자 이하로 입력해주세요');
    return false;
  }

  return true;
};

export default Write;
