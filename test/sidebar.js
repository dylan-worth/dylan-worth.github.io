document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobile-toggle');
    const channelLinks = document.querySelectorAll('.channel-link');
    const headerText = document.getElementById('header-text');
    const views = document.querySelectorAll('.view');

    // Toggle sidebar for mobile
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    // Navigation logic
    channelLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            
            // Switch Active Class
            channelLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch Content View
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Update Header
            headerText.innerText = targetId;

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && e.target !== toggle) {
            sidebar.classList.remove('open');
        }
    });
});
