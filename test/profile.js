const profileModal = document.getElementById('profile-modal');

function openProfile() {
    profileModal.classList.add('active');
}

function closeProfile() {
    profileModal.classList.remove('active');
}

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeProfile();
});

// Close when clicking overlay backdrop
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfile();
});
