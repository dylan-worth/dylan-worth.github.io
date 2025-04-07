
const left = document.getElementById('pageLeft');
const right = document.getElementById('pageRight');

const lorePages = [
  {
    left: `<h2>📖 About me</h2><p>My name is Dylan Worth, I am a father of four children,
    <br> Elaina, Ezra, Evelyn, & Ethan, and married to my beautiful wife Kimberly.</p>`,
    right: `<h2>🧫 My Goals</h2><p>I am working towards my MRSA and eventually want to become a Mycologist.</p>`
  },
  {
    left: `<h2>🔧 My Values</h2><p>I believe that everyone should be given an equal shot at life. This can come off as liberal at times to some but I don't agree in 
    pure handouts, but I also don't believe in Corporations making the playing field uneven. I love Free & Open source software becuase it gives every user the 
    ability to be self sufficient on their own with knowing there isn't the telemetry</p>`,
    right: `<h2>🌱 The Future</h2><p>I plan on updating this website more and this will be my closing page. No matter what you set out to do with a bit of 
    ambition, tenacity, and push you can be wherever you want to be.</p>`
  },
];

let currentIndex = 0;

function renderPages() {
  const page = lorePages[currentIndex];
  left.innerHTML = page.left;
  right.innerHTML = page.right;
}

function nextPage() {
  if (currentIndex < lorePages.length - 1) {
    currentIndex++;
    renderPages();
  }
}

function prevPage() {
  if (currentIndex > 0) {
    currentIndex--;
    renderPages();
  }
}

document.addEventListener('DOMContentLoaded', renderPages);