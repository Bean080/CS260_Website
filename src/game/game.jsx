import React from 'react';
import './game.css';

export function Game() {
  return (
    <main id='game'>
        <div className="dropdown">
            <button className="btn dropdown-toggle styled_button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                View Target
            </button>
            <div className="dropdown-menu">
                <img alt="Photo of Target" src="photo_placeholder.png" className="target_picture"></img>
                <h3 className="mt-2">Target Name</h3>
            </div>
        </div>

        <div>
            <img alt= "Camera" src= "camera_placeholder.jpg"></img>
        </div>

        <section className="foot">
            <img className= "photo" width= "140px" height= "160px" alt= "Photo of victim" src= "photo_placeholder.png"></img>
                <h3>Recent Player Out</h3>
        </section>
        <a className="styled_button" href="../finish/game_finish.html">End Game</a>
    </main>
  );
}