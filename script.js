const emojis = ["🍕", "🎮", "🐱", "⚡", "🔥", "🎵", "🦀", "🍍"];
let stack = [];
let flippedCards = [];
let lockBoard = false;
let score = 0;
let moves = 0;
let timerInterval;
let secondsElapsed = 0;

const grid = document.getElementById("memory-grid");
const message = document.getElementById("game-message");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");
const pushCardBtn = document.getElementById("push-card-btn");
const popCardBtn = document.getElementById("pop-card-btn");

// --- GAME SETUP ---
function initializeGame() {
  const pairs = emojis.slice(0, 6);
  let cards = [...pairs, ...pairs];
  cards = shuffle(cards);
  cards.forEach(cardEmoji => {
    const cardElement = createCardElement(cardEmoji);
    grid.appendChild(cardElement);
  });
  startTimer();
}

function createCardElement(emoji) {
  const card = document.createElement("div");
  card.classList.add("card", "hidden");
  card.textContent = emoji;
  card.addEventListener("click", () => flipCard(card, emoji));
  return card;
}

// --- TIMER ---
function startTimer() {
  clearInterval(timerInterval);
  secondsElapsed = 0;
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const seconds = String(secondsElapsed % 60).padStart(2, "0");
    timeDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

// --- FLIP FUNCTION ---
function flipCard(cardElement, cardEmoji) {
  if (lockBoard || cardElement.classList.contains("matched") || flippedCards.some(f => f.cardElement === cardElement)) return;

  cardElement.classList.remove("hidden");
  flippedCards.push({ cardElement, cardEmoji });

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    lockBoard = true;

    const [first, second] = flippedCards;
    if (first.cardEmoji === second.cardEmoji && first.cardElement !== second.cardElement) {
      matchFound(first, second);
    } else {
      noMatch(first, second);
    }
  }
}

function matchFound(first, second) {
  first.cardElement.classList.add("matched");
  second.cardElement.classList.add("matched");
  score += 10;
  scoreDisplay.textContent = score;
  message.textContent = "✅ Match found!";
  flippedCards = [];
  lockBoard = false;
}

function noMatch(first, second) {
  message.textContent = "❌ Not a match!";
  setTimeout(() => {
    first.cardElement.classList.add("hidden");
    second.cardElement.classList.add("hidden");
    flippedCards = [];
    lockBoard = false;
  }, 900);
}

// --- STACK CONTROLS ---
function pushCard() {
  if (stack.length >= 24) {
    message.textContent = "❌ Stack full!";
    return;
  }
  const emoji = getRandomCard();
  const card1 = createCardElement(emoji);
  const card2 = createCardElement(emoji);
  stack.push(emoji, emoji);
  grid.appendChild(card1);
  grid.appendChild(card2);
  message.textContent = "📦 2 cards added!";
}

function popCard() {
  if (stack.length < 2) {
    message.textContent = "❌ Nothing to pop!";
    return;
  }
  stack.pop();
  stack.pop();
  grid.removeChild(grid.lastChild);
  grid.removeChild(grid.lastChild);
  message.textContent = "📤 2 cards removed!";
}

// --- HELPERS ---
function getRandomCard() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// --- RESTART ---
function restartGame() {
  clearInterval(timerInterval);
  grid.innerHTML = "";
  stack = [];
  flippedCards = [];
  lockBoard = false;
  score = 0;
  moves = 0;
  scoreDisplay.textContent = "0";
  movesDisplay.textContent = "0";
  timeDisplay.textContent = "00:00";
  message.textContent = "Game restarted!";
  initializeGame();
}

// --- EVENT LISTENERS ---
restartBtn.addEventListener("click", restartGame);
pushCardBtn.addEventListener("click", pushCard);
popCardBtn.addEventListener("click", popCard);

// --- START GAME ---
initializeGame();