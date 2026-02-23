import React from 'react';
import './main.css';
import {useNavigate} from 'react-router-dom';

export function Lobby({user, lobby}) {
    const navigate = useNavigate();
    const [totalPlayers, setTotalPlayers] = React.useState(1);
    const [currentlobby, setLobby] = React.useState(lobby)

    function play() {
        lobby.status = "playing";
        setLobby[lobby]
        console.log(lobby.status)
        navigate("/game");
    }

    function join() {
        console.log(lobby.status)
        if (lobby.status === "lobby") {
            lobby.addPlayer()
            setTotalPlayers(totalPlayers+1)
        }
    }

    function joined(lobby, threshold) {
        if (lobby.playerCount >= threshold) {
            return true;
        }
        return false;
    }

    function lobbyTest() {
        console.log(lobby.host)
        console.log(lobby.playerCount);
        join()
        console.log(lobby.players);
    }


  return (
    <main id="lobby">
        <div className= "players">
            {joined(lobby, 2) && <div className="player"> 
                <img className= "photo" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player2 - {lobby.getPlayer(2)}</b> 
            </div>}
            {joined(lobby, 3) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player3 - {lobby.getPlayer(3)}</b> 
            </div>}
            {joined(lobby, 4) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player4 - {lobby.getPlayer(4)}</b> 
            </div>}
            {joined(lobby, 5) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player5 - {lobby.getPlayer(5)}</b> 
            </div>}
            {joined(lobby, 6) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player6 - {lobby.getPlayer(6)}</b> 
            </div>}
            {joined(lobby, 7) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player7 - {lobby.getPlayer(7)}</b> 
            </div>}
            {joined(lobby, 8) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player8 - {lobby.getPlayer(8)}</b> 
            </div>}
            <div className="player">
                <img className= "photo" width= "80px" alt= "Host"src="photo_placeholder.png"></img>
                <b>(YOU) {user}</b> 
                <label htmlFor="file-upload" className="file_upload">Upload Photo</label>
                <input id="file-upload" type="file"></input>
            </div>
        </div>
        <div>
            {user && <button type= "button" className="styled_button start_button" onClick={() => play()}>Start Game</button>}
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