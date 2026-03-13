import React, { useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import { useLocation, NavLink, Route, Routes } from 'react-router-dom';
import { Lobby } from './start/lobby.jsx';
import { Game } from './game/game.jsx';
import { End } from './finish/end.jsx';
import { Account } from './account/account.jsx';

//localStorage.clear()           //   <-----------------            REMOVE AFTER TESTING


export default function App() {

  const [authState, setAuthState] = React.useState(false);
  const [game, setGame] = React.useState(null);
  const [gameCode, setCode] = React.useState("####");
  const [user, setUser] = React.useState({name:null});
  const [ host, setHost ] = React.useState("Host");
  const [ players, setPlayers ] = React.useState(JSON.parse(localStorage.getItem("saved_players")) || (user ? [user] : []));
  const [ status, setStatus] = React.useState("lobby");
  const [ playerCount, setPlayerCount ] = React.useState(0);
  const [ playersOut, setOut] = React.useState(JSON.parse(localStorage.getItem("out")) || []);
  
  useEffect(() => {
    console.log("loading user data...")
    try {
      getUser()
    } catch (error) {
      return
    }
  },[]);

  async function getUser() {
    const res = await fetch("/api/user/me", {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    } )
    if (res.ok) {
      let data = await res.json();
      const account = JSON.parse(data.account);

      setCode(account.code)
      setUser(account)
      setAuthState(true);
      localStorage.setItem("user", JSON.stringify(account));
    }
  }

  useEffect(() => {
    console.log("loading game data...")
    try {
      getLobby()
    } catch (error) {
      return
    }
  },[]);

  async function getLobby() {
    const res = await fetch("/api/game", {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    } )
    if (res.ok) {
      let data = await res.json();
      const lobby = JSON.parse(data.lobby);
      setGame(lobby)
    }
  }

  useEffect(() => {
    localStorage.setItem("out", JSON.stringify(playersOut));
  },[playersOut]);

  useEffect(() => {
    localStorage.setItem("playerCount", JSON.stringify(playerCount));
  },[playerCount]);

  function superTest() {
    logGame(game)
    logUser(user)
    console.log()
  }

  const location = useLocation();
  return (
    <div className="app-root">
      <div className="vignette"></div>
        <header>
          <nav className="navbar fixed-top navbar-dark">
            <h1>Photogenic {user? user.name : "Sign in"}</h1>
            <menu className="navbar-nav">
              {location.pathname === '/account' ? (
                <li className="nav-item">
                  <NavLink className='nav-link styled_button' to='/'>Home</NavLink>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className='nav-link styled_button' to='/account'>Account</NavLink>
                </li>
              )}
            </menu>
          </nav>
        </header>
        <h5 id="code">Game Code: {game? game.code : "..."}</h5>
        <button onClick={superTest}></button>
          
          <Routes>
              <Route path='/' element={<Lobby user={user} game={game} gameCode={gameCode} setUser={setUser} setGame={setGame} setPlayerCount={setPlayerCount} setPlayers={setPlayers} playerCount={playerCount} players={players} host={host} status={status}/>} exact />
              <Route path='/game' element={<Game user={user} game={game} setGame={setGame} setStatus={setStatus} setPlayerCount={setPlayerCount} setPlayers={setPlayers} playerCount={playerCount} players={players} host={host} status={status} playersOut={playersOut} setOut= {setOut}/>} />
              <Route path='/end' element={<End user={user} game={game} setGame={setGame} setStatus={setStatus} setPlayerCount={setPlayerCount} setPlayers={setPlayers} playerCount={playerCount} players={players} host={host} status={status} playersOut={playersOut} setOut= {setOut}/>} />
              <Route path='/account' element={<Account user={user} setGame={setGame} setCode={setCode} setUser={setUser} setHost={setHost} setPlayers={setPlayers} />} />
              <Route path='*' element={<NotFound />} />
          </Routes>

        <footer>
            <a id="code" href="https://github.com/Bean080/CS260_Website/tree/main">Benjamin Clarke - GitHub (clickhere)</a>
        </footer>
    </div>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}