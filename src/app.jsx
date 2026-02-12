import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <body>
        <div class="vignette"></div>

        <header>
            <h1>Photogenic</h1>
            <h5 id="code">Game Code: ####</h5>
            <a href="account_page.html" class="styled_button">Account</a>
        </header>

        <main>App Here</main>

        <footer>
            <a id="code" href="https://github.com/Bean080/CS260_Website/tree/main">Benjamin Clarke - GitHub (clickhere)</a>
        </footer>
    </body>
  );
}