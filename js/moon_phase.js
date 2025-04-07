function getMoonPhase() {
    const now = new Date();
    const lp = 2551443; // lunar period in seconds
    const newMoon = new Date(1970, 0, 7, 20, 35, 0);
    const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
    return Math.floor((phase / lp) * 8);
  }

  function updateMoonWidget() {
    const moon = document.getElementById("moonPhase");
    const phases = [
      "radial-gradient(circle at 60% 40%, #222, #111)", // new
      "radial-gradient(circle at 50% 40%, #ddd 50%, #111)", // waxing crescent
      "radial-gradient(circle at 50% 40%, #ccc 75%, #111)", // first quarter
      "radial-gradient(circle at 50% 40%, #eee 90%, #111)", // waxing gibbous
      "radial-gradient(circle at center, #fff, #ccc)", // full
      "radial-gradient(circle at 50% 40%, #eee 90%, #111)", // waning gibbous
      "radial-gradient(circle at 50% 40%, #ccc 75%, #111)", // last quarter
      "radial-gradient(circle at 50% 40%, #ddd 50%, #111)", // waning crescent
    ];
    moon.style.background = phases[getMoonPhase()];
  }

  updateMoonWidget();