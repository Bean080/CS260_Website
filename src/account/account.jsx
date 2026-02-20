import React from "react";
import "./account.css";


export function Account({ setGameCode }) {

    const codeUpdate = (id) => {
        const code = document.getElementById(id).value;
        setGameCode(code || "####");
    };

    const signIn = (user, pass) => {
        const name = document.getElementById(user).value;
        const password = document.getElementById(pass).value;
        
        setGameCode(code || "####");
    };


  return (
    <main id="account">
        <div className="center">
            <div><input id="user" type="text" placeholder="Username" required /></div>
            <div><input id="password" type="password" placeholder="Password" required /></div>
            <div><button className="styled_button" onClick={() => doNothing("user", "password")} >Submit</button></div>
        </div>
        <div className="center">
            <div><input id="host_code" type="text" placeholder="Code" required /></div>
            <div><button className="styled_button" onClick={() => codeUpdate("host_code")}>Host</button></div>
        </div>
        <div className="center">
            <div><input id="join_code" type="text" placeholder="Code" required /></div>
            <div><button className="styled_button" onClick={() => codeUpdate("join_code")}>Join</button></div>
        </div>
    </main>
  );
}
