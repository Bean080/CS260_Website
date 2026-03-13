import React, { useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './game.css';
import { useNavigate } from 'react-router-dom';


export function Game({user , game, setGame, setStatus , setPlayerCount , setPlayers , playerCount , players , host , status, playersOut, setOut}) {
    const [cameraOn, setCamera] = React.useState(false);
    const [dropdown, setDropdown] = React.useState("hide_dropdown")
    const navigate = useNavigate();
    const [target, setTarget] = React.useState(null)

      useEffect(() => {
        console.log("loading target data...")
        try {
          getTargets()
        } catch (error) {
          return
        }
      },[]);
    
      async function getTargets() {
        const res = await fetch("/api/assassins", {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        } )
        if (res.ok) {
          let data = await res.json();

          console.log(data.target.name)
          const game = data.game;
          setTarget(data.target)
          setGame(game)
        }
      }


    function end() {
        toast.dismiss();
        localStorage.removeItem("targetMemory")
        localStorage.removeItem("target")
        setStatus("ending");
        console.log(status)
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
    function takePhoto() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg', 0.5);
            setImage(imageData);
            out(imageData);
        }
    }

    //out notifications
    async function out(takenPhoto){
        const targetProfilePhoto = target?.photo;
        let aiVerified = "None";

        if (targetProfilePhoto && targetProfilePhoto !== "photo_placeholder.png" && game.host.ai) {
            const loadingToastId = toast.loading("Analyzing the photo...");
            try {
                const res = await fetch('/api/ai/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        targetPhotoBase64: targetProfilePhoto,
                        takenPhotoBase64: takenPhoto
                    })
                });

                const data = await res.json();
                aiVerified = data.verified;
            } catch (error) {
                console.error("AI check failed", error);
            } finally {
                toast.dismiss(loadingToastId);
            }
        }

        const response = await confirmOut(takenPhoto, aiVerified);

        if (response) {
            toast.custom(
                <div className="out">
                    <img className="photo" alt="Photo of victim" src={takenPhoto ? takenPhoto : "photo_placeholder.png"}></img>
                    <h3 className="out_text">{target.name} is Out!</h3>
                    <button className="x_button" onClick={() => toast.remove()}>X</button>
                </div>,
                {style: {
                    background: 'transparent',
                    minWidth: "90vw",
                    minHeight: "40vh",
                }}
            );
            takeOutPlayer(target, takenPhoto);
        } else {
            toast.custom(
                <div className="out">
                    <img className="photo" alt="Photo of victim" src={takenPhoto ? takenPhoto : "photo_placeholder.png"}></img>
                    <h3>{user.name} is a LIAR!</h3>
                    <button className="x_button" onClick={() => toast.remove()}>X</button>
                </div>,
                {style: {
                    background: 'transparent',
                    minWidth: "90vw",
                    minHeight: "40vh",
                }}
            )
        }
    };

    //confirm elimination
    function confirmOut(takenPhoto, aiVerified) {
        let borderColor = "none";

        if (aiVerified) borderColor = "6px solid #08461f";
        if (!aiVerified) borderColor = "6px solid #c90e0e";
        if (aiVerified==="None") borderColor = "6px solid transparent";

        return new Promise((resolve) => (
            toast.custom(
                <div className="confirmation">
                    <img className="confirm_photo" src={takenPhoto} style={{ border: borderColor, borderRadius: "10px" }}></img>
                    <p>Is this {target.name}?</p>
                    <div className="confirm_buttons">
                        <button className="styled_button" onClick={() => {
                            toast.remove();
                            resolve(true);
                        }}>Yes!</button>
                        <button className="styled_button" onClick={() => {
                            toast.remove();
                            resolve(false)
                        }}>No...</button>
                    </div>
                </div>, {duration: Infinity})
        ))
    };

    //call removal
    async function takeOutPlayer(playerOut, photo){
        const res = await fetch("/api/assassins", {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({player:playerOut, photo:photo})
        } )
        if (res.ok) {
            const data = await res.json();
            setTarget(data.target);
            setGame(data.game);
        }
    
    }

    //target
    function showTarget() {
        if (dropdown === "hide_dropdown") {
            setDropdown("");
        } if (dropdown === "") {
            setDropdown("hide_dropdown")
        }
    }

    function test() {
        const photo = "camera_placeholder.jpg"
        takeOutPlayer(target, photo);
    }

    // useEffect( () => {
    //     const interval = setInterval( () => {
    //         if (playersOut.length < playerCount-2) {
    //             const targetMemory = JSON.parse(localStorage.getItem("targetMemory"));
    //             const num = Math.floor(Math.random() * targetMemory.length);
    //             let testPerson = targetMemory[num];
    //             if (testPerson === user.name) return;
    //             takeOutPlayer(testPerson, "photo_placeholder.png");

    //             toast.custom(
    //             <div className="out">
    //                 <img className="photo" alt="Photo of victim" src={"photo_placeholder.png"}></img>
    //                 <h3 className="out_text">{testPerson} is Out!</h3>
    //                 <button className="x_button" onClick={() => toast.remove()}>X</button>
    //             </div>,
    //             {style: {
    //                 background: 'transparent',
    //                 minWidth: "90vw",
    //                 minHeight: "40vh",
    //             }})
    //         }
    //     },20000)
    //     return () => clearInterval(interval);
    // },[playersOut, target])

    useEffect(() => {
        if (target) {
            if (target.name == user.name && game.playersOut.length == game.playerCount-1) end();
        }
    }, [target])




    return (
        <main id='game'>
            <div><Toaster position="center"/></div>
            <div className="dropdown">
                <button className="styled_button" onClick={() => test()}>Remove Player</button>
                <button className="styled_button drop_button" type="button" onClick={() => showTarget()}>
                    View Target
                </button>

                <div className={`${dropdown} dropdown_content`}>
                    <img alt="Photo of Target" src={target ? target.photo : "photo_placeholder.png"} className="target_picture"></img>
                    <h3>{ target ? target.name : null }</h3>
                </div>
            </div>

            <div>
                <canvas hidden ref={canvasRef} width="640" height="480"></canvas>
                <div className="camera">
                    {cameraOn && <video id="webcam" ref={videoRef} autoPlay playsInline></video>}
                    {!cameraOn && <button className="styled_button start_cam" onClick={() => setCamera(true)}>Start Camera</button>}
                    {cameraOn && <button className="cam_button" onClick={() => takePhoto()}><div className="inner_circle"></div></button>}
                </div>
            </div>
            
            <button className="styled_button" onClick={() => end()}>End Game</button>
        </main>
    );
}