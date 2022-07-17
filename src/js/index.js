import { createMineSweeperGame, loadMineSweeper } from "./MineSweeper.js";
import "../css/main.css";
import {} from "./TextBasedAdventure.js";
import { createSneckGame, loadSneckGame, startSnakeGame } from "./Sneck.js";

//SlideBar
const sideBarWidth = "100%",
  zeroWidth = "0px";
const sideBarPadding = "0.1em";
const slideSideBar = () => {
  const sideBar = document.getElementById("sideBarContent");
  sideBar.style.maxWidth =
    sideBar.style.maxWidth === zeroWidth ? sideBarWidth : zeroWidth;
  sideBar.style.paddingLeft =
    sideBar.style.paddingLeft === zeroWidth ? sideBarPadding : zeroWidth;
  sideBar.style.paddingRight =
    sideBar.style.paddingRight === zeroWidth ? sideBarPadding : zeroWidth;
};
document
  .getElementById("sideBarSlide")
  .addEventListener("click", () => slideSideBar());

//Game Loader
let currentGame = "";
const ms = createMineSweeperGame(10, 10, 10);
//const tba = createTextGame();
const sneckGameInstance = createSneckGame();
const loadGame = () => {
  let gameName = document.getElementById("gameSelector").value;
  console.log("CLICKED GAME LOADER:", gameName);
  currentGame = gameName;
  switch (gameName) {
    case "none":
      console.log("No Game Selected . . .");
      document.getElementById("gameWindow").innerHTML = "";
      document.getElementById("sideBarContent").innerHTML = "";
      break;
    case "sneck":
      console.log("Sneck starting . . .");
      loadSneckGame().render();
      break;
    case "minesweeper":
      console.log("MineSweeper starting . . .");
      loadMineSweeper().render();
      break;
    case "gameTextAdventure":
      console.log("Text adventure starting . . .");
      //loadTextGame().render();
      break;
    default:
      break;
  }
};
document
  .getElementById("loadGameButton")
  .addEventListener("click", () => loadGame());
document.addEventListener("keydown", (e) => {
  if (currentGame === "sneck") {
    e.preventDefault();
    switch (e.key) {
      case "Enter":
        startSnakeGame();
        break;
      case "r":
        sneckGameInstance.resetGame();
        break;
      case "ArrowUp":
        sneckGameInstance.changeDirection(-1, 0);
        break;
      case "ArrowDown":
        sneckGameInstance.changeDirection(1, 0);
        break;
      case "ArrowLeft":
        sneckGameInstance.changeDirection(0, -1);
        break;
      case "ArrowRight":
        sneckGameInstance.changeDirection(0, 1);
        break;
      case "w":
        sneckGameInstance.changeDirection(-1, 0);
        break;
      case "s":
        sneckGameInstance.changeDirection(1, 0);
        break;
      case "a":
        sneckGameInstance.changeDirection(0, -1);
        break;
      case "d":
        sneckGameInstance.changeDirection(0, 1);
        break;
      case "W":
        sneckGameInstance.changeDirection(-1, 0);
        break;
      case "S":
        sneckGameInstance.changeDirection(1, 0);
        break;
      case "A":
        sneckGameInstance.changeDirection(0, -1);
        break;
      case "D":
        sneckGameInstance.changeDirection(0, 1);
        break;
    }
  }
});
