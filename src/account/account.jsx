import React, { useEffect } from "react";
import "./account.css";
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export function Account({user, game, setGame, setCode, setUser, setHost, setPlayers}) {
    const navigate = useNavigate();
    const [userText, setUserText] = React.useState("")
    const [passwordText, setPassText] = React.useState("")

    function validCredentials(username, password) {
        if (username && username.length >= 3) {
            if (password && password.length >= 8) {
                return true;
            }
            toast.error("Password Invalid (must be at least 8 characters)")
        }
        toast.error("Username Invalid (must be at least 3 characters)")
        return false;
    }


    async function login() {
        if (!validCredentials(userText, passwordText)) {
            return;
        }
        let res = await fetch("api/auth", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name:userText, password:passwordText})
        })
        if (res.ok) {
            const data = await res.json();
            const account = JSON.parse(data.account);
            setUser(account)
            setCode(account.code)
            toast.success('Signed in')
        } else {
            toast.error('Account Doesn\'t Exist')
        }
    };


    async function createAccount() {
        if (!validCredentials(userText, passwordText)) {
            return;
        }
        let res = await fetch("api/auth", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name:userText, password:passwordText})
        })
        if (res.ok) {
            res = await res.json();
            console.log(res)
            const account = JSON.parse(res.account);
            console.log(account)
            setUser(account);
            setCode(account.code);
            toast.success('Created new user');
        } else {
            toast.error('Account already exists')
        }
    }

    async function logout() {
        if (game) {
            toast.error("bug to fix")
        }
        let res = await fetch("api/auth", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: ""
        })
        if (res.ok) {
            setUser(null);
            toast.success("Logged Out");
        }
    };

    function userChange(e) {
        setUserText(e.target.value);
    }

    function passChange(e) {
        setPassText(e.target.value);
    }

    async function codeUpdate(code) {
        if (code.length === 4) {
            let res = await fetch("api/user/code", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({code:code})
            })
            if (res.ok) {
                const data = await res.json();
                const newCode = data.lastCode;
                setCode(newCode);
            }
        } else {
            toast.error("Code must be 4 numbers")
        }
    };

    //Make lobby and set user as host
    async function host() {
        if (!user) {
            toast.error("Please sign in first");
            return;
        }
        const code = document.getElementById("codeInput").value;
        let res = await fetch("api/game", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({code:code})
            })
        if (res.ok) {
            console.log("making lobby")
            res = await res.json();
            const newHost = JSON.parse(res.host);
            codeUpdate(code);
            setGame(res.game)
            setHost(newHost);
        } else {
            toast.error("Lobby code in use")
        }
        navigate("/");
    }

    async function join() {
        if (!user) {
            alert("Please sign in first");
            return;
        }
        const code = document.getElementById("codeInput").value;

        let res = await fetch("api/game", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({code:code})
            })

        if (res.ok) {
            res = await res.json();
            const newHost = JSON.parse(res.host);
            codeUpdate(code);
            setHost(newHost);
        }
    }


    async function toggleAI() {
        if (!user) {
            toast.error("Login Required")
            return;
        }
        let res = await fetch("/api/user/ai", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
            })
        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            console.log(user.ai);
        }
    }

    async function getHandlerMessage() {

        try {
            const res = await fetch("https://api.adviceslip.com/advice");
            const data = await res.json();
            toast.custom(
                <div className="HQ">
                    <p>Message from HQ:</p>
                    <p>{data.slip.advice}</p>
                    <button className="styled_button" onClick={() => toast.remove()}>X</button>
                </div>, {duration: Infinity})
        } catch (error) {
            toast.error("Comms are down.");
        }
    }


  return (
    <main id="account">
        <div className="center">
            <p>Sign In</p>
            <div><input id="user" type="text" placeholder="Username" onChange={userChange} /></div>
            <div><input id="password" type="password" placeholder="Password" onChange={passChange} /></div>
            <div>
                <button className="styled_button" type="submit" onClick={login}>Submit</button>
                {!user && <button className="styled_button" onClick={createAccount}>Create</button>}
                {user && <button className="styled_button" onClick={logout}>Logout</button>}
            </div>
        </div>
            <div className="center">
                <p>Create Game</p>
                <div><input id="codeInput" type="text" placeholder="Code" required /></div>
                <div><button className="styled_button" onClick={ () => host()}>Host</button>
                <button className="styled_button" onClick={ () => join()}>Join</button>
            </div>
        </div>
        {user && <div className="center">
            <button className="styled_button" onClick={toggleAI}>Toggle AI : {user.ai? "On":"Off"}</button>
            <button className="styled_button" onClick={getHandlerMessage}>Contact HQ</button>
        </div>}
        <div className="center"></div>
    </main>
  );
}
