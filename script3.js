const gameContainer = document.getElementById('game-container');
const missedCountElement = document.getElementById('missed-count');
const typingInput = document.getElementById('typing-input');

const words = ['hello', 'world', 'javascript', 'coding', 'typing', 'game', 'fun', 'challenge', 'speed', 'react'];
let missedCount = 0;
let speed = 2; // initial falling speed
let fallInterval;
let highestPosition = gameContainer.offsetHeight; // Tracks the highest position of missed boxes
let gameStarted = false; // Track whether the game has started

function createFallingBox(word) {
    const fallingBox = document.createElement('div');
    fallingBox.className = 'falling-box active';
    fallingBox.textContent = word;
    gameContainer.appendChild(fallingBox);

    fallInterval = setInterval(() => {
        fallingBox.style.top = `${fallingBox.offsetTop + speed}px`;

        if (fallingBox.offsetTop + fallingBox.offsetHeight >= highestPosition) {
            clearInterval(fallInterval);
            handleMissedBox(fallingBox);
            checkGameOver();
        }
    }, 30);
}

function handleMissedBox(fallingBox) {
    missedCount++;
    missedCountElement.textContent = missedCount;

    // Stop the box at the current highest position
    highestPosition -= fallingBox.offsetHeight;
    fallingBox.style.top = `${highestPosition}px`;
    fallingBox.classList.remove('active'); // Remove active effect

    if (missedCount < 5) {
        // Clear the input field and start new round
        typingInput.value = '';
        startNewRound();
    }
}

function checkGameOver() {
    if (missedCount >= 7) {
        alert('Game Over! You missed too many boxes.');
        resetGame();
    }
}

function resetGame() {
    missedCount = 0;
    speed = 2;
    highestPosition = gameContainer.offsetHeight; // Reset the highest position
    missedCountElement.textContent = '0';
    typingInput.value = '';
    gameContainer.innerHTML = '';
    gameStarted = false; // Reset game started flag
}

function startNewRound() {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    createFallingBox(randomWord);
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startNewRound();
    }
}

typingInput.addEventListener('input', () => {
    const inputValue = typingInput.value.trim();
    const activeBox = document.querySelector('.falling-box.active');

    if (activeBox && inputValue === activeBox.textContent) {
        clearInterval(fallInterval);
        typingInput.value = '';
        activeBox.remove(); // Remove the current box if typed correctly
        speed += 0.2; // increase speed after each correct word
        startNewRound();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!gameStarted) {
            startGame();
        }
    }
});

// startGame(); // Optional: Uncomment if you want the game to start automatically on page load
