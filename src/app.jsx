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
  const [gameCode, setGameCode] = React.useState("####");



  return (
    <BrowserRouter>
      <div className="app-root">
        <div className="vignette"></div>
          <header>
            <nav className="navbar fixed-top navbar-dark">
                <h1>Photogenic</h1>
                <menu className="navbar-nav">
                  <li className="nav-item">
                    <NavLink className='nav-link styled_button' to=''>Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className='nav-link styled_button' to='game'>Game</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className='nav-link styled_button' to='end'>End</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className='nav-link styled_button' to='account'>Account</NavLink>
                  </li>
                </menu>
            </nav>
          </header>
          <h5 id="code">Game Code: {gameCode}</h5>
            

            <Routes>
                <Route path='/' element={<Lobby />} exact />
                <Route path='/game' element={<Game />} />
                <Route path='/end' element={<End />} />
                <Route path='/account' element={<Account setGameCode={setGameCode} />} />
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