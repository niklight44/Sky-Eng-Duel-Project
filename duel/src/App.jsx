import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas/GameCanvas.jsx';
import HeroMenu from './components/HeroMenu/HeroMenu.jsx';
import "./App.css";

const App = () => {
    const [showMenu1, setShowMenu1] = useState(false);
    const [showMenu2, setShowMenu2] = useState(false);

    return (
        <div>
            <GameCanvas />
        </div>
    );
};

export default App;
