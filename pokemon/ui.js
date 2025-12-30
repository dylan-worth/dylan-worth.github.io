export const UI = {
    menuOpen: false,

    init(toggleCallback) {
        const startBtn = document.getElementById('btn-start');
        const menu = document.getElementById('start-menu');

        startBtn.addEventListener('click', () => {
            this.menuOpen = !this.menuOpen;
            menu.classList.toggle('hidden');
            if (toggleCallback) toggleCallback(this.menuOpen);
        });

        // Exit button inside menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if(e.target.innerText === "EXIT") {
                    this.menuOpen = false;
                    menu.classList.add('hidden');
                    if (toggleCallback) toggleCallback(false);
                }
            });
        });
    }
};
