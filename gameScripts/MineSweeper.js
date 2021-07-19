//Window from main page
const getGameWindow = () => document.getElementById("gameWindow");
//Container for minefield
const mineFieldContainer = document.createElement("div");
mineFieldContainer.id = "minefieldContainer";
mineFieldContainer.innerHTML = "<p>TEST DIV</p>";
//Value of a mine
const mine = -1;
//Used in render
const renderValue = (val) => {
  if (val) return val === mine ? "B" : `${val}`;
  return "";
};
let game;
const clickFunction = async (pos) => {
  console.log("CLICKFUNCTIONCALLED");
  await game.activate(pos);
  await game.render();
  getGameWindow().innerHTML = "";
  getGameWindow().appendChild(mineFieldContainer);
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
        return { value: 0, revealed: false };
      })
    );
    console.log(this.#minefield);
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
    console.log("\tACTIVATECALLED pos", pos);
    const [l, w] = this.getPosition(pos);
    console.log("\tl,w,field", l, w, this.#minefield[l][w]);
    //Already revealed
    if (this.#minefield[l][w].revealed) return;
    console.log("\tNOTREVEALED");
    const val = this.#minefield[l][w].value;
    //Found bomb
    if (val === mine) {
      console.log("\t\tFOUNDBOMB");
      this.gameState = -1;
      this.#minefield[l][w].revealed = true;
      return;
    }
    console.log("\t\t", val);
    if (val) {
      this.#minefield[l][w].revealed = true;
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
    return;
  }
  /**
   * Renders the minefield to minefield Container
   * @param {number} pos
   */
  async render() {
    console.log("render called");
    let buttonField = "";
    for (let l = 0; l < this.length; l++) {
      for (let w = 0; w < this.width; w++) {
        buttonField = `${buttonField}<button class='mineButton ${
          this.#minefield[l][w].revealed ? "revealed" : "hidden"
        }MineButton' onclick='clickFunction(${this.#getLinearPosition(
          l,
          w
        )})' >${
          this.#minefield[l][w].revealed
            ? renderValue(this.#minefield[l][w].value)
            : "f"
        }</button>`;
      }
    }
    mineFieldContainer.innerHTML = buttonField;

    getGameWindow().appendChild(mineFieldContainer);
  }
  /*
   * Makes an instance of minesweeper game
   * @param {number} length Length of the minefield Verticle
   * @param {number} width Width of the minefield Horazontal
   * @param {number} numOfMines The number of mines to place in the board
   */
  constructor(length, width, numOfMines) {
    this.gameState = 0;
    this.numOfMines = Math.min(numOfMines, Math.floor((width + length) / 2));
    this.length = Math.min(length, 25);
    this.width = Math.min(width, 25);
    //Random Mine Locations Array of locations
    this.#randomizeMines();
    //array storage of mine locations
    this.#makeMinefield();
    //place Mines and update nearby tiles
    this.#placeMines();
    console.log("MINES:", this.#minePlacement);
  }
  /**
   * Gets current game State
   */
  get gameState() {
    return this.gameState;
  }
  /**
   * Click funcnction
   */
  clickFunction = (pos) => {
    const [h, w] = this.getPosition(pos);
    return this.minefield[h][w].value;
  };
}
