export function setupStorage({ canvas, ctx, colorPicker, backgroundCheckbox, updatePreview }) {
    const saveSpriteBtn = document.createElement("button");
    saveSpriteBtn.textContent = "Save Sprite";
    saveSpriteBtn.id = "save-sprite";
    document.getElementById("toolbar").appendChild(saveSpriteBtn);
  
    const loadSpriteBtn = document.createElement("button");
    loadSpriteBtn.textContent = "Load Sprite";
    loadSpriteBtn.id = "load-sprite";
    document.getElementById("toolbar").appendChild(loadSpriteBtn);
  
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    document.body.appendChild(input);
  
    saveSpriteBtn.addEventListener("click", () => {
      const dataUrl = canvas.toDataURL("image/png");
      const spriteData = {
        image: dataUrl,
        width: canvas.width,
        height: canvas.height,
        transparent: backgroundCheckbox.checked
      };
  
      const blob = new Blob([JSON.stringify(spriteData)], { type: "application/json" });
      const link = document.createElement("a");
      link.download = "sprite.json";
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  
    loadSpriteBtn.addEventListener("click", () => input.click());
  
    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const sprite = JSON.parse(reader.result);
        const img = new Image();
        img.onload = () => {
          canvas.width = sprite.width;
          canvas.height = sprite.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (sprite.transparent) {
            backgroundCheckbox.checked = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            backgroundCheckbox.checked = false;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          updatePreview();
        };
        img.src = sprite.image;
      };
      reader.readAsText(file);
    });
  }