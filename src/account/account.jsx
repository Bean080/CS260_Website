import React from "react";
import "./account.css";
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export function Account({user, setCode, setUser, setHost,  }) {
    const navigate = useNavigate();
    const [userText, setUserText] = React.useState("")
    const [passwordText, setPassText] = React.useState("")
    
    class User {
        constructor(name ="", password="", lastCode="####"){
        this.name = name;
        this.password = password;
        this.lastCode = lastCode;
        this.profilePhoto = "";
        }
    };

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

    function login() {
        if (!validCredentials(userText, passwordText)) {
            return;
        }
        const savedUsers = localStorage.getItem("usersMemory");
        const usersMemory = savedUsers ? JSON.parse(savedUsers) : [];
        console.log(usersMemory);
        for (const account of usersMemory) {
            if (account.name == userText && account.password == passwordText){
                console.log(account);
                localStorage.setItem("user", JSON.stringify(account));
                setUser(account)
                toast.success('Signed in')
                return;
            }
        }
        toast.error('Account Doesn\'t Exist')
    };

    function createAccount() {
        if (!validCredentials(userText, passwordText)) {
            return;
        }
        const savedUsers = localStorage.getItem("usersMemory");
        const usersMemory = savedUsers ? JSON.parse(savedUsers) : [];

        for (const account of usersMemory) {
            if (account.name === userText && account.password === passwordText){
                toast.error('Signed in')
                return;
            }
        } 
        const account = new User(userText, passwordText, "####")
        localStorage.setItem("user", JSON.stringify(account));
        setUser(account);
        setHost(account.name);
        usersMemory.push(account);
        localStorage.setItem("usersMemory", JSON.stringify(usersMemory));
        toast.success('Created new user');
        console.log("Created Account");
    }

    function logout() {
        localStorage.removeItem("code");
        localStorage.removeItem("user");
        localStorage.removeItem("host");
        setUser((new User()));
        setCode("####");
        toast.success("Logged Out");
    };

    function userChange(e) {
        setUserText(e.target.value);
    }

    function passChange(e) {
        setPassText(e.target.value);
    }

    function codeUpdate(id) {
        const code = document.getElementById(id).value;
        if (code.length === 4) {

            const savedUsers = localStorage.getItem("usersMemory");
            const usersMemory = savedUsers ? JSON.parse(savedUsers) : [];
            const account = usersMemory.find(value => value.name === user.name);

            setCode(code || "####");
            localStorage.setItem("code", code);
            account.lastCode = code;
            user.lastCode = code;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("usersMemory", JSON.stringify(usersMemory));
        } else {
            toast.error("Code must be 4 numbers")
        }
    };

    function host() {
        if (!user.name) {
            toast.error("Please sign in first");
            return;
        }
        codeUpdate("codeInput");
        setHost(user.name);
        localStorage.setItem("host",user.name);

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
            setCode(code);
            navigate("/");
        } else {
            alert("Game code doesn't match existing games.")
        }
    }




  return (
    <main id="account">
        <div><Toaster/></div>
        <div className="center">
            <p>Sign In</p>
            <div><input id="user" type="text" placeholder="Username" onChange={userChange} /></div>
            <div><input id="password" type="password" placeholder="Password" onChange={passChange} /></div>
            <div>
                <button className="styled_button" type="submit" onClick={login}>Submit</button>
                {!user.name && <button className="styled_button" onClick={createAccount}>Create</button>}
                {user.name && <button className="styled_button" onClick={logout}>Logout</button>}
            </div>
        </div>
            <div className="center">
                <p>Create Game</p>
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
