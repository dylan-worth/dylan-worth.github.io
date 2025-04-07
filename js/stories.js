let storyData = [];
let currentStoryIndex = 0;
let currentSlideIndex = 0;
let timer;
let isPaused = false;
let startX = 0;
let startY = 0;

const viewer = document.getElementById('storyViewer');
const content = document.getElementById('storyContent');
const progressContainer = document.getElementById('progressContainer');
const storyMusic = document.getElementById('storyMusic');
const storyContainer = document.querySelector('.stories-container');

// 🔥 Load stories
fetch('stories.json')
  .then(res => res.json())
  .then(data => {
    storyData = data;
    renderStoryThumbnails();
  })
  .catch(err => console.error("Failed to load stories:", err));

// 📸 Render the top story thumbnails
function renderStoryThumbnails() {
  storyContainer.innerHTML = '';

  storyData.forEach((story, index) => {
    const div = document.createElement('div');
    div.className = 'story-thumb-wrap';

    const img = document.createElement('img');
    img.src = story.thumbnail;
    img.className = 'story-thumb';

    const label = document.createElement('span');
    label.textContent = story.name;

    div.appendChild(img);
    div.appendChild(label);

    div.addEventListener('click', () => {
      currentStoryIndex = index;
      currentSlideIndex = 0;
      showStory(currentStoryIndex, currentSlideIndex);
    });

    storyContainer.appendChild(div);
  });
}

// 🧠 Show story content
function showStory(storyIdx, slideIdx) {
  const story = storyData[storyIdx];

  if (!story || slideIdx >= story.slides.length) {
    // Move to next story or close
    if (storyIdx + 1 < storyData.length) {
      currentStoryIndex++;
      currentSlideIndex = 0;
      showStory(currentStoryIndex, currentSlideIndex);
    } else {
      closeStory();
    }
    return;
  }

  // Set music
  if (story.music) {
    storyMusic.src = story.music;
    storyMusic.play().catch(() => {}); // Avoid autoplay error
  }

  // Set theme
  if (story.theme) {
    viewer.style.setProperty('--accent', story.theme.accentColor || '#1877f2');
    viewer.style.background = story.theme.background || '#000';
  }

  viewer.classList.remove('hidden');
  content.innerHTML = story.slides[slideIdx];

  renderProgressBars(storyIdx, slideIdx);
  runTimer();
}

// ⏳ Slide timer
function runTimer() {
  clearTimeout(timer);
  const fills = document.querySelectorAll('.progress-fill');
  if (fills[currentSlideIndex]) {
    fills[currentSlideIndex].style.animation = 'fillStory 8s linear forwards';
    fills[currentSlideIndex].style.animationPlayState = 'running';
  }

  timer = setTimeout(() => {
    currentSlideIndex++;
    showStory(currentStoryIndex, currentSlideIndex);
  }, 8000);
}

// 🎚️ Progress bars
function renderProgressBars(storyIdx, activeSlideIdx) {
  progressContainer.innerHTML = '';
  const slides = storyData[storyIdx].slides;

  slides.forEach((_, i) => {
    const bar = document.createElement('div');
    bar.className = 'progress-bar';

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = i < activeSlideIdx ? '100%' : '0%';

    bar.appendChild(fill);
    progressContainer.appendChild(bar);
  });
}

// ❌ Close story
function closeStory() {
  viewer.classList.add('hidden');
  clearTimeout(timer);
  content.innerHTML = '';
  progressContainer.innerHTML = '';
  storyMusic.pause();
  storyMusic.src = '';
  currentSlideIndex = 0;
  currentStoryIndex = 0;
}

// ✋ Touch for pause / swipe
viewer.addEventListener('touchstart', e => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;

  if (e.target.closest('.story-content')) {
    isPaused = true;
    clearTimeout(timer);
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.animationPlayState = 'paused';
  }
});

viewer.addEventListener('touchend', e => {
  const diffX = e.changedTouches[0].clientX - startX;
  const diffY = e.changedTouches[0].clientY - startY;

  if (isPaused) {
    isPaused = false;
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.animationPlayState = 'running';
    runTimer();
    return;
  }

  if (diffY > 80) {
    closeStory();
  } else if (diffX > 50) {
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
    showStory(currentStoryIndex, currentSlideIndex);
  } else if (diffX < -50) {
    currentSlideIndex++;
    showStory(currentStoryIndex, currentSlideIndex);
  }
});
