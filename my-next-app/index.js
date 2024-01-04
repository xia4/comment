const express = require('express');
const app = express();
const port = 3000;

// 루트 엔드포인트
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
