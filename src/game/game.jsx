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

    // photos
    const canvasRef = useRef(null);
    const [image, setImage] = React.useState(null);
    const [flash, setFlash] = React.useState(false);
    function takePhoto() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/png');
            localStorage.setItem("photo", imageData);
            setImage(imageData);

            setFlash(true);
            setTimeout(() => setFlash(false), 150);
        }
    }

    //notifications
    function pop(){
        toast( (t) => (
            <div className="toast">
                <img className="photo" alt="Photo of victim" src={image ? image : "photo_placeholder.png"}></img>
                <h3>Recent Player Out</h3>
            </div>
        ));
    };

    //target
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
                    <img alt="Photo of Target" src={image ? image : "photo_placeholder.png"} className="target_picture"></img>
                    <h3>Target Name</h3>
                </div>
            </div>

            <div>
                {flash && <div className="flash_effect"></div>}
                <canvas hidden ref={canvasRef} width="640" height="480"></canvas>
                <div className="camera">
                    {cameraOn && <video id="webcam" ref={videoRef} autoPlay playsInline></video>}
                    {!cameraOn && <button className="styled_button start_cam" onClick={() => setCamera(true)}>Start Camera</button>}
                    {cameraOn && <button className="cam_button" onClick={() => takePhoto()}><div className="inner_circle"></div></button>}
                </div>
                <img src={image}></img>
            </div>
            

            <button className="styled_button" onClick={() => end()}>End Game</button>
        </main>
    );
}