// 🌙 Dylan's Profile Script
document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll(".post-text");

  posts.forEach((post, index) => {
    const text = post.textContent.trim();
    const words = text.split(" ");
    const limit = 40; // adjust word limit if you want shorter previews

    if (words.length > limit) {
      const visible = words.slice(0, limit).join(" ");
      const hidden = words.slice(limit).join(" ");
      post.innerHTML = `
        <span class="visible-text">${visible}</span>
        <span class="dots">...</span>
        <span class="hidden-text" style="display:none; opacity:0;"> ${hidden}</span>
      `;

      // Create the Read More button
      const button = document.createElement("button");
      button.classList.add("read-more");
      button.textContent = "Read more";
      post.after(button);

      // Add click event
      button.addEventListener("click", () => {
        const dots = post.querySelector(".dots");
        const hiddenText = post.querySelector(".hidden-text");

        if (hiddenText.style.display === "none") {
          // Expand
          dots.style.display = "none";
          hiddenText.style.display = "inline";
          fadeIn(hiddenText);
          button.textContent = "Read less";
        } else {
          // Collapse
          fadeOut(hiddenText, () => {
            hiddenText.style.display = "none";
            dots.style.display = "inline";
            button.textContent = "Read more";
          });
        }
      });
    }
  });

  // ✨ Smooth fade animations
  function fadeIn(element) {
    element.style.opacity = 0;
    let opacity = 0;
    element.style.transition = "opacity 0.3s ease";
    const fade = setInterval(() => {
      opacity += 0.1;
      element.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fade);
    }, 30);
  }

  function fadeOut(element, callback) {
    let opacity = 1;
    element.style.transition = "opacity 0.3s ease";
    const fade = setInterval(() => {
      opacity -= 0.1;
      element.style.opacity = opacity;
      if (opacity <= 0) {
        clearInterval(fade);
        callback();
      }
    }, 30);
  }

  console.log("✅ Profile page loaded successfully.");
});