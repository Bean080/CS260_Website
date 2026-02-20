import React, { useRef, useEffect } from 'react';
import './game.css';
import { useNavigate } from 'react-router-dom';

export function Game({ user, lobby }) {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const buttonRef = useRef(null);

    function end() {
        lobby.status = "ending";
        navigate("/end");
    }


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
                <img alt="Camera" src="camera_placeholder.jpg"></img>
                <video id="webcam" ref={videoRef} autoPlay playsInline></video>
                <button id="startButton" ref={buttonRef}>Start Camera</button>
            </div>

            <section className="foot">
                <img className="photo" width="140px" height="160px" alt="Photo of victim" src="photo_placeholder.png"></img>
                <h3>Recent Player Out</h3>
            </section>
            <button className="styled_button" onClick={() => end()}>End Game</button>
        </main>
    );
}