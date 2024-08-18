


// Компонент для отображения счета
const Scoreboard = ({ redScore, blueScore }) => (
    <div className="scoreboard">
        <div>Red Hits: {redScore}</div>
        <div>Blue Hits: {blueScore}</div>
    </div>
);

export default Scoreboard;