document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('text-to-type');
    const userInput = document.getElementById('user-input');
    const timeElement = document.getElementById('time');
    const errorsElement = document.getElementById('errors');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');

    let textToType = '';
    let errors = 0;
    let timerInterval = null;
    const testDuration = 60; // Duration in seconds
    let textOffset = 0;
    let typedText = ''; // Store the typed text separately
    const textContainer = document.getElementById('text-container');

    // Load a new text for typing
    function loadText() {
        const texts = [
            'Two members of the 1984 class of Jefferson High School are chairing a group of 18 to look for a resort for the 20-year class reunion. A lovely place 78 miles from the city turns out to be the best. It has 254 rooms and a banquet hall to seat 378. It has been open 365 days per year since opening on May 30, 1926. They will need 450 to reserve the resort. Debbie Holmes was put in charge of buying 2,847 office machines for the entire firm. Debbie visited more than 109 companies in 35 states in 6 months. She will report to the board today in Room 2784 at 5 p.m. The board will consider her report about those 109 firms and recommend the top 2 or 3 brands to purchase. Debbie must decide before August 16. Lynn Greene said work started on the project March 27, 2003. The 246 blueprints were mailed to the office 18 days ago. The prints had to be 100 percent accurate before they were acceptable. The project should be finished by May 31, 2025. At that time there will be 47 new condominiums, each having at least 16 rooms. The building will be 25 stories.'
        ];
        textToType = texts[Math.floor(Math.random() * texts.length)];
        textElement.textContent = textToType;
        textOffset = 0;
        typedText = ''; // Reset typed text
        updateTextPosition(); // Center text initially
    }

    // Start the typing test
    function startTest() {
        loadText();  // Ensure text is loaded
        userInput.value = '';
        userInput.disabled = false;
        userInput.focus();
        startButton.disabled = true;
        resetButton.disabled = false;
        errors = 0;
        errorsElement.textContent = '0';

        // Start timer
        let remainingTime = testDuration;
        timeElement.textContent = remainingTime;
        timerInterval = setInterval(() => {
            remainingTime--;
            timeElement.textContent = remainingTime;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                userInput.disabled = true;
                alert('Your time is over!');
            }
        }, 1000);
    }

    // Update the text position
    function updateTextPosition() {
        const containerWidth = textContainer.clientWidth;
        const textWidth = textElement.scrollWidth;
        textElement.style.transform = `translateX(${-textOffset/1.5}px)`;
    }

    // Reset the typing test
    function resetTest() {
        clearInterval(timerInterval);
        startButton.disabled = false;
        resetButton.disabled = true;
        userInput.disabled = true;
        userInput.value = '';
        textElement.textContent = 'Loading...';
        textElement.style.transform = `translateX(0)`; // Reset position
        textOffset = 0;
        typedText = '';
    }

    // Handle input
    userInput.addEventListener('input', (e) => {
        const inputBtn = e.inputType;
        const newTypedText = userInput.value;

        if (inputBtn === 'deleteContentBackward') {
            if (typedText.length > 0) {
                // Update typedText
                typedText = typedText.slice(0, -1);
                // Move text left
                const letterWidth = textElement.querySelector('span').offsetWidth;
                textOffset -= letterWidth;
                updateTextPosition();

                // Update HTML to remove the last class
                const spans = textElement.querySelectorAll('span');
                const lastSpan = spans[typedText.length];
                if (lastSpan) {
                    lastSpan.classList.remove('correct', 'incorrect');
                    // lastSpan.classList.remove('current');
                    // Reapply the 'current' class to the current character
                    spans[typedText.length].classList.add('current');

                }
            }
        } else {
            // Handle normal typing
            typedText = newTypedText;
            let htmlText = '';

            for (let i = 0; i < textToType.length; i++) {
                if (i < typedText.length) {
                    if (typedText[i] === textToType[i]) {
                        htmlText += `<span class="correct">${textToType[i]}</span>`;
                    } else {
                        htmlText += `<span class="incorrect">${textToType[i]}</span>`;
                    }
                } else {
                    htmlText += `<span${i === typedText.length ? ' class="current"' : ''}>${textToType[i]}</span>`;
                }
            }

            textElement.innerHTML = htmlText;

            // Move the text left by one letter width regardless of correctness
            const letterWidth = textElement.querySelector('span').offsetWidth;
            textOffset = Math.min(textOffset + letterWidth, textElement.scrollWidth - textContainer.clientWidth);
            updateTextPosition();
        }

        // Check for space key press and errors
        if (e.inputType === 'insertText' && e.data === ' ') {
            const typedWords = typedText.trim().split(' ');
            const referenceWords = textToType.split(' ');
            const lastTypedWord = typedWords[typedWords.length - 1];
            const lastReferenceWord = referenceWords[typedWords.length - 1];

            // Check for errors in the last word typed
            if (lastTypedWord !== lastReferenceWord) {
                errors++;
                errorsElement.textContent = errors;
            }
            typedText = ''; // Clear the typed text after space
        }
    });

    // Event listeners
    startButton.addEventListener('click', startTest);
    resetButton.addEventListener('click', resetTest);
});
