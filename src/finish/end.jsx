import React from 'react';
import './end.css';

export function End() {
  return (
    <main id='end'>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="../../images/photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="../../images/photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="../../images/photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="../../images/photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <div className="player">
            <img className= "photo" height= "100px" width= "80px" alt= "Player Elimination Photo" src="../../images/photo_placeholder.png"></img>
            <p>Player Name</p>
        </div>
        <a className="styled_button" href="../../index.html">End Game</a>
    </main>
  );
}