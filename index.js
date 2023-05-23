// Select card-inner elements instead of card-item
const cardInners = document.querySelectorAll(".card-inner");
let flippedCards = [];
let matchedCards = 0;
let clicks = 0;

const clickCount = document.querySelector("#click-count");

function incrementClicks() {
  clicks++;
  clickCount.innerHTML = `Click count: ${clicks} `;
}

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

shuffleArray(imagePool);

cardInners.forEach((cardInner, index) => {
  cardInner.querySelector(".card-back img").src = imagePool.pop();
  cardInner.dataset.id = index;
  cardInner.addEventListener("click", handleClick);
});

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
