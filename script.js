const bubbleContainer = document.getElementById('bubble-container');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
let score = 0;
let bubbleSpeed = 2;
let bubbleFrequency = 2000; // Time in milliseconds between new bubbles
let missedBubbles = 0;
const maxMissedBubbles = 10;
let gameInterval;
let moveInterval;
let gameStarted = false;

// Function to create a new bubble
function createBubble() {
    if (missedBubbles >= maxMissedBubbles) return; // Stop creating bubbles if the limit is reached

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter A-Z
    bubble.textContent = letter;
    bubble.style.left = `${Math.random() * (bubbleContainer.clientWidth - 60)}px`; // Random X position
    bubble.style.top = '-60px'; // Start above the screen
    bubble.letter = letter;
    bubbleContainer.appendChild(bubble);
}

// Function to move bubbles down the screen
function moveBubbles() {
    if (missedBubbles >= maxMissedBubbles) return; // Stop moving bubbles if the limit is reached

    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        bubble.style.top = `${parseFloat(bubble.style.top) + bubbleSpeed}px`;

        // Remove bubble if it goes off screen
        if (parseFloat(bubble.style.top) > bubbleContainer.clientHeight) {
            bubble.remove();
            missedBubbles += 1;
            missedDisplay.textContent = `Missed: ${missedBubbles}`;

            if (missedBubbles >= maxMissedBubbles) {
                endGame(); // End game if missed bubbles reach the limit
            }
        }
    });
}

// Function to check typed letter
function checkLetter(e) {
    if (missedBubbles >= maxMissedBubbles) return; // Ignore inputs if the game is over

    const typedLetter = e.key.toUpperCase();
    if (typedLetter === '*') {
        document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
    } else {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            if (bubble.letter === typedLetter) {
                bubble.remove();
                score += 1;
                scoreDisplay.textContent = `Score: ${score}`;
            }
        });
    }
}

// Function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        missedBubbles = 0;
        score = 0;
        bubbleSpeed = 2;
        bubbleFrequency = 2000;
        scoreDisplay.textContent = `Score: ${score}`;
        missedDisplay.textContent = `Missed: ${missedBubbles}`;

        // Start game loop with initial settings
        gameInterval = setInterval(() => {
            if (missedBubbles >= maxMissedBubbles) return; // Stop creating bubbles if the limit is reached
            createBubble();
        }, bubbleFrequency);

        // Increase difficulty over time
        moveInterval = setInterval(() => {
            if (bubbleSpeed < 10) bubbleSpeed += 0.5; // Increase speed
            if (bubbleFrequency > 500) bubbleFrequency -= 100; // Decrease time between bubbles
            clearInterval(gameInterval);
            gameInterval = setInterval(() => {
                if (missedBubbles >= maxMissedBubbles) return; // Stop creating bubbles if the limit is reached
                createBubble();
            }, bubbleFrequency);
        }, 5000); // Increase difficulty every 5 seconds
    }
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(moveInterval);
    gameStarted = false;

    // Display the game over notification
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'game-over';
    gameOverDiv.innerHTML = `
        <p>Game Over! You missed ${missedBubbles} bubbles.</p>
        <button id="restart-btn">Start Again</button>
        <button id="back-btn">Back</button>
    `;
    bubbleContainer.appendChild(gameOverDiv);

    // Add event listeners for the buttons
    document.getElementById('restart-btn').addEventListener('click', () => {
        gameOverDiv.remove();
        startGame(); // Restart the game
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        gameOverDiv.remove();
        // Here you can add functionality to go back to the main menu or previous screen
    });
}

// Event listener for typing
document.addEventListener('keydown', (e) => {
    if (!gameStarted && e.key === 'Enter') {
        startGame(); // Start game when "Enter" is pressed
    } else if (gameStarted) {
        checkLetter(e); // Check typed letter during gameplay
    }
});

// Move bubbles continuously
setInterval(moveBubbles, 30);
