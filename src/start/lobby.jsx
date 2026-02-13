import React from 'react';

export function Lobby() {
  return (
    <main>
        <div class= "players">
            <div class="player"> 
                <img class= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player1 Name</b> 
            </div>
            <div class="player"> 
                <img class= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player2 Name</b> 
            </div>
            <div class="player"> 
                <img class= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player3 Name</b> 
            </div>
            <div class="player"> 
                <img class= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player4 Name</b> 
            </div>
            <div class="player"> 
                <img class= "photo" width= "80px" alt= "Player1" src="../../images/photo_placeholder.png"></img>
                <b>Player5 Name</b> 
            </div>
            <div class="player">
                <img class= "photo" width= "80px" alt= "Host"src="../../images/photo_placeholder.png"></img>
                <form action="form.html" method="post">
                    <b>Host Name - </b> 
                    <label for="file-upload" class="file_upload">Upload Photo</label>
                    <input id="file-upload" type="file"></input>
                </form>
            </div>
        </div>
        <div>
            <button hidden type= "button" class="styled_button start_button">Start Game</button>
            <a href="src/game/game_page.html" class="styled_button start_button">Start</a>
        </div>
        <div class="foot">
            <h4>Game Mode Select</h4>
            <div id="games">
                <button class="styled_button">M-Mystery</button>
                <button class="styled_button">Assassins</button>
            </div>
        </div>
    </main>
  );
}