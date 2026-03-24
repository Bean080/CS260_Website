import React from 'react';
import './end.css';
import { useNavigate } from 'react-router-dom';

export function End( {user, game, setGame, setStatus, setPlayerCount, setPlayers, playerCount, players, host, status, playersOut, setOut} ) {
    const navigate = useNavigate();

    if (!game) {
        return (
            <main className="end">
                <h2>Loading results...</h2>
            </main>
        );
    }

    async function end() {
        const res = await fetch("/api/game", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
        } )
        if (res.ok) {
            const data = await res.json()
        }
        setGame(null)
        navigate("/account")
    }

    function isOut(num) {
        console.log(game)
        if (game.playersOut.length === 0) return true;
        for (const outPlayer of game.playersOut){
            let player = game.players[num]
            console.log(player)
            if (outPlayer[0] == player.name) {
                return true;
            }
        }
        return false;
    }

    function outPhoto(num) {
        for (const player of game.playersOut){
            if (player[0] == game.players[num].name) {
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
            {game.players.map((player, index) => {
                    const outData = game.playersOut.find(outPlayer => 
                        outPlayer[0] === player.name || outPlayer[0]?.name === player.name
                    );
                    if (!outData) return null;
                    const photoSrc = outData[1] || "photo_placeholder.png";
                    return (
                        <div className="player" key={index}>
                            <img className="photo" height="100px" width="80px" alt="Player Elimination Photo" src={photoSrc}></img>
                            <p>{console.log(photoSrc)}</p>
                            <p>{player.name}</p>
                        </div>
                    );
                })}
            </div>
        <button className="styled_button"  onClick={() => end()}>Leave Game</button>
    </main>
  );
}