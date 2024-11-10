// Function to toggle dark and light mode
function toggleTheme() {
    const body = document.body;
    const themeButton = document.getElementById("toggleTheme");

    // Toggle between dark and light mode
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        themeButton.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        themeButton.textContent = "Light Mode";
    }
}