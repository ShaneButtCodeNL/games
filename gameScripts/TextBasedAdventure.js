const gameWindow = document.getElementById("gameWindow");
const characterDataInput = document.createElement("div");
characterDataInput.id = "characterDataInputDiv";
makeCharaDataInput(characterDataInput);
const textOutput = document.createElement("div"),
  textInput = document.createElement("div");
textOutput.id = "textAdventureTextOutput";
textInput.id = "textAdventureTextInput";
//Prev player actions
const outputs = [];
//Player data
const player = {
  race: "",
  gender: "",
  name: "",
  exp: 0,
  class: "",
  stats: {},
  skills: {},
  spells: {},
  equipment: {},
  inventory: [],
};
let gameState = true;
//Tracks lick count
let lickCount = 0;
//Tracks players location as [row,col] starts on bottom in middle
const location = [10, 6];
//Gets player Level
const getLevel = (growthRateFunction) => {
  growthRateFunction ? growthRateFunction(player.exp) : {};
};
//Map is 11*10;
const map = Array.from({ length: 10 }, (_) => Array.from({ length: 11 }));
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
//Makes a player
const makePlayer = (
  race,
  gender,
  playerName,
  playerClass,
  stats,
  skills,
  spells,
  equipment,
  inventory
) => {
  player.race = race || "HUMAN";
  player.gender = gender || "OTHER";
  player.name = playerName || "ANON";
  player.class = playerClass || "NONE";
  player.stats = { ...stats };
  player.skills = { ...skills };
  player.spells = { ...spells };
  player.equipment = { ...equipment };
  player.inventory = inventory || [null, null, null];
};
/**
 * writes story from a prev adventure
 * @returns A string of collection of divs that tell the adventure so far
 */
const makeOutputs = async () => {
  let output = "";
  outputs.forEach(
    (v, i) => (output = output + `<div class="outputItem" key=${i}>${v}</div>`)
  );
  return outputs;
};
/**
 * Writes to the output div
 * @param {String} sentence
 */
const appendToDiv = (sentence) => {
  textOutput.innerHTML =
    textOutput.innerHTML + `<div class="outputItem>${sentence}</div>`;
};
const makeAction = (action, item) => {
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
    default:
      appendToDiv(
        `Action "${action}" is unknown. Try "look", "grab" , "move", "lick", ect`
      );
  }
};
