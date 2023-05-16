const cardInners = document.querySelectorAll(".card-item");

let clicks = 0;

const clickCount = document.querySelector("#click-count");

cardInners.forEach((cardInner) => {
  cardInner.addEventListener("click", incrementClicks);
});

function incrementClicks() {
  clicks++;
  clickCount.innerHTML = `Click count: ${clicks} `;
  console.log("clicked");
}
