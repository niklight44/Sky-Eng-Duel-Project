import React, { useRef, useEffect, useState } from "react";
import "./Canvas.css";
import Controls from "../Controls/Controls.jsx";
import HeroMenu from "../HeroMenu/HeroMenu.jsx";
import Scoreboard from "../Scoreboard/Scoreboard.jsx";


const GameCanvas = () => {
    const canvasRef = useRef(null);  // Ссылка на элемент canvas
    const [redScore, setRedScore] = useState(0);  // Состояние для счета красной команды
    const [blueScore, setBlueScore] = useState(0);  // Состояние для счета синей команды
    const [redSpeed, setRedSpeed] = useState(2);  // Состояние для скорости красного мяча
    const [redShootInterval, setRedShootInterval] = useState(2000);  // Интервал стрельбы красного мяча (в миллисекундах)
    const [blueSpeed, setBlueSpeed] = useState(3);  // Состояние для скорости синего мяча
    const [blueShootInterval, setBlueShootInterval] = useState(2000);  // Интервал стрельбы синего мяча (в миллисекундах)
    const [selectedBall, setSelectedBall] = useState(null);  // Состояние для выделенного мяча
    const [clickPos, setClickPos] = useState(null);  // Позиция клика
    const [ballColors, setBallColors] = useState({ red: "green", blue: "green" });  // Цвета стреляющих шаров

    useEffect(() => {
        const canvas = canvasRef.current;  // Получение ссылки на элемент canvas
        const ctx = canvas.getContext("2d");  // Получение контекста для рисования на canvas

        // Начальные параметры для мячей
        const balls = [
            { x: 200, y: 100, radius: 30, color: "red", dy: redSpeed },
            { x: 800, y: 200, radius: 30, color: "blue", dy: blueSpeed }
        ];

        let smallBalls = [];  // Массив для маленьких мячей
        let redShootIntervalId, blueShootIntervalId;  // Идентификаторы интервалов стрельбы
        let mousePos = { x: 0, y: 0 };  // Переменная для позиции мыши

        // Функция для создания маленького мяча
        const shootSmallBall = (ball) => {
            smallBalls.push({
                x: ball.x + (ball.color === "red" ? ball.radius : -ball.radius),
                y: ball.y,
                radius: 10,
                speedX: (ball.color === "red" ? redSpeed : -blueSpeed) * 4,
                color: ballColors[ball.color],  // Используем выбранный цвет для стреляющих шариков
                originBall: ball
            });
        };

        // Функция для обновления анимации
        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Очистка canvas

            // Обновление и отрисовка больших мячей
            balls.forEach(ball => {
                ball.y += ball.dy;  // Обновление позиции мяча по оси Y

                // Проверка границ canvas и изменение направления мяча
                if (ball.y + ball.radius > canvas.height * 0.9) {
                    ball.y = canvas.height * 0.9 - ball.radius;
                    ball.dy = -ball.dy;
                } else if (ball.y - ball.radius < 0) {
                    ball.y = ball.radius;
                    ball.dy = -ball.dy;
                }

                // Отскок мяча от курсора мыши
                if (
                    Math.abs(ball.y - mousePos.y) < ball.radius + 20 &&
                    Math.abs(ball.x - mousePos.x) < ball.radius
                ) {
                    ball.dy = -ball.dy;
                }

                // Отрисовка мяча на canvas
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();
                ctx.closePath();
            });

            // Обновление и отрисовка маленьких мячей
            smallBalls = smallBalls.filter(smallBall => {
                smallBall.x += smallBall.speedX;  // Обновление позиции маленького мяча по оси X

                // Проверка на столкновение с большими мячами
                const hit = balls.some(ball => {
                    if (ball === smallBall.originBall) return false;

                    const dx = ball.x - smallBall.x;
                    const dy = ball.y - smallBall.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < ball.radius + smallBall.radius) {
                        // Обновление счета при попадании
                        if (smallBall.originBall.color === "red" && ball.color === "blue") {
                            setRedScore(prevScore => prevScore + 1);
                        } else if (smallBall.originBall.color === "blue" && ball.color === "red") {
                            setBlueScore(prevScore => prevScore + 1);
                        }
                        return true;
                    }
                    return false;
                });

                // Удаление маленького мяча, если он вышел за границы или попал в другой мяч
                if (hit || smallBall.x < 0 || smallBall.x > canvas.width) return false;

                // Отрисовка маленького мяча на canvas
                ctx.beginPath();
                ctx.arc(smallBall.x, smallBall.y, smallBall.radius, 0, Math.PI * 2);
                ctx.fillStyle = smallBall.color;
                ctx.fill();
                ctx.closePath();

                return true;
            });

            // Запрос следующего кадра для анимации
            requestAnimationFrame(update);
        };

        // Интервал для стрельбы красным мячом
        redShootIntervalId = setInterval(() => {
            shootSmallBall(balls[0]);
        }, redShootInterval);

        // Интервал для стрельбы синим мячом
        blueShootIntervalId = setInterval(() => {
            shootSmallBall(balls[1]);
        }, blueShootInterval);

        update();  // Запуск функции обновления

        // Обработчик движения мыши
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        // Обработчик клика мыши
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

            const clickedBall = balls.find(ball => {
                const dx = ball.x - clickPos.x;
                const dy = ball.y - clickPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < ball.radius;
            });

            if (clickedBall) {
                setSelectedBall(clickedBall);
                setClickPos(clickPos);  // Устанавливаем позицию клика для отображения меню
            } else {
                setSelectedBall(null);
                setClickPos(null);
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);

        // Очистка интервалов и событий при размонтировании компонента
        return () => {
            clearInterval(redShootIntervalId);
            clearInterval(blueShootIntervalId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
            cancelAnimationFrame(update)
        };
    }, [redSpeed, blueSpeed, redShootInterval, blueShootInterval, ballColors]);  // Зависимости для useEffect

    // Функция для изменения цвета стреляющих шаров
    const handleColorChange = (color) => {
        if (selectedBall) {
            setBallColors(prevColors => ({
                ...prevColors,
                [selectedBall.color]: color
            }));
            setSelectedBall(null);
            setClickPos(null);
        }
    };

    return (
        <div className="arcade-machine">
            <div className="logo">Magic duel</div>
            <div className="top-trapezoid"></div>
            <canvas
                ref={canvasRef}
                width={1000}
                height={800}
            />
            <Scoreboard redScore={redScore} blueScore={blueScore} />
            <div className="bottom-trapezoid"></div>
            <Controls
                redSpeed={redSpeed} setRedSpeed={setRedSpeed}
                redShootInterval={redShootInterval} setRedShootInterval={setRedShootInterval}
                blueSpeed={blueSpeed} setBlueSpeed={setBlueSpeed}
                blueShootInterval={blueShootInterval} setBlueShootInterval={setBlueShootInterval}
            />
            {selectedBall && (
                <HeroMenu
                    clickPos={clickPos}
                    onChangeColor={handleColorChange}
                    onClose={() => {
                        setSelectedBall(null);
                        setClickPos(null);
                    }}
                />
            )}
        </div>
    );
};

export default GameCanvas;
