let bubbleTimeout;

export function updatePetMood(streak) {
  const pet = document.getElementById("pet");
  const bubble = document.getElementById("pet-bubble");

  pet.classList.remove("happy", "excited");
  bubble.style.display = "none";
  clearTimeout(bubbleTimeout);

  if (streak > 50) {
    pet.classList.add("excited");
    showBubble("You're going wild!");
  } else if (streak > 10) {
    pet.classList.add("happy");
    showBubble("Keep it up!");
  }

  function showBubble(text) {
    bubble.textContent = text;
    bubble.style.display = "block";
    bubbleTimeout = setTimeout(() => {
      bubble.style.display = "none";
    }, 2000);
  }
}