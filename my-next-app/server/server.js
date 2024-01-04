// server.js 파일

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5500;

// JSON 형식의 데이터 파싱을 위한 미들웨어 추가
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
// 댓글 목록을 저장할 배열
const commentList = [];

// 댓글 목록 조회 API
app.get('/api/comments', (req, res) => {
  res.json(commentList);
});

// 댓글 작성 API
app.post('./api/comments', (req, res) => {
  const { content } = req.body;
  const newComment = {
    userImg: "user-image-url", // 유저 이미지 URL 추가
    userId: "user123", // 사용자 아이디 추가
    content,
    date: new Date(),
    likes: 0,
  };

  commentList.push(newComment);
  res.json(newComment);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.use('/api', require('./api/comments'));
app.use(cors());
app.use((req, res, next) => {
    res.status(404).send('Not Found');
  });
  
  // 에러 핸들러
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });
  