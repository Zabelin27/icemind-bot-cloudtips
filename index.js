const http = require('http');

const server = http.createServer((req, res) => {
  res.end('IceMind bot работает!');
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен на порту 3000');
});
