import { updatePetMood } from "./mossypixel-pet.js";
import { registerShortcuts } from "./mossypixel-shortcuts.js";
import { setupStorage } from "./mossypixel-storage.js";

const canvas = document.getElementById("pixel-canvas");
const gridCanvas = document.getElementById("grid-overlay");
const previewCanvas = document.getElementById("preview-canvas");
const ctx = canvas.getContext("2d");
const gtx = gridCanvas.getContext("2d");
const ptx = previewCanvas.getContext("2d");

const colorPicker = document.getElementById("color-picker");
const zoomSlider = document.getElementById("zoom");
const toggleGridBtn = document.getElementById("toggle-grid");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const saveBtn = document.getElementById("save-image");
const themeToggle = document.getElementById("theme-toggle");
const toolButtons = document.querySelectorAll(".tool");

let tool = "brush";
let zoom = 10;
let isDrawing = false;
let gridEnabled = false;
let streak = 0;
let undoStack = [];
let redoStack = [];

function resizeCanvases() {
  canvas.style.width = `${canvas.width * zoom}px`;
  canvas.style.height = `${canvas.height * zoom}px`;
  gridCanvas.style.width = canvas.style.width;
  gridCanvas.style.height = canvas.style.height;
  drawGrid();
}
resizeCanvases();

ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Undo/Redo
function pushUndoState() {
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}
function undo() {
  if (undoStack.length === 0) return;
  redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const last = undoStack.pop();
  ctx.putImageData(last, 0, 0);
  drawGrid();
  updatePreview();
}
function redo() {
  if (redoStack.length === 0) return;
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const next = redoStack.pop();
  ctx.putImageData(next, 0, 0);
  drawGrid();
  updatePreview();
}

let themeState = localStorage.getItem("mossyTheme") || "dark";

function setTheme(state) {
  document.body.className = `theme-${state}`;
  themeToggle.textContent = state === "light" ? "☀️" : state === "infected" ? "☣️" : "🌙";
  localStorage.setItem("mossyTheme", state);
}

themeToggle.addEventListener("click", () => {
  themeState = themeState === "dark" ? "light"
             : themeState === "light" ? "infected"
             : "dark";
  setTheme(themeState);
});

setTheme(themeState);

// Get mouse position
function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((evt.clientX - rect.left) / zoom),
    y: Math.floor((evt.clientY - rect.top) / zoom)
  };
}

// Drawing
function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
  updatePreview();
  streak++;
  updatePetMood(streak);
}

function fillBucket(x, y, targetColor, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const stack = [{ x, y }];
  const index = (x, y) => (y * canvas.width + x) * 4;

  const match = (i) => (
    imageData.data[i] === targetColor[0] &&
    imageData.data[i + 1] === targetColor[1] &&
    imageData.data[i + 2] === targetColor[2] &&
    imageData.data[i + 3] === targetColor[3]
  );

  const set = (i) => {
    imageData.data[i] = fillColor[0];
    imageData.data[i + 1] = fillColor[1];
    imageData.data[i + 2] = fillColor[2];
    imageData.data[i + 3] = 255;
  };

  while (stack.length) {
    const { x, y } = stack.pop();
    const i = index(x, y);
    if (!match(i)) continue;
    set(i);
    if (x > 0) stack.push({ x: x - 1, y });
    if (x < canvas.width - 1) stack.push({ x: x + 1, y });
    if (y > 0) stack.push({ x, y: y - 1 });
    if (y < canvas.height - 1) stack.push({ x, y: y + 1 });
  }

  ctx.putImageData(imageData, 0, 0);
  updatePreview();
}

// Events
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  streak = 0;
  pushUndoState();
  const { x, y } = getMousePos(e);
  if (tool === "brush") drawPixel(x, y, colorPicker.value);
  else if (tool === "eraser") drawPixel(x, y, "#000");
  else if (tool === "fill") {
    const data = ctx.getImageData(x, y, 1, 1).data;
    const newColor = hexToRgba(colorPicker.value);
    fillBucket(x, y, [...data], newColor);
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const { x, y } = getMousePos(e);
  if (tool === "brush") drawPixel(x, y, colorPicker.value);
  else if (tool === "eraser") drawPixel(x, y, "#000");
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  streak = 0;
});
canvas.addEventListener("mouseleave", () => isDrawing = false);

zoomSlider.addEventListener("input", () => {
  zoom = parseInt(zoomSlider.value);
  resizeCanvases();
});

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    toolButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tool = btn.id.replace("tool-", "");
  });
});

toggleGridBtn.addEventListener("click", () => {
  gridEnabled = !gridEnabled;
  drawGrid();
});

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

function drawGrid() {
  gtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  if (!gridEnabled) return;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if ((x + y) % 2 === 0) {
        gtx.fillStyle = "rgba(0,255,0,0.07)";
        gtx.fillRect(x, y, 1, 1);
      }
    }
  }
}

function hexToRgba(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
}

function updatePreview() {
  ptx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  ptx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
}

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "pixel-art.png";
  link.href = canvas.toDataURL();
  link.click();
});
registerShortcuts({
    undo,
    redo,
    toggleGrid: () => {
      gridEnabled = !gridEnabled;
      drawGrid();
    },
    saveImage: () => {
      const link = document.createElement("a");
      link.download = "pixel-art.png";
      link.href = canvas.toDataURL();
      link.click();
    },
    setTool: (t) => {
      tool = t;
      toolButtons.forEach(b => b.classList.remove("active"));
      const match = document.getElementById(`tool-${t}`);
      if (match) match.classList.add("active");
    }
  });
  const backgroundCheckbox = document.getElementById("transparent-bg");
  if (backgroundCheckbox.checked) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

setupStorage({
  canvas,
  ctx,
  colorPicker,
  backgroundCheckbox,
  updatePreview
});
