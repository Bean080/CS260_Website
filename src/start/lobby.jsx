import React, {useEffect} from 'react';
import './main.css';
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export function Lobby({user , game, gameCode,  setUser , setGame , setPlayerCount , setPlayers , playerCount , players , host , status}) {
    const navigate = useNavigate();
    const testPlayers = ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"]
    const savedData = localStorage.getItem("saved_players");
    const playersMemory = savedData ? JSON.parse(savedData) : [];

    async function play() {
        console.log("play")
        if (game.playerCount < 2) {
            toast.error("You need at least 2 people to play")
            return
        } else if (localStorage.getItem("code") === "####") {
            toast.error("Invalid Code")
            return
        }
        let res = await fetch('/api/game/start', {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({status:'assassins'})
        })
        navigate("/game");
    }


    async function join () { //I will need to add player as an argument
        //a temporary example
        let response = await fetch("api/test/player", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const data = await response.json();
        let player = data.player;
        //end temporary
        let res = await fetch("/api/game/add", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({joiner: player})
        })
        if (res.ok) {
            const data = await res.json();
            const game = data.game;
            setGame(game);
        } else {
            toast.error("Max players reached")
        }
    }


    function joined(threshold) {
        if (!game) {
            return false;
        }
        if (game.playerCount >= threshold) {
            return true;
        }
        return false;
    }

    async function removePlayer(playerLeaving) {
        let res = await fetch("/api/game/remove", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({leaver: playerLeaving})
        })
        if (res.ok) {
            const data = await res.json();
            const game = data.game;
            setGame(game);
        }
    }

    function photoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const fileData = event.target.result;
                console.log(fileData);

                const newUser = { ...user, photo: fileData };
                setUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));
            };

            reader.readAsDataURL(file);
        }
    }

    function profilePhoto(photo) {
        if (!photo) {
            return "photo_placeholder.png"
        }
        return photo;
    }

    // useEffect( () => {
    //     const interval = setInterval( () => {
    //         if (user.name) join();
    //     },15000)
    //     return () => clearInterval(interval);
    // },[players, playerCount])

    function lobbyTest() {
        removePlayer(game.players[1])
    }


  return (
    <main id="lobby">
        <div><Toaster/></div>
        <div className= "players">
            {joined(2) && <div className="player"> 
                <img className= "photo" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player2 - {game? game.players[1].name : "..."}</b> 
            </div>}
            {joined(3) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player3 - {game? game.players[2].name : "..."}</b> 
            </div>}
            {joined(4) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player4 - {game? game.players[3].name : "..."}</b> 
            </div>}
            {joined(5) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player5 - {game? game.players[4].name : "..."}</b> 
            </div>}
            {joined(6) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player6 - {game? game.players[5].name : "..."}</b> 
            </div>}
            {joined(7) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player7 - {game? game.players[6].name : "..."}</b> 
            </div>}
            {joined(8) && <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="photo_placeholder.png"></img>
                <b>Player8 - {game? game.players[7].name : "..."}</b> 
            </div>}
            <div className="player">
                <img className= "photo" alt= "Host" src={user.name? user.photo : "photo_placeholder.png"}></img>
                <b>(YOU) {user? user.name : "Sign in"}</b> 
                <label htmlFor="file-upload" className="file_upload" >Upload Photo</label>
                <input id="file-upload" type="file" accept="image/*" onChange={photoUpload}></input>
            </div>
        </div>
        <div>
            {user.name && <button type= "button" className="styled_button start_button" onClick={() => play()}>Start Game</button>}
        </div>
        <button className="styled_button test" onClick={() => lobbyTest()}>Remove Player (test)</button>
        <button className="styled_button test" onClick={() => join()}>Add Player (test)</button>
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