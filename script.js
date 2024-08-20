const selectionScreen = document.querySelector('.selection-screen');
const gameContainer = document.querySelector('.game-container');
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
let letterType = 'uppercase'; // Default letter type

document.getElementById('uppercase-btn').addEventListener('click', () => {
    letterType = 'uppercase';
    startGameSetup();
});

document.getElementById('lowercase-btn').addEventListener('click', () => {
    letterType = 'lowercase';
    startGameSetup();
});

document.getElementById('mixed-btn').addEventListener('click', () => {
    letterType = 'mixed';
    startGameSetup();
});

function startGameSetup() {
    selectionScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
}

function createBubble() {
    if (missedBubbles >= maxMissedBubbles) return;

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    let letter;
    if (letterType === 'uppercase') {
        letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    } else if (letterType === 'lowercase') {
        letter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    } else {
        letter = Math.random() > 0.5 ? 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26)) : 
                 String.fromCharCode(97 + Math.floor(Math.random() * 26)); // A-Z or a-z
    }

    bubble.textContent = letter;
    bubble.letter = letter; // Store the letter as is (with its case)
    bubble.style.left = `${Math.random() * (bubbleContainer.clientWidth - 60)}px`;
    bubble.style.top = '-60px';
    bubbleContainer.appendChild(bubble);
}

function moveBubbles() {
    if (missedBubbles >= maxMissedBubbles) return;

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

function checkLetter(e) {
    if (missedBubbles >= maxMissedBubbles) return; // Ignore inputs if the game is over

    const typedLetter = e.key; // Capture the typed letter as-is

    const bubbles = document.querySelectorAll('.bubble');
    let bubbleFound = false;

    bubbles.forEach(bubble => {
        if (bubble.textContent === typedLetter) { // Compare the letter directly with its original case
            bubble.remove();
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
            bubbleFound = true;
        }
    });

    if (!bubbleFound) {
        console.log("No bubble found for letter:", typedLetter); // Debug log
    }
}

function startGame() {
    missedBubbles = 0;
    score = 0;
    bubbleSpeed = 2;
    bubbleFrequency = 2000;
    scoreDisplay.textContent = `Score: ${score}`;
    missedDisplay.textContent = `Missed: ${missedBubbles}`;

    gameStarted = true;

    // Start game loop with initial settings
    gameInterval = setInterval(() => {
        if (missedBubbles >= maxMissedBubbles) return;
        createBubble();
    }, bubbleFrequency);

    // Increase difficulty over time
    moveInterval = setInterval(() => {
        if (bubbleSpeed < 10) bubbleSpeed += 0.5; // Increase speed
        if (bubbleFrequency > 500) bubbleFrequency -= 100; // Decrease time between bubbles
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            if (missedBubbles >= maxMissedBubbles) return;
            createBubble();
        }, bubbleFrequency);
    }, 5000); // Increase difficulty every 5 seconds
}

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
