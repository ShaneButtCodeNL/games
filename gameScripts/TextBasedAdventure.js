const gameWindow = document.getElementById("gameWindow");
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
