/**
 * Poulates the character input div
 * @param {HTMLDivElement} cDI
 */
const makeCharaDataInput = (cDI) => {
  const nameInput = document.createElement("div");
  nameInput.className = "charaInputField";
  nameInput.innerHTML = `<label for="name">Name: </label>
                         <input type="text" name="name" class="charaInputText" placeholder="Name">`;
  const raceInput = document.createElement("div");
  raceInput.className = "charaInputField";
  raceInput.innerHTML = `<label for="race">Race: </label>
                         <input type="text" name="race" class="charaInputText" placeholder="Race">`;
  const classInput = document.createElement("div");
  classInput.className = "charaInputField";
  classInput.innerHTML = `<label for="class">Class: </label>
                         <input type="text" name="class" class="charaInputText" placeholder="Class">`;
  const skillsInput = document.createElement("div");
  skillsInput.className = "charaInputField";
  skillsInput.innerHTML = `<label> for="skills">Skills:</label>
  <select>
    <option value="1">skill 1</option>
    <option value="2">skill 2</option>
    <option value="3">skill 3</option>
  </select>`;
  cDI.append(nameInput);
  cDI.append(raceInput);
  cDI.append(classInput);
  cDI.append(skillsInput);
};
//Gets the window for rendering games in
const gameWindow = () => document.getElementById("gameWindow");
//Gets the window for side bar content
const sideBar = () => document.getElementById("sideBarContent");
const characterDataInput = document.createElement("div");
characterDataInput.id = "characterDataInputDiv";
makeCharaDataInput(characterDataInput);
const textOutput = document.createElement("div"),
  textInput = document.createElement("div");
textOutput.id = "textAdventureTextOutput";
textInput.id = "textAdventureTextInput";
const gameContainer = document.createElement("div");
gameContainer.id = "textAdventureContainer";
const mapDiv = document.createElement("div");
mapDiv.id = "mapDiv";
const statsDiv = document.createElement("div");
statsDiv.id = "statsDiv";
let textGame;
//Test data DELETE
textOutput.innerHTML = "Test text output";
//Test data end DELETE
/**
 * Creates a game
 */
const createTextGame = () => {
  console.log("creating Text Adventure");
  const p = {
    race: "HUMAN",
    gender: "MALE",
    name: "SHANE THE CODER",
    exp: 0,
    class: "DEVELOPER",
    stats: { str: 10, hp: 100, mp: 20, agi: 10 },
    skills: { skill1: "batter" },
    inventory: [],
  };
  textGame = new TextBasedAdventure(p);
};
/**
 * Loads game
 * @returns The game
 */
const loadTextGame = () => {
  console.log("Getting Text adventure");
  return textGame;
};

/**
 * Writes to the output div
 * @param {String} sentence
 */
const appendToTextOutputDiv = (sentence) => {
  textOutput.innerHTML = textOutput.innerHTML + `${sentence}`;
};

class TextBasedAdventure {
  gameState;
  //Player data
  player = {
    race: "",
    gender: "",
    name: "",
    exp: 0,
    class: "",
    stats: {},
    skills: {},
    inventory: [],
  };
  //Prev player actions
  outputs;
  //Tracks lick count
  lickCount;
  //Tracks players location as [row,col] starts on bottom in middle
  location;
  //Gets player Level
  getLevel = (growthRateFunction) => {
    growthRateFunction ? growthRateFunction(this.player.exp) : {};
  };
  //Map is 11*10;
  map = Array.from({ length: 10 }, (_) => Array.from({ length: 11 }));

  /**
   * writes story from a prev adventure
   */
  makeOutputs = async () => {
    textOutput.innerHTML = "";
    this.outputs.forEach((v, i) =>
      appendToTextOutputDiv(`<div class="outputItem" key=${i}>${v}</div>`)
    );
  };
  //Makes a player
  makePlayer = (p) => {
    this.player.race = p.race || "HUMAN";
    this.player.gender = p.gender || "OTHER";
    this.player.name = p.name || "ANON";
    this.player.class = p.class || "NONE";
    this.player.stats = { ...p.stats };
    this.player.skills = { ...p.skills };
    this.player.inventory = p.inventory || [null, null, null];
  };

  makeAction = (action, noun) => {
    switch (action) {
      case "move": {
        break;
      }
      case "look": {
        break;
      }
      case "lick": {
        break;
      }
      case "grab": {
        break;
      }
      case "help": {
        break;
      }
      case "item": {
        break;
      }
      default:
        appendToTextOutputDiv(
          `Action "${action}" is unknown. Try "look", "grab" , "move", "lick", ect`
        );
    }
  };

  render = () => {
    gameWindow().innerHTML = "";
    gameContainer.innerHTML = "";
    this.makeOutputs();
    gameContainer.appendChild(textOutput);
    gameContainer.appendChild(textInput);
    gameContainer.appendChild(mapDiv);
    gameContainer.appendChild(statsDiv);
    gameWindow().appendChild(gameContainer);
  };

  constructor(playerData, pos) {
    this.makePlayer(playerData);
    this.gameState = true;
    this.outputs = [
      "Your Adventure Begins. . .",
      "You stand at the castle gates. . .",
    ];
    this.lickCount = 0;
    this.location = pos ? [...pos] : [10, 6];
  }
}
