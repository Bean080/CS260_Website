import React from 'react';
import './end.css';
import { useNavigate } from 'react-router-dom';

export function End( {user, setStatus, setPlayerCount, setPlayers, playerCount, players, host, status, playersOut, setOut} ) {
    const navigate = useNavigate();

    function end() {
        setStatus("lobby")
        console.log("lobby");

        setPlayerCount(1);
        setPlayers([user.name]);
        setOut([])
        localStorage.removeItem("saved_players")
        localStorage.removeItem("playersOut")
        localStorage.removeItem("out")
        localStorage.removeItem("playerCount")
        navigate("/")
    }

    function isOut(num) {
        console.log(playersOut)
        if (!playersOut) return true;
        for (const player of playersOut){
            if (player[0] == players[num]) {
                return true;
            }
        }
        return false;
    }

    function outPhoto(num) {
        for (const player of playersOut){
            if (player[0] == players[num]) {
                return player[1];
            }
        }
        return "photo_placeholder.png";
    }

    function tester() {
        outPhoto(1)
    }


  return (
    <main className= "end">
        <div id='end'>
            {isOut(0) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(0)}></img>
                <p>{players[0]}</p>
            </div>}
            {isOut(1) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(1)}></img>
                <p>{players[1]}</p>
            </div>}
            {isOut(2) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(2)}></img>
                <p>{players[2]}</p>
            </div>}
            {isOut(3) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(3)}></img>
                <p>{players[3]}</p>
            </div>}
            {isOut(4) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(4)}></img>
                <p>{players[4]}</p>
            </div>}
            {isOut(5) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(5)}></img>
                <p>{players[5]}</p>
            </div>}
            {isOut(6) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(6)}></img>
                <p>{players[6]}</p>
            </div>}
            {isOut(7) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(7)}></img>
                <p>{players[7]}</p>
            </div>}
            {isOut(8) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(8)}></img>
                <p>{players[8]}</p>
            </div>}
            {isOut(9) && <div className="player">
                <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src={outPhoto(9)}></img>
                <p>{players[9]}</p>
            </div>}
        </div>
        <button className="styled_button"  onClick={() => end()}>Leave Game</button>
    </main>
  );
}