import React, {useEffect} from 'react';
import './main.css';
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export function Lobby({user , gameCode,  setUser , setStatus , setPlayerCount , setPlayers , playerCount , players , host , status}) {
    const navigate = useNavigate();
    const testPlayers = ["James", "Garry", "Tiffany", "Wallace", "David", "Liz", "Dallin", "Mary"]
    const savedData = localStorage.getItem("saved_players");
    const playersMemory = savedData ? JSON.parse(savedData) : [];

    function play() {
        if (playerCount < 2) {
            toast.error("You need at least 2 people to play")
            return
        } else if (localStorage.getItem("code") === "####") {
            toast.error("Invalid Code")
            return
        }

        setStatus("playing");
        navigate("/game");
    }

    function join() {
            if (playerCount < 8) {
                let added = false;
                while (!added) {
                    const num = Math.floor(Math.random() * testPlayers.length);
                    let player = testPlayers[num];
                    if (!players.includes(player)) {
                        const nextCount = playerCount+1;
                        const nextPlayers = [...players, player];

                        setPlayerCount(nextCount)
                        setPlayers(nextPlayers)

                        localStorage.setItem("playerCount", nextCount);
                        added = true;
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

    function removePlayer(playerLeaving) {
        const index = players.indexOf(playerLeaving);
        console.log(players);
        console.log(index);
        if (index > -1) {
            console.log(players[index])
            const newList = players.filter(person => person !== playerLeaving);
            const newCount = playerCount-1;
            setPlayers(newList)
            setPlayerCount(newCount);
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

    useEffect( () => {
        const interval = setInterval( () => {
            if (user.name) join();
        },15000)
        return () => clearInterval(interval);
    },[players, playerCount])

    function lobbyTest() {
        removePlayer(players[1])
    }


  return (
    <main id="lobby">
        <div><Toaster/></div>
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
                <img className= "photo" alt= "Host" src={profilePhoto(user.photo)}></img>
                <b>(YOU) {user.name}</b> 
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