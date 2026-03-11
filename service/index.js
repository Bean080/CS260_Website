const express = require('express');
const app = express();
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cookieParser());


// ______________________User__________________//

//create
app.post('/api/auth', async (req, res) => {
  if (await getUser('name', req.body.name)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.name, req.body.password);
    setAuthCookie(res, user);

    res.send({ name: user.name });
  }
});

//authenticate
app.put('/api/auth', async (req, res) => {
  const user = await getUser('name', req.body.name);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.status(200).send({ 
        user: JSON.stringify(user)
    });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//delete
app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }

  res.send({});
});

//retrieve
app.get('/api/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ name: user.name });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});



const users = [];

async function createUser(name, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
        name: name,
        password: passwordHash,
        lastCode: "####",
        photo: "",
    };

  users.push(user);

  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
}




// ______________________Game__________________//

//create
app.post('/api/game', async (req, res) => {
  if (await getGame('code', req.body.code)) {
    res.status(409).send({ msg: 'Existing game' });
  } else {
    const game = await createGame(req.body.code);
    setGameCookie(res, game);

    res.send({ code: game.code });
  }
});

//authenticate
app.put('/api/game', async (req, res) => {
  const game = await getGame('code', req.body.code);
  if (game) {
    setGameCookie(res, game);

    res.status(200).send({ 
        game: JSON.stringify(game)
    });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//delete
app.delete('/api/game', async (req, res) => {
  const token = req.cookies['gameToken'];
  const game = await getGame('gameToken', token);
  if (game) {
    clearGameCookie(res, game);
  }

  res.send({});
});

//retrieve
app.get('/api/game', async (req, res) => {
  const token = req.cookies['gameToken'];
  const game = await getGame('gameToken', token);
  if (game) {
    res.send({ lobby: game });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


const games = [];

async function createGame(host, code) {

  const game = {
        code: code,
        host: host,
        players: [],
        playerCount: 0,
        playersOut: []
    };

  games.push(game);

  return game;
}

async function getGame(field, value) {
  if (value) {
    return games.find((game) => game[field] === value);
  }
  return null;
}

function setGameCookie(res, game) {
  game.token = uuid.v4();

  res.cookie('gameToken', game.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearGameCookie(res, game) {
  delete game.token;
  res.clearCookie('gameToken');
}















const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});