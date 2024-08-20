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
    let speedOfTyping = 0;


    // Load a new text for typing
    function loadText() {
        const texts = [
            'Two members of the 1984 class of Jefferson High School are chairing a group of 18 to look for a resort for the 20-year class reunion. A lovely place 78 miles from the city turns out to be the best. It has 254 rooms and a banquet hall to seat 378. It has been open 365 days per year since opening on May 30, 1926. They will need 450 to reserve the resort. Debbie Holmes was put in charge of buying 2,847 office machines for the entire firm. Debbie visited more than 109 companies in 35 states in 6 months. She will report to the board today in Room 2784 at 5 p.m. The board will consider her report about those 109 firms and recommend the top 2 or 3 brands to purchase. Debbie must decide before August 16. Lynn Greene said work started on the project March 27, 2003. The 246 blueprints were mailed to the office 18 days ago. The prints had to be 100 percent accurate before they were acceptable. The project should be finished by May 31, 2025. At that time there will be 47 new condominiums, each having at least 16 rooms. The building will be 25 stories.',
            'At first the professor scowled with concern. But then he said, that all right. Run to my house. Tell my wife to give you one of my shirts. "Mrs. Esputa quickly fetched one of her husbands white shirts. But when Philip put it on, she began to exclaim, "Oh, dear! Gracious!" The shirt was so large that Philip was almost lost in it. Hastily Mrs. Esputa found a box of pins. In a twinkling, her nimble fingers pinned enough tucks in the shirt to make it fit Philip. They both heaved a big sigh of relief when the job was finished. Then, free from anxiety, Philip hurried back to the school. The concert finally began, and soon it was time for Philip also. Stood up, placed the violin under his chin, and raised his bow. With horror he felt a pin pulling loose in the back of his shirt. But he recalled how many pins had been inserted in the shirt and thought, "Losing one won matter.' ,
             'Philip started to play. At first his right arm moved back and forth slowly, then more swiftly. Before long the pins that were holding his collar pulled out, The loose, large shirt collar began to creep up the back of Philip head. Then the unruly sleeves grew looser and longer. Suddenly the shirt fell away from his neck. The audience began to laugh. In embarrassed confusion, Philip forgot what he was playing and stopped completely. The disaster so upset him that he rushed off the stage and sulked in a dark corner. Fighting back tears, he mumbled gloomily, "I wish I were dead Refreshments were served after the concert, but Philip was too busy to have any. He mingled with the crowd as quickly as he could, hoping to avoid Mr. Esputa. After a wistful look at the ice cream, Phillip was about to slink out when a booming voice behind him scoffed, "Well, Philip, you made a nice mess of it. " Philip turned and found himself face to face with his glowering teacher. With no sympathy for poor Philip, Mr. Esputa continued unreasonably, "No refreshments for you! You should not have spent the day playing ball. You should have been preparing for the important work of the evening. You ought to be ashamed! MP hung his head, sighed heavily, and trudged home. The incident at Such an impression on him that he always remembered it. He never gain tried to mix work and play.'
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
                alert(`Your time is over! Your Typing Speed is ${speedOfTyping -errors} Words Per Minute`);
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
                console.log(typedText.length);
                // console.log(lastSpan);
                if (lastSpan) {
                    lastSpan.classList.remove('correct', 'incorrect');
                    spans[typedText.length + 1].classList.remove('current');
                    lastSpan.classList.add('current');
                    // lastSpan.classList.remove('current');
                    // Reapply the 'current' class to the current character
                    // spans[typedText.length].classList.add('current');

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
            speedOfTyping++;
        }
    });

    // Event listeners
    startButton.addEventListener('click', startTest);
    resetButton.addEventListener('click', resetTest);
});
