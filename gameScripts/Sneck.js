//Container for sneck game
const sneckContainer = document.createElement("div");
sneckContainer.id = "sneckContainer";

//Container for sneck game stats
const sideBarContainerSneck = document.createElement("div");
sideBarContainerSneck.id = "sneckSideBar";

//Button to start SneckGame
const startSneckGameButton = document.createElement("button");
startSneckGameButton.id = "startSneckGameBtn";
startSneckGameButton.type = "button";
startSneckGameButton.innerText = "Start Game";
startSneckGameButton.addEventListener("click", () => {
  console.log("start game clicked . . .");
  window.requestAnimationFrame(startSnakeGame);
});
sideBarContainerSneck.appendChild(startSneckGameButton);

//Game Loop
//Time of last render
let prevCurrentTime = 0;
//Loops
function startSnakeGame(currentTime) {
  console.log("Game state", sGame.gameState);

  if (sGame.gameState === 0) window.requestAnimationFrame(startSnakeGame);
  let secSinceLastRender = (currentTime - prevCurrentTime) / 1000;
  if (secSinceLastRender < 1 / SPEED) return;
  console.log("RENDERED", secSinceLastRender, prevCurrentTime);
  prevCurrentTime = currentTime;
  sGame.draw();
}

//Makes a Game tile with a x-pos(horazontal) and  y-pos(verticle) zero-based
const makeGameTile = (x, y) => {
  const tile = document.createElement("div");
  tile.id = `gameTile-${x}-${y}`;
  tile.className = "sneckGameTile";
  sneckContainer.appendChild(tile);
};

//Gets smallest height or width
const size = () => {
  let val = Math.min(
    getGameWindow().getBoundingClientRect().width,
    getGameWindow().getBoundingClientRect().height
  );
  return val;
};

//Gets a random pos on the board
const getRandomPos = () => [
  Math.floor(Math.random() * 21),
  Math.floor(Math.random() * 21),
];

//makes a 21x21 board
const makeBoard = () => {
  sneckContainer.innerHTML = "";
  for (let x = 0; x < 21; x++) {
    for (let y = 0; y < 21; y++) {
      makeGameTile(x, y);
    }
  }
};

//Makes a sneckGame and returns it
const createSneckGame = () => {
  console.log("Create Sneck Game");
  sGame = new Sneck();
  return sGame;
};

//Gets the current instance of sneckGame
const loadSneckGame = () => {
  console.log("loadSneckGame");
  return sGame;
};
//varibles
let sGame;

//constants
const sneckHead = "sneckHead";
const sneckTail = "sneckTail";
const food = "food";
const SPEED = 8;

//Sneck game class
class Sneck {
  gameState;
  lastRenderTime;
  sneckBody;
  foodPos;
  sneckLength;
  xFace;
  yFace;
  wins;
  score;

  render() {
    console.log("Render Sneck Game. . .");
    getSideBar().innerHTML = "";
    getSideBar().appendChild(sideBarContainerSneck);
    //-1 is lose state 1 is win state
    if (this.gameState !== 0) {
      return;
    }
    this.draw();
  }

  bodyCollision() {
    for (let i = 1; i < this.sneckLength; i++) {
      if (
        this.sneckBody[0].x === this.sneckBody[i].x &&
        this.sneckBody[0].y === this.sneckBody[i].y
      )
        return true;
    }
    return false;
  }

  //Update states of the game
  update() {
    //Update sneck pos
    //Body
    for (let i = this.sneckLength - 1; i > 0; i--) {
      this.sneckBody[i] = { ...this.sneckBody[i - 1] };
    }
    //Head
    this.sneckBody[0].x += this.xFace;
    this.sneckBody[0].y += this.yFace;
    //Collision
    if (
      this.sneckBody[0].x < 0 ||
      this.sneckBody[0].x > 20 ||
      this.sneckBody[0].y < 0 ||
      this.sneckBody[0].y > 20 ||
      this.bodyCollision()
    ) {
      this.gameState = -1;
      console.log("Game Over");
    }
    //Get Food
    if (
      this.foodPos &&
      this.sneckBody[0].x === this.foodPos.x &&
      this.sneckBody[0].y === this.foodPos.y
    ) {
      this.score += 10;
      this.moveFood();
    }
  }

  //Draw the game to the game board
  draw() {
    console.log("Sneck Draw . . .");
    getGameWindow().innerHTML = "";
    getGameWindow().appendChild(sneckContainer);
    const box = `${size() - 50}px`;
    //console.log("box:", box);
    sneckContainer.style.width = box;
    sneckContainer.style.height = box;
    makeBoard();
    this.update();
    if (this.gameState === -1) return;
    //console.log("htm;", sneckContainer.innerHTML);
    let b = true;
    this.sneckBody.forEach((seg) => {
      let [x, y] = [seg.x, seg.y];
      let tile = document.getElementById(`gameTile-${x}-${y}`);
      tile.classList.add(b ? sneckHead : sneckTail);
      b = false;
    });
    //console.log(this.foodPos);
    document
      .getElementById(`gameTile-${this.foodPos.x}-${this.foodPos.y}`)
      .classList.add(food);
  }

  changeDirection(x, y) {
    console.log("x", x, "y", y);
    if (this.xFace === 0 && x) {
      this.xFace = x;
      this.yFace = 0;
    }
    if (this.yFace === 0 && y) {
      this.yFace = y;
      this.xFace = 0;
    }
  }
  //Move food to unoccupyed block
  moveFood() {
    console.log("Move Food. . .");
    //Get random point {x,y}
    let [newX, newY] = getRandomPos();
    //If {x,y} is occupiied get new point
    while (this.sneckBody.findIndex((a) => a.x === newX && a.y === newY) > -1)
      [newX, newY] = getRandomPos();
    //Update food pos
    if (this.foodPos) {
      document
        .getElementById(`gameTile-${this.foodPos.x}-${this.foodPos.y}`)
        .classList.remove(food);
    }
    this.foodPos = { x: newX, y: newY };
    //console.log(this.foodPos);
  }

  constructor() {
    this.gameState = 0;
    this.score = 0;
    this.wins = 0;
    this.lastRenderTime = 0;
    this.gamesPlayed = 0;
    this.sneckLength = 1;
    this.sneckBody = [{ x: 10, y: 10 }];
    this.foodPos = undefined;
    this.moveFood();
    this.xFace = 0;
    this.yFace = 0;
  }

  get gameState() {
    return this.gameState;
  }
}