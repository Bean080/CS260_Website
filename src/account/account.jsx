import React from "react";
import "./account.css";


export function Account({setGameCode, setUser, user, lobby}) {
    const [text, setText] = React.useState("")

    function login() {
        localStorage.setItem("user", text);
        setUser(text);
        const code = localStorage.getItem("code");
        setGameCode(code || "####");
        lobby.host = text;
    };

    function logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("lobby");
        setUser(null);
        setGameCode("####");
        lobby.reset();
    };

    function textChange(e) {
        setText(e.target.value);
    }

    function codeUpdate(id) {
        const code = document.getElementById(id).value;
        if (code.length === 4) {
            setGameCode(code || "####");
            localStorage.setItem("code", code);
        } else {
            alert("Code must be 4 numbers")
        }
        return code;
    };

    function host() {
        codeUpdate("codeInput");
        lobby.reset();
        lobby.host = user;
        lobby.code = document.getElementById("codeInput").value;
    }

    function join() {
        const code = document.getElementById("codeInput").value;
        const servers = ["4545", "2004", "0002"];
        if (servers.includes(code)) {
            codeUpdate("codeInput");
            lobby.reset();
            lobby.host = "Someone New!";
            lobby.code = code;
        } else {
            lobby.reset();
            alert("Game code doesn't match existing games.")
        }
        
    }


  return (
    <main id="account">
        <div className="center">
            <div><input id="user" type="text" placeholder="Username" onChange={textChange} required /></div>
            <div><input id="password" type="password" placeholder="Password" required /></div>
            <div>
                <button className="styled_button" onClick={login}>Submit</button>
                {user && <button className="styled_button" onClick={logout}>Logout</button>}
            </div>
        </div>
        <div className="center">
            <div><input id="codeInput" type="text" placeholder="Code" required /></div>
            <div><button className="styled_button" onClick={ () => host()}>Host</button>
            <button className="styled_button" onClick={ () => join()}>Join</button>
        </div>
        </div>
        <div className="center"></div>
        <div className="center"></div>
    </main>
  );
}
