export function registerShortcuts({
    undo,
    redo,
    setTool,
    toggleGrid,
    saveImage
  }) {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
          case "r":
            e.preventDefault();
            redo();
            break;
          case "s":
            e.preventDefault();
            saveImage();
            break;
          case "g":
            e.preventDefault();
            toggleGrid();
            break;
          case "b":
            e.preventDefault();
            setTool("brush");
            break;
          case "e":
            e.preventDefault();
            setTool("eraser");
            break;
          case "f":
            e.preventDefault();
            setTool("fill");
            break;
        }
      }
    });
  }