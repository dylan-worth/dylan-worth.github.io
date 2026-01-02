document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('mobile-toggle');
    const channelLinks = document.querySelectorAll('.channel-link');

    // MOBILE TOGGLE
    if(toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // NAVIGATION
    channelLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-target');
            
            // Switch Active Channel Link
            channelLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch Message View
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(target).classList.add('active');

            // Update Header
            document.getElementById('header-text').innerText = target;

            // Auto-close on mobile
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
});
