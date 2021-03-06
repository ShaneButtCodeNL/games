import { getGameWindow, getSideBar } from "./helpers.js";

export let createMineSweeperGame;
export let loadMineSweeper;

//Container for minefield
const mineFieldContainer = document.createElement("div");
mineFieldContainer.id = "minefieldContainer";
mineFieldContainer.oncontextmenu = (e) => e.preventDefault();
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
const rules =
  "The object of the game is to reveal all blocks that do not contain mines. Upon clicking a field if it has a bomb under it you lose, otherwise it will reveal how many mines surround it. If it has 0 mines surrounding it, it will auto reveal the fields around it.";
//Used in render
const renderValue = (val) => {
  if (val) return val === mine ? bombRender : `${val}`;
  return "";
};
let game;
let collapsed = false;
const slideMineSweeperRules = () => {
  const collapseDiv = document.getElementById("minesweeperRulesContent");
  if (collapsed) collapseDiv.style.maxHeight = 0;
  else collapseDiv.style.maxHeight = "500px";
  collapsed = !collapsed;
};
const clickFunction = async (pos) => {
  if (game.gameState !== 0) return;
  await game.activate(pos);
  await game.render();
};
createMineSweeperGame = (rows, cols, mines) => {
  console.log("Createing mineweeper game");
  game = new MineSweeper(rows, cols, mines);
  return game;
};
loadMineSweeper = () => {
  console.log("loadMineSweeper");
  return game;
};

