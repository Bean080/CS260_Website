import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Lobby } from './start/lobby.jsx';
import { Game } from './game/game.jsx';
import { End } from './finish/end.jsx';
import { Account } from './account/account.jsx';



export default function App() {
  const players = new Map();
  const myLobby = {
    host: "Host",
    code: "####",
    status: "lobby",
    mode: "Assassins",
    playerCount: 1,
    players: players,
    testPlayers: ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"],

    reset: function() {
      this.host = "Host",
      this.code = "####",
      this.status = "lobby",
      this.players.clear()
    },

    addPlayer: function() {
      if (this.playerCount < 8) {
        let added = false;
        while (!added) {
          const num = Math.floor(Math.random() * this.testPlayers.length);
          let player = this.testPlayers[num];
          if (!this.players.has(player)) {
            this.playerCount = this.playerCount +1;
            players.set(player,this.playerCount);
            added = true;
          }
        }
      }
    },

    getPlayer: function(num) {
      for (const player of this.players.keys()) {
        if (this.players.get(player) === num) {
          return player;
        }
      }
    },

    removePlayer: function(playerLeaving) {
      this.players.delete(playerLeaving);
      let playerNum = 2;
      const adjustedLobby = new Map()
      for (const player of players.keys()) {
        adjustedLobby.set(player,playerNum);
        playerNum +=1;
      }
      this.players = adjustedLobby;
    },
  }

  const [gameCode, setGameCode] = React.useState(localStorage.getItem("code")||"####");
  const [user, setUser] = React.useState(localStorage.getItem("user") || null);
  const [lobby, setLobby] = React.useState(myLobby)
  
  return (
    <BrowserRouter>
      <div className="app-root">
        <div className="vignette"></div>
          <header>
            <nav className="navbar fixed-top navbar-dark">
              <h1>Photogenic {user && "-"} {user}</h1>
              <menu className="navbar-nav">
                <li className="nav-item">
                  <NavLink className='nav-link styled_button' to=''>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className='nav-link styled_button' to='account'>Account</NavLink>
                </li>
              </menu>
            </nav>
          </header>
          <h5 id="code">Game Code: {gameCode}</h5>
            
            <Routes>
                <Route path='/' element={<Lobby user={user} lobby={lobby}/>} exact />
                <Route path='/game' element={<Game user={user} lobby={lobby}/>} />
                <Route path='/end' element={<End user={user} lobby={lobby}/>} />
                <Route path='/account' element={<Account setGameCode={setGameCode} setUser={setUser} user={user} lobby={lobby}/>} />
                <Route path='*' element={<NotFound />} />
            </Routes>

          <footer>
              <a id="code" href="https://github.com/Bean080/CS260_Website/tree/main">Benjamin Clarke - GitHub (clickhere)</a>
          </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}