import React, { useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './game.css';
import { useNavigate } from 'react-router-dom';


export function Game({ user, lobby }) {
    const [cameraOn, setCamera] = React.useState(false);
    const [dropdown, setDropdown] = React.useState("hide_dropdown")
    const navigate = useNavigate();

    function end() {
        lobby.status = "ending";
        navigate("/end");
    }

    //video
    const videoRef = useRef(null);
    useEffect(() => {
        if (!cameraOn) return;
        const video = videoRef.current;
        if (!video) return;
        let stream;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraOn]);


    //notifications
    function pop(){
        toast( (t) => (
            <div className="toast">
                <img className="photo" width="140px" height="160px" alt="Photo of victim" src="photo_placeholder.png"></img>
                <h3>Recent Player Out</h3>
            </div>
        ));
    };

    function showTarget() {
        if (dropdown === "hide_dropdown") {
            setDropdown("");
        } if (dropdown === "") {
            setDropdown("hide_dropdown")
        }
    }

    return (
        <main id='game'>
            <div><Toaster position="center"/></div>

            <div className="dropdown">
                <button className="styled_button drop_button" type="button" onClick={() => showTarget()}>
                    View Target
                </button>

                <div className={`${dropdown} dropdown_content`}>
                    <img alt="Photo of Target" src="photo_placeholder.png" className="target_picture"></img>
                    <h3>Target Name</h3>
                </div>
            </div>

            <div>
                {cameraOn && <video id="webcam" ref={videoRef} autoPlay playsInline></video>}
                {!cameraOn && <button className="styled_button start_cam" onClick={() => setCamera(true)}>Start Camera</button>}
            </div>

            <button className="styled_button" onClick={() => end()}>End Game</button>
        </main>
    );
}