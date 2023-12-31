import React, { useMemo, useRef } from 'react';
import { useState } from 'react';
import '../css/initial.css';
import '../css/common.css';
import '../css/write.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//이미지 조절
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);

const Write = (props) => {
  const { nickName } = props;
  let navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null); // 에디터 접근을 위한 ref return (

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('multiple', true);
    input.setAttribute('name', 'img');
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener('change', async () => {
      console.log('온체인지');
      const files = input.files;
      // multer에 맞는 형식으로 데이터 만들어준다.

      const uploadedImageUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('img', file); // formData는 키-밸류 구조
        // formData에는 파일이 들어가있다.
        try {
          const result = await axios.post(`${process.env.REACT_APP_API_LOCALURL}/img`, formData);
          console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
          uploadedImageUrls.push(result.data.url);
        } catch (err) {
          console.log('이미지 업로드 실패');
        }
      }

      // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
      const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
      // 1. 에디터 root의 innerHTML을 수정해주기
      // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
      // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
      // editor.root.innerHTML =
      //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

      // 2. 현재 에디터 커서 위치값을 가져온다
      const range = editor.getSelection();
      // 가져온 위치에 이미지를 삽입한다
      for (const imageUrl of uploadedImageUrls) {
        editor.insertEmbed(range.index, 'image', imageUrl);
        range.index++;
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [['image'], [{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote']],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
      ImageResize: {
        parchment: Quill.import('parchment'),
      },
    };
  }, []);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'image'];

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

        <ReactQuill
          ref={quillRef}
          theme="snow"
          placeholder="내용"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />
      </div>
      <button
        onClick={() => {
          if (submitCheck(title, content)) {
            submit(title, content, nickName);
            async function delayedLog() {
              // 3초 대기
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // 3초가 지난 후에 실행될 코드
              console.log('3초가 지났습니다.');
              navigate('/community');
            }
            delayedLog();
          }
        }}
      >
        작성
      </button>
    </div>
  );
};

const submit = (title, content, nickName) => {
  const data = {
    title: title,
    content: content,
    nickName: nickName,
  };

  axios
    .post(`${process.env.REACT_APP_API_LOCALURL}/write`, data)
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
