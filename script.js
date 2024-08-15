// Function to determine the current theme based on the date
function setThemeBasedOnDate() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-11
    const day = currentDate.getDate();

    if ((month === 8 || month === 9) || (month === 10 && day < 1)) {
        // Fall Theme from August 1st to September 30th
        setFallTheme();
    } else if (month === 10 && day >= 1 && day <= 31) {
        // Halloween Theme from October 1st to October 31st
        setHalloweenTheme();
    }
}

// Function to apply Fall theme
function setFallTheme() {
    document.body.classList.remove('halloween');
    document.querySelector('header').classList.remove('halloween');
    document.querySelectorAll('article h2, .widget h3').forEach(element => {
        element.classList.remove('halloween');
    });
    document.querySelector('nav').classList.remove('halloween');
    document.getElementById('theme-toggle').classList.remove('halloween');
    document.getElementById('theme-toggle').textContent = 'Switch to Halloween Mode';
}

// Function to apply Halloween theme
function setHalloweenTheme() {
    document.body.classList.add('halloween');
    document.querySelector('header').classList.add('halloween');
    document.querySelectorAll('article h2, .widget h3').forEach(element => {
        element.classList.add('halloween');
    });
    document.querySelector('nav').classList.add('halloween');
    document.getElementById('theme-toggle').classList.add('halloween');
    document.getElementById('theme-toggle').textContent = 'Switch to Fall Mode';
}

// Event listener for manual theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    if (document.body.classList.contains('halloween')) {
        setFallTheme();
    } else {
        setHalloweenTheme();
    }
});

// Automatically set the theme based on the current date when the page loads
setThemeBasedOnDate();
