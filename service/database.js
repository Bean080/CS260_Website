const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('startup');
const games = db.collection('games');
const users = db.collection('users');
const photos = db.collection('photos');

module.exports {
    createUser,
    createGame,
    getUser, 
    getGame, 
    deleteUser, 
    deleteGame, 
    updateUser, 
    updateGame,
    addPhoto,
    deletePhoto
}


async function createUser(user) {
    return users.insertOne(user)
}

async function createGame(game) {
    return games.insertOne(game)
}

async function getUser(user) {
    return users.findOne({name:user.name})
}

async function getGame(game) {
    return games.findOne({code:game.code})
}

async function deleteUser(user) {
    return users.deleteOne({name:user.name})
}

async function deleteGame(game) {
    return games.delteOne({code: game.code})
}

async function updateUser(user) {
    return users.updateOne({name:user.name}, {$set:user})
}

async function updateGame(game) {
    return games.updateOne({code:game.code}, {$set:game})
}

