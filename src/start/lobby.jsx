import React from 'react';

export function Lobby() {
  return (
    <main>
        <div className= "players">
            <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player1 Name</b> 
            </div>
            <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player2 Name</b> 
            </div>
            <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player3 Name</b> 
            </div>
            <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player4 Name</b> 
            </div>
            <div className="player"> 
                <img className= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player5 Name</b> 
            </div>
            <div className="player">
                <img className= "photo" width= "80px" alt= "Host"src="../../images/photo_placeholder.png"></img>
                <form action="form.html" method="post">
                    <b>Host Name - </b> 
                    <label for="file-upload" className="file_upload">Upload Photo</label>
                    <input id="file-upload" type="file"></input>
                </form>
            </div>
        </div>
        <div>
            <button hidden type= "button" className="styled_button start_button">Start Game</button>
            <a href="src/game/game_page.html" className="styled_button start_button">Start</a>
        </div>
        <div className="foot">
            <h4>Game Mode Select</h4>
            <div id="games">
                <button className="styled_button">M-Mystery</button>
                <button className="styled_button">Assassins</button>
            </div>
        </div>
    </main>
  );
}