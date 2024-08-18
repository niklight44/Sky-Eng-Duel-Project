import "./HeroMenu.css";

// Компонент для выбора цвета шаров
const HeroMenu = ({ clickPos, onChangeColor, onClose }) => (
    <div className="menu" style={{ top: clickPos.y, left: clickPos.x }}>
        <h3>Select Spell Color</h3>
        <select onChange={(e) => onChangeColor(e.target.value)}>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="purple">Purple</option>
        </select>
        <button onClick={onClose}>Close</button>
    </div>
);

export default HeroMenu;