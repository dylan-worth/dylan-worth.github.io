document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll(".post-text");

  posts.forEach(post => {
    const text = post.textContent.trim();
    const words = text.split(" ");
    const limit = 40;

    if (words.length > limit) {
      const visibleText = words.slice(0, limit).join(" ");
      const hiddenText = words.slice(limit).join(" ");
      post.innerHTML = `${visibleText}<span class="dots">...</span><span class="more-text" style="display:none;"> ${hiddenText}</span>`;
    }
  });

  const readMoreButtons = document.querySelectorAll(".read-more");
  readMoreButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const post = posts[index];
      const moreText = post.querySelector(".more-text");
      const dots = post.querySelector(".dots");

      if (moreText.style.display === "none") {
        moreText.style.display = "inline";
        dots.style.display = "none";
        button.textContent = "Read less";
      } else {
        moreText.style.display = "none";
        dots.style.display = "inline";
        button.textContent = "Read more";
      }
    });
  });
});