class MineSweeper {
  //Public
  //Vertical Length of Minefield
  length;
  //Horazontal length of of Minefield
  width;
  //Number of mines to be placed
  numOfMines;
  //Number of flags
  flags;
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
    this.flags += this.#minefield[l][w].flagged ? -1 : 1;
    this.#minefield[l][w].flagged = !this.#minefield[l][w].flagged;
  }
  /**
   * Gets a score based on number of reveald blocks
   * @returns The score of the game
   */
  async getScore() {
    let score = this.penalty;
    for (let row of this.#minefield) {
      for (let block of row) {
        if (block.revealed && block.value !== mine) score++;
      }
    }
    console.log("SCORE:", score);
    return score;
  }
  async getFlagCount() {
    return this.flags;
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
   * @returns A div object
   */
  async #getWinScreen() {
    const endDivWrapper = document.createElement("div");
    const endDiv = document.createElement("div");
    const replayButton = document.createElement("button");
    const scoreSpan = document.createElement("span");
    endDivWrapper.className = "minesweeperEndScreenWrapper";
    endDiv.className = "minesweeperEndScreen";
    replayButton.id = "minesweeperReplayButton";
    scoreSpan.class = "minesweeperScore";
    endDiv.innerText = "Congratulations you've WON!!!\nYour Score is . . .\n";
    scoreSpan.innerText = await this.getScore();
    replayButton.innerText = "Play Again?";
    replayButton.onclick = () => {
      this.reset();
      this.render();
    };
    endDivWrapper.appendChild(endDiv);
    endDiv.appendChild(scoreSpan);
    endDiv.appendChild(document.createElement("br"));
    endDiv.appendChild(replayButton);

    return endDivWrapper;
  }
  /**
   * Gets a lose screen for the game
   * @returns the string reprentation of a div
   */
  async #getLoseScreeen() {
    const score = await this.getScore();
    const endDivWrapper = document.createElement("div");
    const endDiv = document.createElement("div");
    const replayButton = document.createElement("button");
    const scoreSpan = document.createElement("span");
    endDivWrapper.className = "minesweeperEndScreenWrapper";
    endDiv.className = "minesweeperEndScreen";
    replayButton.id = "minesweeperReplayButton";
    scoreSpan.class = "minesweeperScore";
    endDiv.innerText = `To bad you've LOST.\n${
      score > 10
        ? "Nice Try you did well."
        : "You know your NOT supposed to click the bombs right."
    }\nScore: `;
    scoreSpan.innerText = await this.getScore();
    replayButton.innerText = "Play Again?";
    replayButton.onclick = () => {
      this.reset();
      this.render();
    };

    endDivWrapper.appendChild(endDiv);
    endDiv.appendChild(scoreSpan);
    endDiv.appendChild(document.createElement("br"));
    endDiv.appendChild(replayButton);
    return endDivWrapper;
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
        this.length * this.width - ((await this.getScore()) - this.penalty) ===
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
    if (
      this.length * this.width - ((await this.getScore()) - this.penalty) ===
      this.numOfMines
    )
      this.gameState = 1;
    return;
  }
  async hint() {
    this.penalty -= 5;
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.width; j++) {
        const field = this.#minefield[i][j];
        if (!field.revealed && field.value !== -1) {
          await clickFunction(this.#getLinearPosition(i, j));
          console.log("gamestate", this.gameState);
          return;
        }
      }
    }
    console.log("GameState out", this.gameState);
  }
  async renderSideBar() {
    const toManyFlags = this.flags > this.numOfMines;
    const scoreSpan = document.createElement("span");
    const gamesPlayedSpan = document.createElement("span");
    const winsSpan = document.createElement("span");
    const lossesSpan = document.createElement("span");
    const flagsSpan = document.createElement("span");
    const minesLeftSpan = document.createElement("span");
    const resetBtn = document.createElement("button");
    const resetStatsBtn = document.createElement("button");
    const hintBtn = document.createElement("button");
    const rulesDiv = document.createElement("div");
    const rulesHeadder = document.createElement("h3");
    const rulesContentDiv = document.createElement("div");
    scoreSpan.className = "minesweeperSideSpan";
    winsSpan.className = "minesweeperSideSpan";
    lossesSpan.className = "minesweeperSideSpan";
    flagsSpan.className = `minesweeperSideSpan${
      toManyFlags ? " minesweeperSideSpanError" : ""
    }`;
    gamesPlayedSpan.className = "minesweeperSideSpan";
    minesLeftSpan.className = `minesweeperSideSpan${
      toManyFlags ? " minesweeperSideSpanError" : ""
    }`;
    resetBtn.className = "minesweeperSideBtn";
    resetStatsBtn.className = "minesweeperSideBtn";
    hintBtn.className = "minesweeperSideBtn";
    rulesDiv.className = "minesweeperRulesContainer";
    rulesContentDiv.id = "minesweeperRulesContent";
    scoreSpan.textContent = `Score:${await this.getScore()}`;
    gamesPlayedSpan.textContent = `Games Played: ${this.gamesPlayed}`;
    winsSpan.textContent = `Wins: ${this.wins}`;
    lossesSpan.textContent = `Losses: ${this.gamesPlayed - this.wins}`;
    flagsSpan.textContent = `Flags: ${this.flags}`;
    minesLeftSpan.textContent = `Mines: ${this.numOfMines - this.flags}`;
    resetBtn.innerText = "Reset";
    resetStatsBtn.innerText = "Reset Stats";
    hintBtn.innerText = "Hint?";
    rulesHeadder.innerText = "Rules";
    rulesContentDiv.innerText = rules;
    resetBtn.addEventListener("click", async () => {
      this.reset();
      await this.render();
    });
    resetStatsBtn.addEventListener("click", async () => {
      game = new MineSweeper(this.length, this.width, this.numOfMines);
      await game.render();
    });
    hintBtn.addEventListener("click", async () => await this.hint());
    rulesDiv.addEventListener("click", () => slideMineSweeperRules());
    //Build Rules
    rulesDiv.appendChild(rulesHeadder);
    rulesDiv.appendChild(rulesContentDiv);
    //Build sidebar
    sideBarContainer.innerHTML = "";
    sideBarContainer.appendChild(rulesDiv);
    sideBarContainer.appendChild(scoreSpan);
    sideBarContainer.appendChild(gamesPlayedSpan);
    sideBarContainer.appendChild(winsSpan);
    sideBarContainer.appendChild(lossesSpan);
    sideBarContainer.appendChild(flagsSpan);
    sideBarContainer.appendChild(minesLeftSpan);
    sideBarContainer.appendChild(resetBtn);
    sideBarContainer.appendChild(resetStatsBtn);
    sideBarContainer.appendChild(hintBtn);
    getSideBar().innerHTML = "";
    getSideBar().appendChild(sideBarContainer);
  }
  /**
   * Renders the game to minefield Container
   * @param {number} pos
   */
  async render() {
    getSideBar().innerHTML = "";
    getSideBar().appendChild(sideBarContainer);
    if (this.gameState !== 0) {
      this.wins += this.gameState === 1 ? 1 : 0;
      this.gamesPlayed++;
      mineFieldContainer.innerHTML = "";
      getGameWindow().innerHTML = "";
      getGameWindow().appendChild(
        this.gameState === 1
          ? await this.#getWinScreen()
          : await this.#getLoseScreeen()
      );
      await this.renderSideBar();
      return;
    }
    mineFieldContainer.innerHTML = "";
    for (let l = 0; l < this.length; l++) {
      for (let w = 0; w < this.width; w++) {
        let buttonField = document.createElement("button");
        buttonField.classList = `mineButton ${
          this.#minefield[l][w].revealed ? "revealedMineButton" : ""
        }`;
        buttonField.addEventListener("contextmenu", (e) => e.preventDefault());
        buttonField.addEventListener("auxclick", async (e) => {
          e.preventDefault();
          this.flag(l, w);
          await this.render();
        });
        buttonField.addEventListener("click", () =>
          clickFunction(this.#getLinearPosition(l, w))
        );
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
    await this.renderSideBar();
  }
  /**
   * Starts a new game without changeing settings
   */
  reset() {
    if (this.gameState !== 0) this.gamesPlayed--;
    console.log("reset called");
    this.penalty = 0;
    this.gameState = 0;
    this.gamesPlayed++;
    this.flags = 0;
    //Random Mine Locations Array of locations
    this.#randomizeMines();
    //array storage of mine locations
    this.#makeMinefield();
    //place Mines and update nearby tiles
    this.#placeMines();
    console.log("MINES:", this.#minePlacement);
  }
  /**
   * Restarts game with new parameters
   * @param {Number} length New vertical Length
   * @param {Number} width New horazontal Width
   * @param {Number} numOfMines New number of mines to place
   */
  resetNewParam(length, width, numOfMines) {
    this.numOfMines = Math.min(numOfMines, Math.floor((width + length) / 2));
    this.length = Math.min(length, 25);
    this.width = Math.min(width, 25);
    this.reset();
  }
  /*
   * Makes an instance of minesweeper game
   * @param {number} length Length of the minefield Verticle
   * @param {number} width Width of the minefield Horazontal
   * @param {number} numOfMines The number of mines to place in the board
   */
  constructor(length, width, numOfMines) {
    this.wins = 0;
    this.flags = 0;
    this.gamesPlayed = -1;
    this.penalty = 0;
    this.resetNewParam(length, width, numOfMines);
  }
  /**
   * Gets current game State
   */
  get gameState() {
    return this.gameState;
  }
}
