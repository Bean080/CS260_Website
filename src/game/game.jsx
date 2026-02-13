import React from 'react';

export function Game() {
  return (
    <main>
        <div classNameName="dropdown">
            <button className="btn dropdown-toggle styled_button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                View Target
            </button>
            <div className="dropdown-menu">
                <img width="140px" height="160px" alt="Photo of Target" src="../../images/photo_placeholder.png" className="target_picture"></img>
                <h3 className="mt-2">Target Name</h3>
            </div>
        </div>

        <div>
            <image className="camera" width= "140px" alt= "Camera" src= "../../images/camera_placeholder.jpg"></image>
            <button className="photo_button" type="button"><span className="camera_emoji">🔴</span></button>
        </div>

        <section className="foot">
            <image className= "photo" width= "140px" height= "160px" alt= "Photo of victim" src= "../../images/photo_placeholder.png"></image>
                <h3>Recent Player Out</h3>
        </section>
        <a className="styled_button" href="../finish/game_finish.html">End Game</a>
    </main>
  );
}