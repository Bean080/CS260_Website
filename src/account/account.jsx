import React from "react";
import "./account.css";
import {useNavigate} from 'react-router-dom';

export function Account({user, setCode, setUser, setHost,  }) {
    const navigate = useNavigate();
    const [text, setText] = React.useState("")

    function login() {
        localStorage.setItem("user", text);
        setUser(text);
        const code = localStorage.getItem("code");
        setCode(code || "####");
        setHost(user)
    };

    function logout() {
        localStorage.removeItem("code");
        localStorage.removeItem("user");
        localStorage.removeItem("host");
        setUser(null);
        setCode("####");
    };

    function textChange(e) {
        setText(e.target.value);
    }

    function codeUpdate(id) {
        const code = document.getElementById(id).value;
        if (code.length === 4) {
            setCode(code || "####");
            localStorage.setItem("code", code);
        } else {
            alert("Code must be 4 numbers")
        }
        return code;
    };

    function host() {
        if (!user) {
            alert("Please sign in first");
            return;
        }
        setUser(user)
        codeUpdate("codeInput");
        setHost(user);
        localStorage.setItem("host",user);
        
        setCode(document.getElementById("codeInput").value);
        navigate("/");
    }

    function join() {
        if (!user) {
            alert("Please sign in first");
            return;
        }
        const code = document.getElementById("codeInput").value;
        const servers = ["4545", "2004", "0002"];
        if (servers.includes(code)) {
            codeUpdate("codeInput");
            setHost("Someone New!");
            localStorage.setItem("host","Someone New!");
            lsetCode(code);
            navigate("/");
        } else {
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
