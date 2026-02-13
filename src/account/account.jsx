import React from 'react';
import './account.css';

export function Account() {
  return (
    <main id='account'>
        <form action="../../index.html" method="post">
            <div id="center">
                <div>
                    <label htmlFor="user">Username</label>
                    <input id="user" type="text" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" required />
                </div>
            </div>
            <button className="styled_button" type="Submit">Submit</button>
        </form>
    </main>
  );
}