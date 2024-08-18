import "./Controls.css";

// Компонент с ползунками для управления скоростью и интервалами стрельбы
const Controls = ({
                      redSpeed, setRedSpeed, redShootInterval, setRedShootInterval,
                      blueSpeed, setBlueSpeed, blueShootInterval, setBlueShootInterval
                  }) => (
    <div className="controls">
        <section>
            <div>
                <label>Red Ball Speed: {redSpeed}</label>
                <input type="range" min="1" max="10" value={redSpeed} onChange={e => setRedSpeed(Number(e.target.value))} />
            </div>
            <div>
                <label>Red Ball Shoot Interval (ms): {redShootInterval}</label>
                <input type="range" min="500" max="5000" step="100" value={redShootInterval} onChange={e => setRedShootInterval(Number(e.target.value))} />
            </div>
        </section>

        <section>
            <div>
                <label>Blue Ball Speed: {blueSpeed}</label>
                <input type="range" min="1" max="10" value={blueSpeed} onChange={e => setBlueSpeed(Number(e.target.value))} />
            </div>
            <div>
                <label>Blue Ball Shoot Interval (ms): {blueShootInterval}</label>
                <input type="range" min="500" max="5000" step="100" value={blueShootInterval} onChange={e => setBlueShootInterval(Number(e.target.value))} />
            </div>
        </section>

    </div>
);

export default Controls;