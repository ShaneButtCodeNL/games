//Window from main page
const getGameWindow = () => document.getElementById("gameWindow");
//SideWindow from main page
const getSideBar = () => document.getElementById("sideBarContent");
//Container for minefield
const mineFieldContainer = document.createElement("div");
mineFieldContainer.id = "minefieldContainer";
const sideBarContainer = document.createElement("div");
sideBarContainer.id = "minesweeperSideBar";
//Value of a mine
const mine = -1;
//String value of a flag
const flagString = "F";
//String value for an unrevealed field
const unrevealedString = "?";
//Render for bomb
const bombRender = "B";
//Used in render
const renderValue = (val) => {
  if (val) return val === mine ? bombRender : `${val}`;
  return "";
};
let game;
const clickFunction = async (pos) => {
  if (game.gameState !== 0) return;
  await game.activate(pos);
  await game.render();
};
const loadMineSweeper = (rows, cols, mines) => {
  console.log("loadMineSweeper", rows, cols, mines);
  game = new MineSweeper(rows, cols, mines);
  getGameWindow().innerHTML = "";
  getGameWindow().appendChild(mineFieldContainer);
  game.render();
};

class MineSweeper {
  //Public
  //Vertical Length of Minefield
  length;
  //Horazontal length of of Minefield
  width;
  //Number of mines to be placed
  numOfMines;
  //Game state 1=win 0=Ongoing -1=lose
  gameState = 0;
  wins;
  gamesPlayed;
  //Private
  //The locations of the mines
  #minePlacement;
  //The minefield
  #minefield;
  /**Gets a length,width pos from a number
   * @returns {Array<number>}
   * */
  getPosition(num) {
    return [Math.floor(num / this.width), num % this.width];
  }
  /**
   * gets a 1d pos from a 2d pos
   * @param {number} l Verticle Pos
   * @param {number} w Horazontal pos
   * @returns 1d position
   */
  #getLinearPosition(l, w) {
    return l * this.length + w;
  }
  /**
   * Makes the minefield
   */
  #makeMinefield() {
    this.#minefield = Array.from({ length: this.length }, (_) =>
      Array.from({ length: this.width }, (_) => {
        return { value: 0, revealed: false, flagged: false };
      })
    );
    console.log(this.#minefield);
  }
  flag(l, w) {
    console.log("FLAG");
    this.#minefield[l][w].flagged = !this.#minefield[l][w].flagged;
  }
  /**
   * Gets a score based on number of reveald blocks
   * @returns The score of the game
   */
  async getScore() {
    let score = 0;
    for (let row of this.#minefield) {
      for (let block of row) {
        if (block.revealed && block.value !== mine) score++;
      }
    }
    console.log("SCORE:", score);
    return score;
  }
  async getFlagCount() {
    let count = 0;
    for (let row of this.#minefield) {
      for (let block of row) {
        if (block.flagged) count++;
      }
    }
    return count;
  }
  /**
   * Gets random positions for mines
   */
  #randomizeMines() {
    this.#minePlacement = Array.from(
      { length: this.length * this.width },
      (_, i) => [i, Math.floor(Math.random() * this.length * this.width * 100)]
    )
      .sort((a, b) => a[1] - b[1])
      .slice(0, this.numOfMines)
      .map((v) => v[0]);
  }
  /**
   * Gets a win screen for the game
   * @returns the string representation of a div
   */
  async #getWinScreen() {
    return `<div class="minesweeperEndScreenWrapper"><div class="minesweeperEndScreen">Congratulations you've WON!!!</br>Your Score is . . .</br><span class="minesweeperScore">${await this.getScore()}</span></div></div>`;
  }
  /**
   * Gets a lose screen for the game
   * @returns the string reprentation of a div
   */
  async #getLoseScreeen() {
    //console.log(`\tEntered getLoseScreen`);
    const score = await this.getScore();
    console.log(`\tGot Score:${score}`);
    return `<div class="minesweeperEndScreenWrapper"><div class="minesweeperEndScreen">To bad you LOST!!!</br>${
      score >= 10 ? "Nice Try you did well" : "Wow that wasn't even close"
    }</br>SCORE:<span class="minesweeperScore">${score}</span></div></div>`;
  }
  /**
   * places mines into the minefield
   */
  #placeMines() {
    this.#minePlacement.forEach((v) => {
      let [l, w] = this.getPosition(v);
      this.#minefield[l][w].value = mine;
      let top = l > 0;
      let bottom = l < this.length - 1;
      let right = w < this.width - 1;
      let left = w > 0;
      //Update values that say how many mines surround button
      //above
      if (top) {
        //Top Left exist and is not mine
        if (left)
          if (this.#minefield[l - 1][w - 1].value !== mine)
            this.#minefield[l - 1][w - 1].value++;
        //Top is not mine
        if (this.#minefield[l - 1][w].value !== mine)
          this.#minefield[l - 1][w].value++;
        //Top Right is not mine
        if (right)
          if (this.#minefield[l - 1][w + 1].value !== mine)
            this.#minefield[l - 1][w + 1].value++;
      }
      //left is not mine
      if (left)
        if (this.#minefield[l][w - 1].value !== mine)
          this.#minefield[l][w - 1].value++;
      //Right is not mine
      if (right)
        if (this.#minefield[l][w + 1].value !== mine)
          this.#minefield[l][w + 1].value++;
      //Bottom
      if (bottom) {
        //left exist and not mine
        if (left)
          if (this.#minefield[l + 1][w - 1].value !== mine)
            this.#minefield[l + 1][w - 1].value++;
        //bottom not mine
        if (this.#minefield[l + 1][w].value !== mine)
          this.#minefield[l + 1][w].value++;
        //Right exists and is not mine
        if (right)
          if (this.#minefield[l + 1][w + 1].value !== mine)
            this.#minefield[l + 1][w + 1].value++;
      }
    });
  }
  /**
   *
   * @param {Number} pos the position in a 1d array that we are uncovering
   */
  async activate(pos) {
    console.log("ACTIVATE");
    const [l, w] = this.getPosition(pos);
    //Already revealed
    if (this.#minefield[l][w].revealed) return;
    const val = this.#minefield[l][w].value;
    //Found bomb
    if (val === mine) {
      this.gameState = -1;
      this.#minefield[l][w].revealed = true;

      return;
    }
    if (val) {
      this.#minefield[l][w].revealed = true;
      if (
        this.length * this.width - (await this.getScore()) ===
        this.numOfMines
      )
        this.gameState = 1;
      return;
    }
    //no bombs around pos
    if (val === 0) {
      this.#minefield[l][w].revealed = true;
      const [top, bottom, right, left] = [
        l > 0,
        l < this.length - 1,
        w < this.width - 1,
        w > 0,
      ];
      if (top) {
        if (left) await this.activate(this.#getLinearPosition(l - 1, w - 1));
        await this.activate(this.#getLinearPosition(l - 1, w));
        if (right) await this.activate(this.#getLinearPosition(l - 1, w + 1));
      }
      if (left) await this.activate(this.#getLinearPosition(l, w - 1));
      if (right) await this.activate(this.#getLinearPosition(l, w + 1));
      if (bottom) {
        if (left) await this.activate(this.#getLinearPosition(l + 1, w - 1));
        await this.activate(this.#getLinearPosition(l + 1, w));
        if (right) await this.activate(this.#getLinearPosition(l + 1, w + 1));
      }
    }
    if (this.length * this.width - (await this.getScore()) === this.numOfMines)
      this.gameState = 1;
    return;
  }
  /**
   * Renders the game to minefield Container
   * @param {number} pos
   */
  async render() {
    if (this.gameState !== 0) {
      this.wins++;
      const str =
        this.gameState === 1
          ? await this.#getWinScreen()
          : await this.#getLoseScreeen();
      mineFieldContainer.innerHTML = "";
      getGameWindow().innerHTML = str;
      return;
    }
    mineFieldContainer.innerHTML = "";
    for (let l = 0; l < this.length; l++) {
      for (let w = 0; w < this.width; w++) {
        let buttonField = document.createElement("button");
        buttonField.classList = `mineButton ${
          this.#minefield[l][w].revealed ? "revealedMineButton" : ""
        }`;
        buttonField.onclick = () =>
          clickFunction(this.#getLinearPosition(l, w));
        buttonField.onauxclick = (e) => {
          e.preventDefault();
          this.flag(l, w);
          this.render();
        };
        buttonField.oncontextmenu = (e) => {
          e.preventDefault();
        };
        buttonField.innerHTML = this.#minefield[l][w].revealed
          ? renderValue(this.#minefield[l][w].value)
          : this.#minefield[l][w].flagged
          ? flagString
          : unrevealedString;
        mineFieldContainer.appendChild(buttonField);
      }
    }
    getGameWindow().innerHTML = "";
    getGameWindow().appendChild(mineFieldContainer);
  }
  //Rebuilds game
  reset() {
    this.gameState = 0;
    //Random Mine Locations Array of locations
    this.#randomizeMines();
    //array storage of mine locations
    this.#makeMinefield();
    //place Mines and update nearby tiles
    this.#placeMines();
    console.log("MINES:", this.#minePlacement);
  }
  reset(length, width, numOfMines) {
    this.numOfMines = Math.min(numOfMines, Math.floor((width + length) / 2));
    this.length = Math.min(length, 25);
    this.width = Math.min(width, 25);
    this.gameState = 0;
    //Random Mine Locations Array of locations
    this.#randomizeMines();
    //array storage of mine locations
    this.#makeMinefield();
    //place Mines and update nearby tiles
    this.#placeMines();
    console.log("MINES:", this.#minePlacement);
  }
  /*
   * Makes an instance of minesweeper game
   * @param {number} length Length of the minefield Verticle
   * @param {number} width Width of the minefield Horazontal
   * @param {number} numOfMines The number of mines to place in the board
   */
  constructor(length, width, numOfMines) {
    this.wins = 0;
    this.gamesPlayed = 1;
    this.reset(length, width, numOfMines);
  }
  /**
   * Gets current game State
   */
  get gameState() {
    return this.gameState;
  }
}
