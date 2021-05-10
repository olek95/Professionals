const fs = require('fs');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router('./src/db.json');
const userdb = JSON.parse(fs.readFileSync('./src/users.json', 'UTF-8'));
server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
const SECRET_KEY = '123456789';
const expiresIn = '1h';

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

function isAuthenticated({ login, password }) {
  return (
    userdb.users.findIndex(
      (user) => user.login === login && user.password === password
    ) !== -1
  );
}

server.post('/auth/login', (req, res) => {
  const { login, password } = req.body;
  if (isAuthenticated({ login, password }) === false) {
    const status = 401;
    const message = 'Incorrect login or password';
    res.status(status).json({ status, message });
    return;
  }
  const accessToken = createToken({ login, password });
  res.status(200).json({ accessToken });
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401;
    const message = 'Bad authorization header';
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(' ')[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error: accessToken is not valid';
    res.status(status).json({ status, message });
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('Run Auth API Server');
});
