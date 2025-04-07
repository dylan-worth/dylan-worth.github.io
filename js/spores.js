const sporesContainer = document.getElementById('spores');
  for (let i = 0; i < 35; i++) {
    const s = document.createElement('div');
    s.className = 'spore';
    s.style.left = `${Math.random() * 100}vw`;
    s.style.animationDuration = `${5 + Math.random() * 10}s`;
    s.style.opacity = Math.random() * 0.4;
    sporesContainer.appendChild(s);
  }