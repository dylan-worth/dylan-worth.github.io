document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.tabs .tab-link');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // 1. Remove 'active' class from all tabs
            tabLinks.forEach(t => t.classList.remove('active'));

            // 2. Add 'active' class to the clicked tab
            link.classList.add('active');

            // 3. Perform Navigation/Functionality based on the target (Data-Target)
            const target = link.getAttribute('data-target');
            
            // Example for redirection (if different pages exist):
            // if (target === 'posts') {
            //     window.location.href = './index.html';
            // } else if (target === 'badges') {
            //     window.location.href = './badges.html';
            // }
            
            // For now, we'll just log the action:
            console.log(`Navigating to section: ${target}`);
        });
    });
});
