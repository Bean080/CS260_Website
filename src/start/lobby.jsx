import React from 'react';
import './main.css';
import {useNavigate} from 'react-router-dom';

export function Lobby({user , setStatus , setPlayerCount , setPlayers , playerCount , players , host , status}) {
    const navigate = useNavigate();
    const testPlayers = ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"]
    const savedData = localStorage.getItem("saved_players");
    const playersMemory = savedData ? JSON.parse(savedData) : [];

    function play() {
        setStatus("playing");
        console.log(status);
        navigate("/game");
    }

    function join() {
        if (status === "lobby") {
            if (playerCount < 8) {
                let added = false;
                while (!added) {
                    const num = Math.floor(Math.random() * testPlayers.length);
                    let player = testPlayers[num];
                    if (!playersMemory.includes(player)) {
                        const nextCount = parseInt(playerCount)+1;
                        const nextPlayers = [...players, player];

                        setPlayerCount(nextCount)
                        setPlayers(nextPlayers)

                        localStorage.setItem("playerCount", nextCount);
                        
                        added = true;
                    }
                }
            }
        }
    }

    function joined(threshold) {
        if (playerCount >= threshold) {
            return true;
        }
        return false;
    }

    function lobbyTest() {
        console.log(playerCount);
        join()
        console.log(playerCount);
    }

    function removePlayer(playerLeaving) {
        const index = playersMemory.indexOf(playerLeaving);
        if (index > -1) {
            playersMemory.splice(index, 1);
            localStorage.setItem("saved_players", JSON.stringify(playersMemory));
        }
        console.log(playersMemory)
    }







  return (
    <main id="lobby">
        <div className= "players">
            {joined(2) && <div className="player"> 
                <img className= "photo" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player2 - {players[1]}</b> 
            </div>}
            {joined(3) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player3 - {players[2]}</b> 
            </div>}
            {joined(4) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player4 - {players[3]}</b> 
            </div>}
            {joined(5) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player5 - {players[4]}</b> 
            </div>}
            {joined(6) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player6 - {players[5]}</b> 
            </div>}
            {joined(7) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player7 - {players[6]}</b> 
            </div>}
            {joined(8) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player8 - {players[7]}</b> 
            </div>}
            <div className="player">
                <img className= "photo" width= "80px" alt= "Host"src="photo_placeholder.png"></img>
                <b>(YOU) {user.name}</b> 
                <label htmlFor="file-upload" className="file_upload" >Upload Photo</label>
                <input id="file-upload" type="file" accept="image/*"></input>
            </div>
        </div>
        <div>
            {user.name && <button type= "button" className="styled_button start_button" onClick={() => play()}>Start Game</button>}
        </div>
        <button className="styled_button test" onClick={() => lobbyTest()}>Add Player (test)</button>
        <div hidden className="foot">
            <h4>Game Mode Select</h4>
            <div id="games">
                <button className="styled_button" onClick={() => lobbyTest()}>M-Mystery</button>
                <button className="styled_button">Assassins</button>
            </div>
        </div>
    </main>
  );
}