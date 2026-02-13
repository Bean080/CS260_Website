import React from 'react';

export function Account() {
  return (
    <main>
        <form action="../../index.html" method="post">
            <div id="center">
                <div>
                    <label for= "user">Username</label>
                    <input id= "user" type= "text" required></input>
                </div>
                <div>
                    <label for= "password">Password</label>
                    <input id= "password" type="password" required></input>
                </div>
            </div>
            <button id= "center" className="styled_button" type="Submit">Submit</button>
        </form>
    </main>
  );
}