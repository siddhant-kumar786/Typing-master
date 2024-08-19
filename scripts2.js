const wordContainer = document.getElementById('word-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const textInput = document.getElementById('text-input');
const gameOverDiv = document.getElementById('game-over');
const finalScoreSpan = document.getElementById('final-score');

const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
let currentWord;
let score = 0;
let timer = 30;
let timerInterval;
let gameStarted = false;

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function displayWord() {
    currentWord = getRandomWord();
    wordContainer.textContent = currentWord;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        score = 0;
        timer = 30;
        scoreDisplay.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timer}s`;
        displayWord();

        timerInterval = setInterval(() => {
            timer -= 1;
            timerDisplay.textContent = `Time: ${timer}s`;
            if (timer <= 0) {
                endGame();
            }
        }, 1000);

        textInput.addEventListener('input', checkInput);
    }
}

function checkInput() {
    if (textInput.value.trim() === currentWord) {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
        displayWord();
        textInput.value = '';
    }
}

function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    finalScoreSpan.textContent = score;
    gameOverDiv.style.display = 'block';
}

document.getElementById('restart-btn').addEventListener('click', () => {
    gameOverDiv.style.display = 'none';
    startGame();
});

// Automatically start the game when the page loads
window.onload = startGame;
