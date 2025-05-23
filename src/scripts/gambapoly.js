import playerImg from '../img/123.png';
import logoPath from '../img/gambapoly.png';
import tileStart from '../img/tiles/start.png';
import tileQuestion from '../img/tiles/question.png';
import tileBomb from '../img/tiles/bomb.png';
import prize1 from '../img/tiles/1.png';
import prize2 from '../img/tiles/2.png';
import prize3 from '../img/tiles/3.png';
import prize4 from '../img/tiles/4.png';
import prize5 from '../img/tiles/5.png';

const totalTiles = 40;
let position = 0;
let balance = 0;
let movesTotal = 0;
const winAmount = 50;
const tileMap = [];
const tileTypes = Array(totalTiles).fill("neutral");
const prizeValues = {};
const eventTiles = new Set();
const bankruptSet = new Set();

const tileImages = {
  start: tileStart,
  event: tileQuestion,
  bankrupt: tileBomb,
  prize: {
    1: prize1,
    2: prize2,
    3: prize3,
    4: prize4,
    5: prize5,
  },
};


const board = document.getElementById("board");
const diceDisplay = document.getElementById("dice");

for (let i = 0; i < 11; i++) tileMap.push({ row: 0, col: i });
for (let i = 1; i < 10; i++) tileMap.push({ row: i, col: 10 });
for (let i = 10; i >= 0; i--) tileMap.push({ row: 10, col: i });
for (let i = 9; i > 0; i--) tileMap.push({ row: i, col: 0 });

while (bankruptSet.size < 5) {
  const rand = Math.floor(Math.random() * totalTiles);
  if (rand !== 0) bankruptSet.add(rand);
}

while (eventTiles.size < 10) {
  const rand = Math.floor(Math.random() * totalTiles);
  if (!bankruptSet.has(rand) && rand !== 0) {
    eventTiles.add(rand);
  }
}

for (let i = 0; i < totalTiles; i++) {
  if (i === 0) {
    tileTypes[i] = "start";
  } else if (eventTiles.has(i)) {
    tileTypes[i] = "event";
  } else if (bankruptSet.has(i)) {
    tileTypes[i] = "bankrupt";
  } else {
    tileTypes[i] = "prize";
    prizeValues[i] = Math.floor(Math.random() * 5) + 1;
  }
}

const eventDescriptions = {
  1: "You feel degen and you deposited.",
  2: "MetroN is giving a generous Juice up of $1-10.",
  3: "You dropped your wallet and hyers stole $5.",
  4: "You succesfully begged fetter for a free +7$.",
  5: "You got timed out by paun -3$.",
  6: "lafka just begged you for $4.",
  7: "MRBEAST just donated you 5$.",
  8: "Metron ignores your gw ticket you lose half balance.",
  9: "suryy was generous and gifted you a sub +5$.",
  10: "You just got Fanum taxed and lost 50% of your balance.",
};

function triggerEvent() {
  const eventId = Math.floor(Math.random() * 10) + 1;
  let message = eventDescriptions[eventId];

  switch (eventId) {
    case 1:
      const factor = Math.random() < 0.5 ? 0.5 : 1.5;
      balance = Math.floor(balance * factor);
      message += ` Your balance is now ${factor}x!`;
      break;
    case 2:
      const reward = Math.floor(Math.random() * 10) + 1; 
      balance += reward;
      message += ` Gained $${reward}!`;
      break;
    case 4:
      balance += 7;
      break;
    case 3:
            balance = Math.max(0, balance - 5);
      break;
    case 5 :
      balance = Math.max(0, balance - 3);
      break;
    case 6:
      balance = Math.max(0, balance - 4);
      break;
    case 7:
      balance += 5;
      break;
      case 8:
              balance = Math.floor(balance / 2);
      break;
    case 9:
      balance += 5;
      break;
    case 10:
      balance = Math.floor(balance / 2);
      break;
    default:
      message += " Nothing happened.";
  }

  document.getElementById("eventDescription").textContent = message;
  document.getElementById("eventPopup").style.display = "block";
  updateStatus(message);
}

function closeEventPopup() {
  document.getElementById("eventPopup").style.display = "none";
  drawBoard();
}

function updateStatus(msg) {
  document.getElementById("status").textContent = `${msg} Balance: $${balance}`;
}

