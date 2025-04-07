document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".mood-filter button");
    const posts = document.querySelectorAll(".post");
  
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const mood = button.getAttribute("data-mood");
  
        posts.forEach(post => {
          if (mood === "all" || post.getAttribute("data-mood") === mood) {
            post.style.display = "block";
          } else {
            post.style.display = "none";
          }
        });
      });
    });
  });
  