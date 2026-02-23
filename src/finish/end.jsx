import React from 'react';
import './end.css';
import { useNavigate } from 'react-router-dom';

export function End( {user, setStatus, setPlayerCount, setPlayers, playerCount, players, host, status} ) {
    const navigate = useNavigate();

    function end() {
        setStatus("lobby")
        console.log("lobby");

        setPlayerCount(1);
        setPlayers([user]);
        localStorage.removeItem("saved_players")
        localStorage.removeItem("playerCount")
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