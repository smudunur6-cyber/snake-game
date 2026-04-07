let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let box = 20;
let snake;
let direction;
let food;
let score;
let game;
let highScore = localStorage.getItem("highScore") || 0;

/* Start Game */
function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;

  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };

  document.getElementById("score").innerText =
    "Score: 0 | High Score: " + highScore;

  clearInterval(game);
  game = setInterval(draw, 150);
}

/* Controls */
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

/* Draw Game */
function draw() {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  // 🐍 Draw Snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";

    ctx.beginPath();
    ctx.arc(
      snake[i].x + box / 2,
      snake[i].y + box / 2,
      box / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 👀 Eyes on head
    if (i === 0) {
      ctx.fillStyle = "white";

      ctx.beginPath();
      ctx.arc(snake[i].x + 6, snake[i].y + 6, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(snake[i].x + 14, snake[i].y + 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 🍎 Food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fill();

  // Move snake
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "RIGHT") headX += box;

  // 🔁 Wrap around walls
  if (headX < 0) headX = 380;
  if (headY < 0) headY = 380;
  if (headX >= 400) headX = 0;
  if (headY >= 400) headY = 0;

  // 🍎 Eat food
  if (headX === food.x && headY === food.y) {
    score++;

    document.getElementById("score").innerText =
      "Score: " + score + " | High Score: " + highScore;

    // Increase speed
    clearInterval(game);
    let speed = Math.max(50, 150 - score * 5);
    game = setInterval(draw, speed);

    // New food
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // 💀 Self collision
  if (collision(newHead, snake)) {
    clearInterval(game);

    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    alert("Game Over! Score: " + score);
  }

  snake.unshift(newHead);
}

/* Collision function */
function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}