function drawBoard() {
  board.innerHTML = "";

  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const cell = document.createElement("div");
      cell.className = "tile";

      const tileIndex = tileMap.findIndex(t => t.row === r && t.col === c);
      if (tileIndex !== -1) {
        const type = tileTypes[tileIndex];
        cell.classList.add(type);

        if (type === "start") {
          const img = document.createElement("img");
          img.src = tileImages.start;
          img.alt = "Start";
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          cell.appendChild(img);
        } else if (type === "bankrupt") {
          const img = document.createElement("img");
          img.src = tileImages.bankrupt;
          img.alt = "Bankrupt";
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          cell.appendChild(img);
        } else if (type === "event") {
          const img = document.createElement("img");
          img.src = tileImages.event;
          img.alt = "Event";
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          cell.appendChild(img);
        } else if (type === "prize") {
          const prize = prizeValues[tileIndex];
          const img = document.createElement("img");
          img.src = tileImages.prize[prize];
          img.alt = `$${prize}`;
          img.style.maxWidth = "100%";
          img.style.maxHeight = "100%";
          cell.appendChild(img);
        }

        let previousPosition = position - 1;
        if (previousPosition < 0) previousPosition = totalTiles - 1;

        const from = tileMap[previousPosition];
        const to = tileMap[position];

        let angle = 0;
        if (to.row < from.row) angle = -90;
        else if (to.row > from.row) angle = 90;
        else if (to.col > from.col) angle = 0;
        else if (to.col < from.col) angle = 180;

        if (tileIndex === position) {
          const player = document.createElement("div");
          player.className = "player";
          const img = document.createElement("img");
          img.src = playerImg;
          img.alt = "Player";
          img.style.transform = `rotate(${angle}deg)`;
          player.appendChild(img);
          cell.appendChild(player);
        }

      } else if (r === 5 && c === 5) {
        cell.classList.add("logo1");
        const logoImg = document.createElement("img");
        logoImg.src = logoPath;
        logoImg.alt = "Logo";
        logoImg.style.maxWidth = "100%";
        logoImg.style.maxHeight = "100%";
        cell.appendChild(logoImg);

      } else {
        cell.classList.add("hidden");
      }

      board.appendChild(cell);
    }
  }
}

function animateDice(callback) {
  let count = 0;
  const interval = setInterval(() => {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceDisplay.textContent = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][roll];
    diceDisplay.style.transform = `rotate(${Math.random() * 360}deg)`;
    count++;
    if (count >= 10) {
      clearInterval(interval);
      callback(roll);
    }
  }, 80);
}

function movePlayer(steps, callback) {
  let moves = 0;
  const interval = setInterval(() => {
    position = (position + 1) % totalTiles;
    moves++;
    movesTotal++;
    drawBoard();

    if (movesTotal >= totalTiles && position === 0) {
      clearInterval(interval);
      updateStatus(`You've completed a full loop! 🎯 Final Balance: $${balance}`);
      document.getElementById("rollBtn").disabled = true;
      return;
    }

    if (moves >= steps) {
      clearInterval(interval);
      callback();
    }
  }, 300);
}


function rollDice() {
  if (balance >= winAmount) return;

  animateDice(roll => {
    movePlayer(roll, () => {
      let message = `You rolled a ${roll}. `;

      if (eventTiles.has(position)) {
        triggerEvent();
      } else {
        const tileType = tileTypes[position];
        if (tileType === "bankrupt") {
          message += "Bankrupt tile! 💥 You lost all your money!";
          balance = 0;

        } else if (tileType === "prize") {
          const prize = prizeValues[position];
          balance += prize;
          message += `You won $${prize}.`;
          if (balance >= winAmount) {
            message += " 🎉 You win!";
            document.querySelector("button").disabled = true;
          }
        }
        updateStatus(message);
      }

      drawBoard();
    });
  });
}
movesTotal = 0;

function resetGame() {
  position = 0;
  balance = 0;
  document.querySelector("button").disabled = false;
  updateStatus("Game reset. Balance: $0");

  bankruptSet.clear();
  eventTiles.clear();

  while (bankruptSet.size < 5) {
    const rand = Math.floor(Math.random() * totalTiles);
    if (rand !== 0) bankruptSet.add(rand);
  }

  while (eventTiles.size < 10) {
    const rand = Math.floor(Math.random() * totalTiles);
    if (!bankruptSet.has(rand) && rand !== 0) {
      eventTiles.add(rand);
    }
  }

  for (let i = 0; i < totalTiles; i++) {
    if (i === 0) {
      tileTypes[i] = "start";
    } else if (eventTiles.has(i)) {
      tileTypes[i] = "event";
    } else if (bankruptSet.has(i)) {
      tileTypes[i] = "bankrupt";
    } else {
      tileTypes[i] = "prize";
      prizeValues[i] = Math.floor(Math.random() * 5) + 1;
    }
  }

  drawBoard();
}
function cashOut() {
  updateStatus(`You cashed out with $${balance}. 🏁 Game Over!`);
  document.getElementById("rollBtn").disabled = true;
}


drawBoard();

window.rollDice = rollDice;
window.resetGame = resetGame;
window.closeEventPopup = closeEventPopup;
window.cashOut = cashOut;
