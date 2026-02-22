import React from 'react';
import './end.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';

export function End( {user, lobby}) {
    const navigate = useNavigate();
    const [currentlobby, setLobby] = React.useState(lobby)

    function end() {
        lobby.status = "lobby"
        setLobby[lobby]
        console.log(lobby.status)
        navigate("/")
    }

    function tester() {
        

    }



  return (
    <main className= "end">
        <div id='end'>
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
        </div>
        <button className="styled_button"  onClick={() => end()}>Leave Game</button>
        <button className="styled_button"  onClick={() => tester()}>Test</button>
    </main>
  );
}