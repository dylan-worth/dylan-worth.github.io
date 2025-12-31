// news.js
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.read-more-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const article = e.target.closest('.update-row');
            if (article.dataset.dissolving === "true") return;
            
            article.dataset.dissolving = "true";
            
            // Select all text elements to dissipate
            const elementsToDissolve = article.querySelectorAll('.date, .headline, .summary, .read-more-btn');

            elementsToDissolve.forEach(el => {
                const text = el.innerText;
                el.innerHTML = ''; // Clear original text

                [...text].forEach((char, i) => {
                    const span = document.createElement('span');
                    span.innerText = char === ' ' ? '\u00A0' : char;
                    span.className = 'spore-span';
                    el.appendChild(span);

                    // Animate each letter
                    setTimeout(() => {
                        const moveX = (Math.random() - 0.5) * 200;
                        const moveY = (Math.random() - 0.5) * 200;
                        const rotation = Math.random() * 720;

                        span.style.transition = `transform ${1.5 + Math.random()}s ease-out, opacity 1.5s ease-out`;
                        span.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg) scale(0)`;
                        span.style.opacity = '0';
                        span.style.color = '#4a5d23'; // Turns green as it "rots"
                    }, i * 10);
                });
            });

            // Remove the article from view after animation
            setTimeout(() => {
                article.style.transition = 'opacity 1s, height 1s';
                article.style.opacity = '0';
                article.style.height = '0';
                article.style.padding = '0';
                article.style.margin = '0';
                setTimeout(() => article.remove(), 1000);
            }, 2500);
        });
    });
});
