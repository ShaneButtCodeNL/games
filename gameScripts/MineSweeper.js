import { RandomWholeNumber } from "../scripts/RandomNumber";
//Window from main page
const gameWindow = document.getElementById("gameWindow");
//Container for minefield
const mineFieldContainer = document.createElement("div");
gameWindow.innerHTML = mineFieldContainer;
//Value of a mine
const mine = -1;
//Used in render
const renderValue = (val) => {
  if (val) return val === mine ? "B" : `${val}`;
  return "";
};

export default class MineSweeper {
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
  //Random Number generator
  #rand;
  //The locations of the mines
  #minePlacement;
  //The minefield
  #minefield;
  /**Gets a length,width pos from a number
   * @returns {Array<number>}
   * */
  #getPosition(num) {
    return [Math.ceil(num / this.width) - 1, num % this.width];
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
  }
  /**
   * Gets random positions for mines
   */
  #randomizeMines() {
    this.#minePlacement = Array.from(
      { length: this.length * this.width },
      (_, i) => {
        [i, this.#rand.next()];
      }
    )
      .sort((a, b) => {
        a[1] - b[1];
      })
      .slice(this.numOfMines)
      .map((v) => v[0]);
  }
  /**
   * places mines into the minefield
   */
  #placeMines() {
    this.#minePlacement.forEach((v) => {
      let [l, w] = this.#getPosition(v);
      this.#minefield[l][w].value = mine;
      const [top, bottom, right, left] = [
        l > 0,
        l < length - 1,
        w < width - 1,
        w > 0,
      ];
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
  async #activate(pos) {
    const [l, w] = this.#getPosition(pos);
    //Already revealed
    if (this.#minefield[l][w].revealed) return;
    const val = this.#minefield[l][w].value;
    //Found bomb
    if (val === mine) {
      this.gameState = -1;
      return;
    }
    if (val) {
      this.#minefield[l][w].revealed = true;
      return;
    }
    //no bombs around pos
    if (val === 0) {
      const [top, bottom, right, left] = [
        l > 0,
        l < length - 1,
        w < width - 1,
        w > 0,
      ];
      if (top) {
        if (left) this.#activate(this.#getLinearPosition(l - 1, w - 1));
        this.#activate(this.#getLinearPosition(l - 1, w));
        if (right) this.#activate(this.#getLinearPosition(l - 1, w + 1));
      }
      if (left) this.#activate(this.#getLinearPosition(l, w - 1));
      if (right) this.#activate(this.#getLinearPosition(l, w + 1));
      if (bottom) {
        if (left) this.#activate(this.#getLinearPosition(l + 1, w - 1));
        this.#activate(this.#getLinearPosition(l + 1, w));
        if (right) this.#activate(this.#getLinearPosition(l + 1, w + 1));
      }
    }
    return;
  }
  /**
   * Renders the minefield to minefield Container
   * @param {number} pos
   */
  async #render() {
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
            : ""
        }</button>`;
      }
    }
    mineFieldContainer.innerHTML = buttonField;
  }
  async clickFunction(pos) {
    await this.#activate(pos);
    await this.#render();
  }
  /*
   * Makes an instance of minesweeper game
   * @param {number} length Length of the minefield Verticle
   * @param {number} width Width of the minefield Horazontal
   * @param {number} numOfMines The number of mines to place in the board
   */
  constructor(length, width, numOfMines) {
    this.#rand = new RandomWholeNumber();
    this.#rand.setMinMax(0, length * width * 100);
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
    const [h, w] = this.#getPosition(pos);
    return this.minefield[h][w].value;
  };
}
