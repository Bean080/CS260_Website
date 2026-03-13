import React, { useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './game.css';
import { useNavigate } from 'react-router-dom';


export function Game({user , game, setGame, setStatus , setPlayerCount , setPlayers , playerCount , players , host , status, playersOut, setOut}) {
    const [cameraOn, setCamera] = React.useState(false);
    const [dropdown, setDropdown] = React.useState("hide_dropdown")
    const navigate = useNavigate();
    const [target, setTarget] = React.useState(localStorage.getItem("target") || null)

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

          console.log(data.target)
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

            const imageData = canvas.toDataURL('image/png');
            setImage(imageData);
            out(imageData);
        }
    }

    //notifications
    async function out(takenPhoto){
        const response = await confirmOut(takenPhoto);

        if (response) {
            toast.custom(
                <div className="out">
                    <img className="photo" alt="Photo of victim" src={takenPhoto ? takenPhoto : "photo_placeholder.png"}></img>
                    <h3 className="out_text">{target} is Out!</h3>
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

    function confirmOut(takenPhoto) {
        return new Promise((resolve) => (
            toast.custom(
                <div className="confirmation">
                    <img className="confirm_photo" src={takenPhoto}></img>
                    <p>Is this {target}?</p>
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


    function takeOutPlayer(playerOut, photo){
        const orderData = JSON.parse(localStorage.getItem("targetMemory"));
        const circle = new LinkedList();
        orderData.forEach(p => circle.add(p));
        circle.tail.next = circle.head;
        circle.remove(playerOut);
        console.log(user)
        const nextTarget = circle.targetOf(user.name);
        
        const newArray = circle.toArray();
        localStorage.setItem("targetMemory", JSON.stringify(newArray));
        localStorage.setItem("target", nextTarget);
        setTarget(nextTarget);
        const pair = [playerOut, photo]
        setOut([...playersOut, pair]);
        localStorage.setItem("out", JSON.stringify(playersOut));
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

    useEffect( () => {
        const interval = setInterval( () => {
            if (playersOut.length < playerCount-2) {
                const targetMemory = JSON.parse(localStorage.getItem("targetMemory"));
                const num = Math.floor(Math.random() * targetMemory.length);
                let testPerson = targetMemory[num];
                if (testPerson === user.name) return;
                takeOutPlayer(testPerson, "photo_placeholder.png");

                toast.custom(
                <div className="out">
                    <img className="photo" alt="Photo of victim" src={"photo_placeholder.png"}></img>
                    <h3 className="out_text">{testPerson} is Out!</h3>
                    <button className="x_button" onClick={() => toast.remove()}>X</button>
                </div>,
                {style: {
                    background: 'transparent',
                    minWidth: "90vw",
                    minHeight: "40vh",
                }})
            }
        },20000)
        return () => clearInterval(interval);
    },[playersOut, target])

    // useEffect(() => {
    //         if (target == user.name && playersOut.length == playerCount-1) end();
    // }, [target])

    return (
        <main id='game'>
            <div><Toaster position="center"/></div>
            <div className="dropdown">
                <button hidden className="styled_button" onClick={() => test()}>Remove Player</button>
                <button className="styled_button drop_button" type="button" onClick={() => showTarget()}>
                    View Target
                </button>

                <div className={`${dropdown} dropdown_content`}>
                    <img alt="Photo of Target" src="photo_placeholder.png" className="target_picture"></img>
                    <h3>{target != user ? target : null}</h3>
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