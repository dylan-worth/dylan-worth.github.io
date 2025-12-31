// news.js
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.read-more-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            const targetUrl = btn.getAttribute('data-url');
            const article = btn.closest('.update-row');
            
            if (article.dataset.dissolving === "true") return;
            article.dataset.dissolving = "true";
            
            // 1. Dissolve the text into spores
            const elementsToDissolve = article.querySelectorAll('.date, .headline, .summary, .read-more-btn');

            elementsToDissolve.forEach(el => {
                const text = el.innerText;
                el.innerHTML = ''; 

                [...text].forEach((char, i) => {
                    const span = document.createElement('span');
                    span.innerText = char === ' ' ? '\u00A0' : char;
                    span.className = 'spore-span';
                    el.appendChild(span);

                    setTimeout(() => {
                        const moveX = (Math.random() - 0.5) * 250;
                        const moveY = (Math.random() - 0.5) * 250;
                        const rotation = Math.random() * 720;

                        span.style.transition = `transform ${1.2 + Math.random()}s ease-out, opacity 1.2s ease-out`;
                        span.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg) scale(0)`;
                        span.style.opacity = '0';
                        span.style.color = '#4a5d23'; 
                    }, i * 8);
                });
            });

            // 2. Redirect to the specific news page after a short delay
            // This allows the user to see the "spore" effect before leaving the page
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1800); 
        });
    });
});
