document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('counter');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');

    let count = 0;

    incrementBtn.addEventListener('click', () => {
        count++;
        counterElement.textContent = count;
        animateCounter();
    });

    decrementBtn.addEventListener('click', () => {
        count--;
        counterElement.textContent = count;
        animateCounter();
    });

    function animateCounter() {
        counterElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
            counterElement.style.transition = 'transform 0.1s ease-in-out';
        }, 50);
    }
});
