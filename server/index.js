const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mysql = require('mysql2');
//커넥션 파일 불러오기
const connection = require('./connection');
//이미지 업로드
const multer = require('multer');

const PORT = 8000;

app.use(express.json()); // json 파서 사용
app.use(express.urlencoded({ extended: false })); // 내부 url 파서 사용
const corsOptions = {
  origin: 'https://web-client-2rrqq2blmqlhn5j.sel5.cloudtype.app', // 프론트엔드 도메인
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // 쿠키를 주고받을 수 있도록 설정
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions)); //cors 허용

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, 'public')));

//리액트 파일만 보여주겠습니다.(클라이언트 사이드 렌더링)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// multer 설정
const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      cb(null, 'public/uploads');
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      console.log('file.originalname', file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

// 하나의 이미지 파일만 가져온다.
app.post('/img', upload.single('img'), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log('전달받은 파일', req.file);
  console.log('저장된 파일의 이름', req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:8000/uploads/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL });
});

//비밀번호 암호화
const crypto = require('crypto');
const util = require('util');

// 솔트 생성 위해 랜덤 바이트 생성
const randomBytesPromise = util.promisify(crypto.randomBytes);
// 비밀번호 암호화 또는 검증
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

// 솔트 생성
const createSalt = async () => {
  const buf = await randomBytesPromise(64);
  return buf.toString('base64');
};

// 비밀번호 암호화
// {해쉬된 비밀번호, 솔트} 형태로 반환
const createHashedPassword = async (password) => {
  const salt = await createSalt();
  const key = await pbkdf2Promise(password, salt, 124589, 64, 'sha512');
  const hashedPassword = key.toString('base64');

  return { hashedPassword, salt };
};

// 비밀번호 검증
const verifyPassword = async (password, salt) => {
  const key = await pbkdf2Promise(password, salt, 124589, 64, 'sha512');
  const hashedPassword = key.toString('base64');

  return hashedPassword;
};

// mysql 커넥션

//community get 요청
app.get('/community', (req, res) => {
  connection.query('SELECT * FROM board', (err, result) => {
    if (err) {
      console.log('커뮤니티 불러오기 실패 ', err);
      res.status(500).json({ err: '커뮤니티 불러오기 실패' });
    } else {
      console.log('커뮤니티 불러오기 성공');
      res.status(200).json(result);
    }
  });
});

//community post 요청(글쓰기)
app.post('/write', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(typeof content);
  function isFile(content) {
    let index = content.indexOf('<img');
    if (index !== -1) {
      return 1;
    } else {
      return 0;
    }
  }
  let file = isFile(content);
  console.log(file);

  connection.query(
    `INSERT INTO board (title, content, addFile, nickName) VALUES ('${title}', '${content}', '${file}', 'jeong'`,
    (err, result) => {
      if (err) {
        console.log('글쓰기 실패: ', err);
        res.status(500).json({ err: '글쓰기 실패' });
      } else {
        console.log('글쓰기 성공');
        res.status(200).json(result);
      }
    }
  );
});

// 회원가입 post 요청
app.post('/singup', async (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;
  const nickName = req.body.nickName;

  // 비밀번호 암호화
  const hash = await createHashedPassword(pw).then((result) => {
    const pwHash = result.hashedPassword;
    const salt = result.salt;
    return { pwHash, salt };
  });

  // 중복 이메일 검사
  connection.query(`SELECT COUNT(userEmail) AS emailCount FROM user WHERE userEmail='${email}'`, (err, result) => {
    if (err) {
      // 중복 이메일 검사 실패
      console.log('이메일 중복 검사 실패: ', err);
      res.status(500).json({ err: '이메일 중복 검사 실패' });
    } else {
      // 중복 이메일 검사 성공
      console.log('이메일 중복 검사 성공', result);
      const emailCount = result[0].emailCount; // 결과 값을 추출
      console.log('이메일 중복 횟수: ', emailCount);

      // 중복 닉네임 검사(이메일 검사 성공 후 실행)
      connection.query(
        `SELECT COUNT(userNickName) AS nickNameCount FROM user WHERE userNickName='${nickName}'`,
        (err, result) => {
          if (err) {
            console.log('닉네임 중복 검사 실패: ', err);
            res.status(500).json({ err: '닉네임 중복 검사 실패' });
          } else {
            console.log('닉네임 중복 검사 성공', result);
            const nickNameCount = result[0].nickNameCount; // 결과 값을 추출
            console.log('닉네임 중복 횟수: ', nickNameCount);

            if (emailCount || nickNameCount) {
              // 이메일 중복이 있을 때
              if (emailCount) {
                console.log('이미 존재하는 이메일입니다.');
                return res.status(500).json({ err: '이메일 중복' });
              }
              // 닉네임 중복이 있을 때
              if (nickNameCount) {
                console.log('이미 존재하는 닉네임입니다.');
                return res.status(500).json({ err: '닉네임 중복' });
              }
            } else {
              // 이메일 중복이 없을 때 회원가입 실행
              connection.query(
                `INSERT INTO user (userEmail, userPw, userNickName, userSalt) VALUES ('${email}', '${hash.pwHash}', '${nickName}', '${hash.salt}')`,
                (err, result, fields) => {
                  if (err) {
                    console.log('회원가입 실패: ', err);
                    res.status(500).json({ err: '회원가입 실패' });
                  } else {
                    console.log('회원가입 성공');
                    res.status(200).json({ result });
                  }
                }
              );
            }
          }
        }
      );
    }
  });
});

// 로그인 post 요청
app.post('/Login', (req, res) => {
  const email = req.body.email;
  const pw = req.body.pw;

  connection.query(`SELECT * FROM user WHERE userEmail='${email}'`, async (err, result) => {
    if (err) {
      console.log('로그인 실패: ', err);
      res.status(500).json({ err: '로그인 실패' });
    } else {
      // 이메일이 일치하는 회원정보가 있을 때
      if (result.length) {
        console.log('이메일 정보 찾음', result);
        const salt = result[0].userSalt;
        const pwHash = result[0].userPw;
        const vertifiedPassword = await verifyPassword(pw, salt);

        if (vertifiedPassword === pwHash) {
          console.log('로그인 성공');
          // result[0]은 userId, email, Pw, NickName, Salt가 포함됨.
          res.status(200).json({ result });
        } else {
          console.log('로그인 실패 : 비밀번호 불일치');
          res.status(401).json({ err: '로그인 실패 : 비밀번호 불일치' });
        }
      } else {
        // 이메일이 일치하는 회원정보가 없을 때
        console.log('일치하는 회원정보가 없습니다');
        res.status(401).json({ err: '로그인 정보 없음' });
      }
    }
  });
});

app.get('/community/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`SELECT * FROM board WHERE _id='${id}'`, (err, result) => {
    if (err) {
      console.log('커뮤니티 불러오기 실패 ', err);
      res.status(500).json({ err: '커뮤니티 불러오기 실패' });
    } else {
      console.log('커뮤니티 불러오기 성공');
      res.status(200).json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
