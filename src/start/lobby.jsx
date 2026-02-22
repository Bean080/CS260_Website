import React from 'react';
import './main.css';
import {useNavigate} from 'react-router-dom';

export function Lobby({user, lobby}) {
    const navigate = useNavigate();
    const [totalPlayers, setTotalPlayers] = React.useState(1);

    function play() {
        lobby.status = "playing";
        navigate("/game");
    }

    function joined(totalPlayers, threshold) {
        if (totalPlayers >= threshold) {
            return true;
        }
        return false;



    }

    function lobbyTest() {
        console.log(lobby.host);
        console.log(lobby.code);
        setTotalPlayers(totalPlayers + 1);
        console.log(totalPlayers);
    }


  return (
    <main id="lobby">
        <div className= "players">
            {joined(totalPlayers, 2) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player1 Name</b> 
            </div>}
            {joined(totalPlayers, 3) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player2 Name</b> 
            </div>}
            {joined(totalPlayers, 4) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player3 Name</b> 
            </div>}
            {joined(totalPlayers, 5) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player4 Name</b> 
            </div>}
            {joined(totalPlayers, 6) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player5 Name</b> 
            </div>}
            {joined(totalPlayers, 7) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player6 Name</b> 
            </div>}
            {joined(totalPlayers, 8) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player7 Name</b> 
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