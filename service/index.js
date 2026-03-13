
const {LinkedList} = require("./linkedList.js");
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

    res.status(200).send({ account: JSON.stringify(user) });
  }
});

//authenticate
app.put('/api/auth', async (req, res) => {
  console.log('Incoming Body:', req.body);
  const user = await getUser('name', req.body.name);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.status(200).send({ account: JSON.stringify(user) });
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

  res.status(200).send({});
});

//retrieve
app.get('/api/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ account: JSON.stringify(user) });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.patch('/api/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    if (user) {
        user.lastCode = req.body.code;
        res.status(200).send({msg: 'Code Updated', lastCode: user.lastCode });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

let users = [];

async function createUser(name, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
        name: name,
        password: passwordHash,
        code: "####",
        photo: "photo_placeholder.png",
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

//create/host
app.post('/api/game', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
  }
  if (await getGame('code', req.body.code)) {
    res.status(409).send({ msg: 'Existing game' });

  } else {

    const game = await createGame(user, req.body.code);
    setGameCookie(res, game);
    game.host = user;
    game.players.push(user)
    game.playerCount = game.playerCount + 1

    user.code = req.body.code;
    res.status(200).send({ code: game.code, host: JSON.stringify(user), game:game});
  }
});

//authenticate/join
app.put('/api/game', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  const game = await getGame('code', req.body.code);

  if (game && user) {
    setGameCookie(res, game);
    game.players.push(user)
    game.playerCount = game.playerCount + 1

    res.status(200).send({ 
        host: JSON.stringify(game.host)
    });
  } else if (!user){
    res.status(401).send({ msg: 'Unauthorized' });
  } else {
    res.status(401).send({ msg: 'Game not found' });
  }
});

//delete
app.delete('/api/game', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  if (game) {
    games = games.filter(g => g.gameToken !== gameToken);
    clearGameCookie(res, game);
  }

  res.send({});
});

//retrieve
app.get('/api/game', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  if (game) {
    res.send({ lobby: JSON.stringify(game) });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//add player
app.patch('/api/game/add', async (req, res) => {
    const gameToken = req.cookies['gameToken'];
    const game = await getGame('gameToken', gameToken);
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    if (user && game.playerCount < 9) {
        game.players.push(req.body.joiner)
        game.playerCount = game.players.length;
        res.status(200).send({msg: 'Joined Game', game:game});
    } else {
      console.log(game.players)
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

//remove game
app.patch('/api/game/remove', async (req, res) => {
    const gameToken = req.cookies['gameToken'];
    const game = await getGame('gameToken', gameToken);
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    if (user && game.playerCount > 1) {
        const targetName = req.body.leaver.name; 

        game.players = game.players.filter(p => p.name !== targetName);
        game.playerCount = game.players.length;

        res.status(200).send({game:game});
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

//start game (make targetList)
app.patch('/api/game/start', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  if (game && user) {
    const gameCircle = new LinkedList();
    gameCircle.createCircle(game.players); 
    
    game.status = req.body.status;
    game.targetList = gameCircle.toArray();

    for (player of game.players) console.log(player.name)
    console.log("------------------")
    for (player of game.targetList) console.log(player.name)

    res.status(200).send({ msg: 'start', game:game });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
})


let games = [];

async function createGame(host, code) {

  const game = {
        status:"lobby",
        code: code,
        host: host,
        players: [],
        playerCount: 0,
        targetList: [],
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

async function getPlayer(game, field, value) {
  if (value) {
    return game.players.find((p) => p[field] === value);
  }
  return null;
}

function setGameCookie(res, game) {
  game.gameToken = uuid.v4();

  res.cookie('gameToken', game.gameToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearGameCookie(res, game) {
  delete game.gameToken;
  res.clearCookie('gameToken');
}






// ______________________tests__________________//

const testPlayers = [];
const names = ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"];

(async function setupFakeUsers() {
  for (let name of names) {
    const user = await createUser(name, "00000000"); 
    testPlayers.push(user);
  }
  console.log(`Loaded ${testPlayers.length} fake players for testing.`);
})();


app.get('/api/test/player', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);

  if (!game) {
    return res.status(400).send({ msg: 'No active game session' });
  }

  const currentNames = game.players.map(p => p.name);

  const availablePlayers = testPlayers.filter(fakePlayer => !currentNames.includes(fakePlayer.name));
  if (availablePlayers.length === 0) {
    return res.status(409).send({ msg: 'No more fake players available' });
  }

  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  const playerToJoin = availablePlayers[randomIndex];
  return res.status(200).send({ player: playerToJoin });
})



//____________________________assassins__________________________________//

app.get('/api/assassins', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (game) {
    const savedOrder = game.targetList;
    if (savedOrder.length > 0) {
      const circle = new LinkedList();
      currentOrder.forEach(p => circle.add(p));
      console.log(circle)
      circle.tail.next = circle.head;
      const target = circle.targetOf(req.body.player);
      res.status(200).send({ game:game, target:target });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
})




const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});