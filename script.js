import Ball from "./src/Ball.js"
import Paddle from "./src/Paddle.js"
import Bricks from "./src/Bricks.js"
import { BricksBroken } from "./src/Bricks.js"
import { ball2 } from "./src/Ball.js"

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const bricks = new Bricks(document.getElementById("brick-grid"))
const Score = document.getElementById("score")
const Lives = document.getElementById("lives")
const fpsElem = document.getElementById("fps")
const menu = document.getElementById("pause-menu")
const gameOverMenu = document.getElementById("game-over")
const resumeBtn = document.getElementById("pause-resume")
const restartBtn = document.getElementById("pause-restart")
const GameRestart = document.getElementById("game-restart")
const Message = document.getElementById("message")

let pauseState = false;
let overState = false;
let GameStarted = false;
let lives = 3;

let lastTime;
let req;
backgroundColor()
createLife()

function update(time) {  

  // Show fps
  const delta = time - lastTime
  let fps = Math.round(1000/delta)
  fpsElem.textContent = fps

  if (pauseState === false && overState === false) {
    exitPauseMenu()
    if (lastTime != null) {
      ball.update(delta, [playerPaddle.rect()], playerPaddle.position, GameStarted, [bricks.rects()])
      if (document.getElementById("ball2")) {
        ball2.update(delta, [playerPaddle.rect()], playerPaddle.position, GameStarted, [bricks.rects()])
      }
      inputs()
      if (isLose()) handleLose()
      handleGameOver()
    }
  } else {
    if (pauseState === true) {
      pauseMenu()
    }
  }

  lastTime = time
  req = window.requestAnimationFrame(update)
}

// Game over
function gameOver(message) {
  overState = true;
  menu.style.display = "none";
  gameOverMenu.style.display = "block";
  Message.textContent = message;
  GameRestart.addEventListener("click", exitGameOverMenu);
}
function exitGameOverMenu() {
  gameOverMenu.style.display = "none";
  overState = false;
  lives = 3
  createLife()
  restart()
}

// Pause menu
function pauseMenu() {
  if (overState == false) {
    menu.style.display = "block";
    resumeBtn.addEventListener("click", resume);
    restartBtn.addEventListener("click", restart);
  }
}
function exitPauseMenu() {
  menu.style.display = "none";
}
function resume() {
  pauseState = false;
}
function restart() {
  Score.textContent = 0;
  pauseState = false;
  GameStarted = false;
  backgroundColor()
  ball.reset()
  playerPaddle.position = 50
  bricks.destroy()
  bricks.destroyElements()
  bricks.build()
  while (Lives.firstChild) {
    Lives.removeChild(Lives.firstChild);
  }
  lives = 3;
  createLife()  
}

// Gamestate
function isLose() {
  const rect = ball.rect()
  if (document.getElementById("ball2")) {
    const rect2 = ball2.rect()
    return rect2.bottom >= window.innerHeight && rect.bottom >= window.innerHeight
  }
  return rect.bottom >= window.innerHeight
}

function handleLose() {
  const rect = ball.rect()
  if (rect.bottom >= window.innerHeight) {
    removeLife()
  }
  handleGameOver()
  backgroundColor()
  ball.reset()
  if (document.getElementById("ball2")) {
    document.getElementById("ball2").remove()
  }
  GameStarted = false;
}

function handleGameOver() {
  if (lives == 0) {
    gameOver("You lost!")
  }
  if (BricksBroken() == 32) {
    gameOver("You won!")
  }

}

function backgroundColor() {
  const hue = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--hue")
  )
  document.documentElement.style.setProperty("--hue", Math.round(Math.random() * 360))
}

// Player input system
function inputs() {
  // Down
  if (downPressed) {
    if (playerPaddle.position <= 100) {
      playerPaddle.position += 0.5;
    }
  }
  // Up
  if (upPressed) {
    if (playerPaddle.position >= 0) {
      playerPaddle.position -= 0.5;
    }
  }
}

document.body.addEventListener("keydown", keyDown)
document.body.addEventListener("keyup", keyUp)

let downPressed = false
let upPressed = false

function keyDown(event) {
  // Down
  if (event.isComposing || event.key === "ArrowRight") {
    downPressed = true
  }
  // Up
  if (event.isComposing || event.key === "ArrowLeft") {
    upPressed = true
  }
  // Escape
  if (event.isComposing || event.key === "Escape") {
    pauseState = !pauseState
  }
  // Space
  if (event.isComposing || event.key === " ") {
    if (GameStarted === false) {
      GameStarted = true
    }
  }
}

function keyUp(event) {
  // Down
  if (event.isComposing || event.key === "ArrowRight") {
    downPressed = false
  }
  // Up
  if (event.isComposing || event.key === "ArrowLeft") {
    upPressed = false
  }
}

function createLife() {
  let lifeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--foreground-color)"><path d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z"/></svg`
  for (let i=0; i < lives; i++) {
    document.getElementById('lives').innerHTML += lifeIcon;
  }
}
function removeLife() {
  lives -= 1;
  Lives.removeChild(Lives.lastChild);
}

// Start the recursive function
window.requestAnimationFrame(update)