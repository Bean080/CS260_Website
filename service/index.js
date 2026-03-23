const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

//linked List
const {LinkedList} = require("./linkedList.js");

//photo modules
const fs = require('fs');
const path = require('path');

//Gemini
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { stringify } = require('querystring');

//DB
const DB = require("./database.js")


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

//update code
app.patch('/api/user/code', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
      user.lastCode = req.body.code;
      res.status(200).send({msg: 'Code Updated', lastCode: user.lastCode });
  } else {
      res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.patch('/api/user/photo', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
      user.photo = req.body.photo;
      res.status(200).send(JSON.stringify({user:user}));
  } else {
      res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.patch("/api/user/ai", async (req,res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user.ai) {
    user.ai = false;
  } else {
    user.ai = true;
  }
  res.status(200).send(JSON.stringify({user:user}));
});

let users = [];

async function createUser(name, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
        name: name,
        password: passwordHash,
        ai: false,
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
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  if (!game) {
    res.status(401).send({msg: "How! theres no game"});
  }
  if (user.name === game.host.name) {
    for (let pair of game.playersOut) {
      deletePhoto(pair[1]);
    }
    games = games.filter(g => g.gameToken !== gameToken);
  }

  clearGameCookie(res, game);
  res.status(200).send({});
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
  const token = req.cookies['token'];
  const user = await getUser('token', token);

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

async function deletePhoto(fileName) {
  if (fileName && fileName !== "photo_placeholder.png") {
    try {
      const filePath = path.join(__dirname, '..', 'public', fileName);
      await fs.promises.unlink(filePath);
      console.log("File deleted");
    } catch (error) {
      console.log("We are so cooked")
    }
  }
}




// ______________________tests__________________//

const testPlayers = [];
const names = ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"];

(async function setupFakeUsers() {
  for (let name of names) {
    const user = await createUser(name, "00000000");

    const imagePath = path.join(__dirname, 'public', 'IMG_8236.jpeg');
    const rawBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    const profileString = `data:image/jpeg;base64,${rawBase64}`;

    user.photo = profileString;
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

//get target
app.get('/api/assassins', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (game) {
    const savedOrder = game.targetList;
    if (savedOrder.length > 0) {
      const circle = new LinkedList();
      savedOrder.forEach(p => circle.add(p));
      circle.tail.next = circle.head;
      circle.head.prev = circle.tail;

      const target = circle.targetOf(user);
      res.status(200).send({ game:game, target:target });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
})

//eliminate target
app.patch('/api/assassins', async (req, res) => {
  const gameToken = req.cookies['gameToken'];
  const game = await getGame('gameToken', gameToken);
  const token = req.cookies['token'];
  const user = await getUser('token', token);

  if (game) {
    const savedOrder = game.targetList;
    if (savedOrder.length > 0) {
      const circle = new LinkedList();
      savedOrder.forEach(p => circle.add(p));
      circle.tail.next = circle.head;
      circle.head.prev = circle.tail;

      circle.remove(req.body.player);
      const nextTarget = circle.targetOf(user);

      let savedPhotoPath = "photo_placeholder.png"; 
    
      if (req.body.photo && req.body.photo.includes('base64')) {
        //remove prefix
        const base64Data = req.body.photo.replace(/^data:image\/\w+;base64,/, "");
        //create file name
        const fileName = `eliminated_${req.body.player.name}.jpg`;
        //save to photoCache folder
        const filePath = path.join(__dirname, '..', 'public', fileName)
        fs.writeFileSync(filePath, base64Data, 'base64');
        // save path
        savedPhotoPath = `/${fileName}`;
      }

      const pair = [req.body.player, savedPhotoPath];
      const newArray = circle.toArray();
      game.targetList = newArray;
      game.playersOut.push(pair)

      console.log(game.playersOut.length)
      console.log(nextTarget.name)

      res.status(200).send({ game:game, target:nextTarget });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
})



//______________________________Gemini______________________________//
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/verify', async (req, res) => {
    try {
        const { targetPhotoBase64, takenPhotoBase64 } = req.body;

        const cleanTarget = targetPhotoBase64.replace(/^data:image\/\w+;base64,/, "");
        const cleanTaken = takenPhotoBase64.replace(/^data:image\/\w+;base64,/, "");

        const imageParts = [
            {
                inlineData: {
                    data: cleanTarget,
                    mimeType: "image/jpeg"
                }
            },
            {
                inlineData: {
                    data: cleanTaken,
                    mimeType: "image/jpeg"
                }
            }
        ];

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const prompt = "Look closely at the person in the first image and the person in the second image. Is it the exact same person? Reply with ONLY the word 'YES' or 'NO'.";

        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text().trim().toUpperCase();

        console.log(text)

        if (text.includes("YES")) {
            res.status(200).send({ verified: true });
        } else {
            res.status(200).send({ verified: false });
        }

    } catch (error) {
        console.error("Gemini Verification Failed:", error);
        res.status(500).send({ msg: "AI verification failed" });
    }
});









app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/end', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});