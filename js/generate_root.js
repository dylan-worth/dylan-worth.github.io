function generateRootWeek() {
    const rootWrap = document.querySelector('.root-week');
    const currentWeek = Math.floor((Date.now() - new Date("2025-01-01")) / (1000 * 60 * 60 * 24 * 7));
    rootWrap.innerHTML = '';

    for (let i = 0; i <= currentWeek % 12; i++) {
      const div = document.createElement('div');
      div.style.animationDelay = `${i * 0.2}s`;
      rootWrap.appendChild(div);
    }
  }

  generateRootWeek();