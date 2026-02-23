import React, { useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {LinkedList, shuffle} from "./linkedList.js";
import './game.css';
import { useNavigate } from 'react-router-dom';


export function Game({user , setStatus , setPlayerCount , setPlayers , playerCount , players , host , status, playersOut, setOut}) {
    const [cameraOn, setCamera] = React.useState(false);
    const [dropdown, setDropdown] = React.useState("hide_dropdown")
    const navigate = useNavigate();
    const savedData = localStorage.getItem("saved_players");
    const playersMemory = savedData ? JSON.parse(savedData) : [];
    const [targetList, setTargetList] = React.useState([])
    const [target, setTarget] = React.useState(localStorage.getItem("target") || null)

    useEffect(() => {
            if (target == user) end();
    }, [target])

    useEffect(() => {
        const savedOrder = localStorage.getItem("targetMemory");
        let currentOrder;

        if (!savedOrder) {
            const gameCircle = new LinkedList();
            gameCircle.createCircle(players); 
            currentOrder = gameCircle.toArray();
            localStorage.setItem("targetMemory", JSON.stringify(currentOrder));
        } else {
            currentOrder = JSON.parse(savedOrder);
        }

        const circle = new LinkedList();
        currentOrder.forEach(p => circle.add(p));
        circle.tail.next = circle.head;
        
        const myTarget = circle.targetOf(user);
        setTarget(myTarget);
        localStorage.setItem("target", myTarget);
    }, [user, players]);

    function end() {
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
            confirmOut(imageData);
            out(imageData);
        }
    }

    //notifications
    function out(takenPhoto){
        toast.custom(
            <div className="out">
                <img className="photo" alt="Photo of victim" src={takenPhoto ? takenPhoto : "photo_placeholder.png"}></img>
                <h3>Recent Player Out</h3>
            </div>,
            {style: {
                background: 'transparent',
                minWidth: "90vw",
                minHeight: "40vh",
            },}
        );
        takeOutPlayer(target)
    };

    function confirmOut(takenPhoto){
        toast.custom(
            <div className="confirmation">
                <p>Is this {target}?</p>
            </div>,
            {style: {
                background: 'beige',
                minWidth: "90vw",
                minHeight: "90vh",
            },}
        );

    };

    function takeOutPlayer(playerOut){
        const orderData = JSON.parse(localStorage.getItem("targetMemory"));
        const circle = new LinkedList();
        orderData.forEach(p => circle.add(p));
        circle.tail.next = circle.head;
        circle.remove(playerOut);
        const nextTarget = circle.targetOf(user);
        
        const newArray = circle.toArray();
        localStorage.setItem("targetMemory", JSON.stringify(newArray));
        localStorage.setItem("target", nextTarget);
        setTarget(nextTarget);
        setOut([...playersOut, playerOut]);
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

        //console.log(game.circle.str())
        //console.log(targetList)
        //console.log(targetMemory)
        takeOutPlayer(target)
        //console.log()
    }

    

    return (
        <main id='game'>
            <div><Toaster position="center"/></div>
            <div className="dropdown">
                <button onClick={() => test()}>Test</button>
                <button className="styled_button drop_button" type="button" onClick={() => showTarget()}>
                    View Target
                </button>

                <div className={`${dropdown} dropdown_content`}>
                    <img alt="Photo of Target" src="photo_placeholder.png" className="target_picture"></img>
                    <h3>{target}</h3>
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
            </div>
            

            <button className="styled_button" onClick={() => end()}>End Game</button>
        </main>
    );
}