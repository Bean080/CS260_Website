import React from 'react';
import './end.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';

export function End( {user, lobby}) {
    const navigate = useNavigate();

    function end() {
        lobby.status = "lobby"
        navigate("/")
    }



  return (
    <main id='end'>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <button className="styled_button"  onClick={() => end()}>Leave Game</button>
    </main>
  );
}