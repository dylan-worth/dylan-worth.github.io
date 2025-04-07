document.addEventListener("DOMContentLoaded", () => {
    const garden = document.getElementById("gardenPlot");
    const posts = document.querySelectorAll(".post");
  
    posts.forEach(post => {
      const mood = post.getAttribute("data-mood");
      if (mood) {
        const plant = document.createElement("div");
        plant.className = "plant";
        plant.setAttribute("data-type", mood);
        garden.appendChild(plant);
      }
    });
  });
  