import { breakBricks, Score, DegradeBrick } from "../src/Bricks.js"

const impact = new Audio('../assets/impact-sound.wav')
export let ball2
const INITIAL_VELOCITY = 0.025
const VELOCITY_INCREASE = 0.000001

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem
    this.reset()
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value)
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value)
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    this.x = 50
    this.y = 92.5

    this.direction = { x: 0 }
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.22
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI)
      this.direction = { x: Math.sin(heading), y: -3 }
    }
    this.velocity = INITIAL_VELOCITY
  }
  update(delta, paddleRects, paddlePos, GameStarted, allBricks) {
    if (!GameStarted) {
      this.x = paddlePos;
    } else {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta
    this.velocity += VELOCITY_INCREASE * delta
    const rect = this.rect()

    // Walls collision
    if (rect.top <= 0) {
      this.direction.y *= -1
    }
    if (rect.left < 0 || rect.right >= window.innerWidth) {
      this.direction.x *= -1
    }
    // Paddle collision
    if (paddleRects.some(r => isCollision(r, rect))) {
      //Check which side of the paddle the ball lands
      let paddleCenter = paddleRects[0].x + (paddleRects[0].width / 2)
      let ballCenter = rect.x + (rect.width / 2)
      if (paddleCenter > ballCenter) {
       // left side of the paddle bounces ball left
        if (this.direction.x < 0) {
          this.direction.y *= -1
        } else if (this.direction.x > 0) {
          this.direction.x += -0.2
          this.direction.y *= -1
        }
      } else if (paddleCenter < ballCenter) {
       // right side of the paddle bounces ball right
        if (this.direction.x > 0) {
          this.direction.y *= -1
        } else if (this.direction.x < 0) {
          this.direction.x += 0.2
          this.direction.y *= -1
        }
      } else if (paddleCenter = ballCenter) {
        this.direction.y *= -1
      }
    }

    // Bricks collision
    if (allBricks[0].some(r => isCollision(r, rect))) {
      //Find which brick the ball collided
      let toBreakRect = allBricks[0].find(r => isCollision(r, rect))
      //Get the ID of that ball in the array
      for (let i = 0; i < allBricks[0].length; i++) {
        if (allBricks[0][i] == toBreakRect) {
          //If its doublebrick, degrade it
          if (document.getElementById("brick" + i).getAttribute("class") == "doubleBrick") {
            DegradeBrick(i)
            Score()
            impact.play()
          } else {
            breakBricks(i)
            Score()
            additionalBall(this.x, this.y)
            impact.play()
          }
        }
      }
      // change ball direction on bounce
      this.direction.y *= - 1
      }
    
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  )
}

function additionalBall(x, y) {
  // 1/30 chances for the second ball to appear
  if (Math.floor(Math.random() * 30) == 15) {
    // If there already is another ball, down spawn a third one
    if (!document.getElementById("ball2")) {
      // Create the ball element
      const e = document.createElement('div');
      e.setAttribute("id", "ball2")
      e.setAttribute("class", "ball2")
      document.body.appendChild(e)
      ball2 = new Ball(document.getElementById("ball2"))
      // spawn the ball on the second ball, so exactly where the collision happened
      ball2.x = x;
      ball2.y = y;
    }
  }
}