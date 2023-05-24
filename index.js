const cardInners = document.querySelectorAll(".card-inner");
const totalCount = document.querySelector("#total-count");
const gameTimer = document.querySelector("#game-timer");
const matchCount = document.querySelector("#match-count");
const remainingCount = document.querySelector("#remaining-count");
const difficultySelector = document.querySelector("#difficulty-selector");
let difficulty = difficultySelector.value; // This will be 'easy', 'medium', or 'hard'

let flippedCards = [];
let matchedCards = 0;
let clicks = 0;
let gameStarted = false;
let timeLimit;
let lock = false;


let startTime;
let timerInterval = null;

const clickCount = document.querySelector("#click-count");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");
const powerUpButton = document.querySelector("#power-up-button");
powerUpButton.addEventListener("click", usePowerUp);

const images = [
  "./images/muck.png",
  "./images/rat.png",
  "./images/snorlax.webp",
];

let imagePool = [...images, ...images];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  gameTimer.innerHTML = `Game timer: ${elapsedSeconds}s`;

  if (elapsedSeconds >= timeLimit) {
    clearInterval(timerInterval);
    alert("Time's up! Game over.");
    resetGame();
  }
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  let difficulty = difficultySelector.value;
  switch (difficulty) {
    case "easy":
      timeLimit = 60;
      break;
    case "medium":
      timeLimit = 45;
      break;
    case "hard":
      timeLimit = 30;
      break;
    default:
      timeLimit = 60;
  }

  clearInterval(timerInterval);

  // Shuffle the image pool
  shuffleArray(imagePool);

  // Reset game state
  resetGameState();

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  // Initialize the counts
  totalCount.innerHTML = `Total pairs: ${cardInners.length / 2}`;
  updateCounts();

  // Assign an image to each card
  cardInners.forEach((cardInner, index) => {
    // Use index to access image from the shuffled image pool
    cardInner.querySelector(".card-back img").src = imagePool[index];
    cardInner.dataset.id = index;
    cardInner.addEventListener("click", handleClick);
  });
}


function resetGame() {
  gameStarted = false;

  // Reset image pool
  imagePool = [...images, ...images];

  // Code to reset game goes here
  // For example, remove event listeners from cards
  cardInners.forEach((cardInner, index) => {
    cardInner.removeEventListener("click", handleClick);
  });
 clearInterval(timerInterval);
 gameTimer.innerHTML = "Game timer: 0s";
  powerUpUsed = false;

  clearInterval(timerInterval);
  gameTimer.innerHTML = "Game timer: 0s";

  // Reset the counts
  matchCount.innerHTML = `Pairs matched: 0`;
  remainingCount.innerHTML = `Pairs left: ${cardInners.length / 2}`;

  // And reset the game state
  resetGameState();
}

function updateCounts() {
  matchCount.innerHTML = `Pairs matched: ${matchedCards / 2}`;
  remainingCount.innerHTML = `Pairs left: ${
    cardInners.length / 2 - matchedCards / 2
  }`;
}

function resetGameState() {
  flippedCards = [];
  matchedCards = 0;
  clicks = 0;
  clickCount.innerHTML = `Click count: ${clicks} `;

  cardInners.forEach((cardInner, index) => {
    cardInner.classList.remove("flip", "matched");
  });
}


function incrementClicks() {
  clicks++;
  clickCount.innerHTML = `Click count: ${clicks} `;
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function handleClick(e) {
  const card = e.currentTarget;
  // If the user clicks on the same card twice, or a card that is already matched, or while two cards are already flipped, do nothing.
  if (
    flippedCards.includes(card) ||
    card.classList.contains("matched") ||
    flippedCards.length >= 2 ||
    lock // add this line
  ) {
    return;
  }
  flipCard(card);
  incrementClicks();
  flippedCards.push(card);
  checkMatch();

  updateCounts();
}


function flipCard(card) {
  card.classList.add("flip");
}

function unflipCards() {
  flippedCards.forEach((card) => card.classList.remove("flip"));
  flippedCards = [];
}

function checkMatch() {
  if (flippedCards.length < 2) return;
  const [firstCard, secondCard] = flippedCards;
  if (
    firstCard.querySelector(".card-back img").src ===
    secondCard.querySelector(".card-back img").src
  ) {
    // Cards match
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCards += 2;
    flippedCards = [];
    if (matchedCards === cardInners.length) {
      setTimeout(() => {
        alert("You won the game!");
      }, 1000);

      clearInterval(timerInterval);
      // Display a winning message
    }
  } else {
    // Cards do not match, unflip after a delay
    lock = true; // Lock the board
    setTimeout(() => {
      unflipCards();
      lock = false; // Unlock the board
    }, 1000);
  }
}


function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const remainingSeconds = timeLimit - elapsedSeconds;

  if (remainingSeconds <= 0) {
    // If time is up, stop the timer and end the game
    clearInterval(timerInterval);
    gameTimer.innerHTML = "Time's up!";
    gameStarted = false; // Reset the game state
    // You can also display a message that the player lost, reset the game, etc.
  } else {
    gameTimer.innerHTML = `Time remaining: ${remainingSeconds}s`;
  }
}

const themeButton = document.querySelector("#theme-button");
themeButton.addEventListener("click", toggleTheme);

function toggleTheme() {
  document.body.classList.toggle("dark");
}

let powerUpUsed = false;

function usePowerUp() {
  if (powerUpUsed || !gameStarted) return; // power-up can only be used once per game, and only after the game has started
  powerUpUsed = true;

  // Flip all the cards
  cardInners.forEach((cardInner) => {
    cardInner.classList.add("flip");
  });

  // Then after a short delay, flip them back
  setTimeout(() => {
    cardInners.forEach((cardInner) => {
      // Only flip back cards that haven't been matched
      if (!cardInner.classList.contains("matched")) {
        cardInner.classList.remove("flip");
      }
    });
  }, 2000); // 2 seconds, adjust as needed
}

