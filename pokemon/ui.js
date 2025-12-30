export const UI = {
    menuOpen: false,
    team: ["PIKACHU", "PIDGEY"],

    init(toggleCallback) {
        const startBtn = document.getElementById('btn-start');
        const menu = document.getElementById('start-menu');

        // Toggle Start Menu
        startBtn.addEventListener('click', () => {
            this.menuOpen = !this.menuOpen;
            menu.classList.toggle('hidden');
            if (toggleCallback) toggleCallback(this.menuOpen);
        });

        // Menu Item Interactions
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const choice = e.target.innerText;
                if(choice === "POKÉMON") {
                    alert("Team: " + this.team.join(", "));
                } else if(choice === "EXIT") {
                    this.menuOpen = false;
                    menu.classList.add('hidden');
                    if (toggleCallback) toggleCallback(false);
                }
            });
        });
    },

    typeWriter(text, elementClass) {
        const box = document.querySelector(elementClass);
        box.innerHTML = "";
        let i = 0;
        const speed = 40; 
        
        function type() {
            if (i < text.length) {
                box.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
};
