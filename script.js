// JavaScript to dynamically display important dates on the calendar
const importantDays = {
    "2024-11-10": "Portfolio Launch",
    "2024-11-28": "Turkey Day",
    // Add more dates and events here
};

// Array of month names for display
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Generate calendar grid for the current month
function generateCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const calendarMonth = document.getElementById("calendarMonth");
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Set the month and year at the top of the calendar
    calendarMonth.textContent = `${monthNames[month]} ${year}`;

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("calendar-day");
        
        // Highlight today's date
        if (day === today.getDate()) {
            dayElement.classList.add("today");
        }

        dayElement.textContent = day;

        // Add special event if it matches today's date
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (importantDays[dateKey]) {
            dayElement.title = importantDays[dateKey]; // Tooltip with event name
            dayElement.style.color = "#ffeb3b"; // Highlight important day
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Function to load more photos in the gallery
function loadMorePhotos() {
    const gallery = document.querySelector(".gallery");
    const additionalPhotos = [
        "photo3.jpg",
        "photo4.jpg"
    ];

    additionalPhotos.forEach(photoSrc => {
        const img = document.createElement("img");
        img.src = photoSrc;
        img.alt = "Additional Photo";
        gallery.appendChild(img);
    });
}
function toggleContent() {
    const content = document.getElementById("postContent");
    const button = document.getElementById("toggleButton");

    if (content.classList.contains("expanded")) {
        // Collapse content
        content.classList.remove("expanded");
        button.textContent = "Show More";
    } else {
        // Expand content
        content.classList.add("expanded");
        button.textContent = "Show Less";
    }
}


// Initialize the calendar on page load
document.addEventListener("DOMContentLoaded", generateCalendar);
