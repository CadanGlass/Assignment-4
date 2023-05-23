const cardInners = document.querySelectorAll(".card-inner");
let flippedCards = [];
let matchedCards = 0;
let clicks = 0;
let gameStarted = false;

const clickCount = document.querySelector("#click-count");
const startButton = document.querySelector("#start-button");
const resetButton = document.querySelector("#reset-button");

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

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  // Shuffle the image pool
  shuffleArray(imagePool);

  // Reset game state
  resetGameState();

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

  // And reset the game state
  resetGameState();
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
    flippedCards.length >= 2
  ) {
    return;
  }
  flipCard(card);
  incrementClicks();
  flippedCards.push(card);
  checkMatch();
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
      console.log("You won the game!");
      // Display a winning message
    }
  } else {
    // Cards do not match, unflip after a delay
    setTimeout(unflipCards, 1000);
  }
}
