const grid = document.getElementById("brick-grid")
const scoreboard = document.getElementById("score")
let allBricks = [];
let currentScore = 0

export default class Bricks {
    constructor(brickGrid) {
        this.brickGrid = brickGrid
        this.build()
    }

    //Build all the blocks in the grid
    build() {
        for (let i=0; i < 32; i++) {
            const e = document.createElement('div');
            //First 8 bricks get a different div
            if (i < 8) {
                e.setAttribute("id", "brick"+i)
                e.setAttribute("class", "doubleBrick")
            } else {
                e.setAttribute("id", "brick"+i)
                e.setAttribute("class", "brick")
            }
            grid.appendChild(e);
            let rect = e.getBoundingClientRect()
            allBricks.push(rect)
        }
    }
    destroyElements() {
        for (let i=0; i < 32; i++) {
            const e = document.getElementById("brick" + i);
            e.remove()
        }
    }
    destroy() {
        allBricks = [];
    }

    rects() {
        return allBricks
    }

}

export function breakBricks(id) {
    // Get the correct id of the brick to break
    let brickId = id;
    // Replace the class of the element to not display it anymore
    document.getElementById("brick" + brickId).className = "broken";
    // Replace the item in the array
    allBricks.splice(brickId, 1, "broken")
}

export function Score() {
    scoreboard.textContent = currentScore + 1;
    currentScore += 1
}

export function BricksBroken() {
    let brokenNum = 0
    for(let i=0; i < allBricks.length; i++) {
        if (allBricks[i] == "broken") {
            brokenNum = brokenNum + 1
        }
    }
    return brokenNum
}

export function DegradeBrick(id) {
    document.getElementById("brick" + id).className = "brick";
}