function createEasterEgg() {
    const easterEgg = document.createElement('img');
    easterEgg.src = '../images/profile/decorations/easter-egg.jpg'; // Replace with your Easter egg image path
    easterEgg.className = 'pfp_decorations';
    easterEgg.style.width = '50px'; // Adjust the size of the Easter egg
    easterEgg.style.height = '50px'; // Adjust the size of the Easter egg
    easterEgg.style.left = `${Math.random() * window.innerWidth}px`;
    easterEgg.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
    document.getElementsByClassName('profile_picture').appendChild(easterEgg);
    setTimeout(() => {
      easterEgg.remove();
    }, 10000); // Remove Easter egg after 10 seconds
  }
  
  setInterval(createEasterEgg, 2000); // Create a new Easter egg every 2 seconds
  