document.addEventListener('DOMContentLoaded', (event) => {
    const draggableListItems = document.querySelectorAll('.draggable-list li');
    const endMessage = document.getElementById('endMessage');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const timer = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score-value');
    const leftList = document.querySelector('.draggable-list:first-child');
    const rightList = document.querySelector('.draggable-list:last-child');
    const body = document.querySelector('.body');
    const leftSide = document.querySelector('.leftSide');
    const rightSide = document.querySelector('.rightSide');
    let selectedId;
    let dropTargetId;
    let matchingCounter = 0;
    let timeLeft = 120;
    let countdown;
    let score = 0;

    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Shuffle the list items
    const rightListItems = Array.from(rightList.children);
    shuffle(rightListItems).forEach(item => rightList.appendChild(item));

    function startCountdown() {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(countdown);
                gameOver();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        timer.innerHTML = `
            <div class="timer-bar" style="width: ${(timeLeft / 60) * 100}%;"></div>
            <span>Time left: ${timeLeft}s</span>
        `;
    }

    function gameOver() {
        body.style.display = 'none';
        leftSide.style.display = 'none';
        rightSide.style.display = 'none';
        gameOverMessage.style.display = 'block';
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
        if (points < 0) {
            scoreDisplay.classList.add('deduct');
            setTimeout(() => {
                scoreDisplay.classList.remove('deduct');
            }, 1000);
        }
    }

    window.playAgain = function() {
        matchingCounter = 0;
        score = 0;
        timeLeft = 120;
        updateTimerDisplay();
        scoreDisplay.textContent = '0';
        gameOverMessage.style.display = 'none';
        endMessage.style.display = 'none';
        body.style.display = 'flex';
        leftSide.style.display = 'block';
        rightSide.style.display = 'block';
        draggableListItems.forEach(item => {
            item.style.display = 'block';
            item.classList.remove('matched');
        });
        startCountdown();
        
        // Shuffle the list items again
        const rightListItems = Array.from(rightList.children);
        shuffle(rightListItems).forEach(item => rightList.appendChild(item));

        addEventListeners();
    }

    function dragStart() {
        selectedId = this.id;
        this.classList.add('dragging');
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragEnter() {
        this.classList.add('over');
    }

    function dragLeave() {
        this.classList.remove('over');
    }

    function dragOver(ev) {
        ev.preventDefault();
    }

    function dragDrop() {
        dropTargetId = this.id;

        // Check if the drag started and ended on the same element
        if (selectedId === dropTargetId) {
            this.classList.remove('over');
            return; // Exit the function without any action
        }

        if (checkForMatch(selectedId, dropTargetId)) {
            document.getElementById(selectedId).classList.add('matched');
            document.getElementById(dropTargetId).classList.add('matched');
            matchingCounter++;
            updateScore(10);
            showMatchFeedback(true);
        } else {
            updateScore(-5);
            showMatchFeedback(false);
        }

        if (matchingCounter === 9) {
            clearInterval(countdown);
            gameCompleted();
        }

        this.classList.remove('over');
    }

    function showMatchFeedback(isCorrect) {
        const feedback = document.createElement('div');
        feedback.className = `match-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect';
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 1000);
    }

    function gameCompleted() {
        endMessage.style.display = 'block';
        
        leftSide.style.display = 'none';
        rightSide.style.display = 'none';
        body.style.display = 'none';
    }

    function checkForMatch(selected, dropTarget) {
        return selected[1] === dropTarget[1];
    }

    function addEventListeners() {
        draggableListItems.forEach(item => {
            item.addEventListener('dragstart', dragStart);
            item.addEventListener('dragend', dragEnd);
            item.addEventListener('dragenter', dragEnter);
            item.addEventListener('dragover', dragOver);
            item.addEventListener('dragleave', dragLeave);
            item.addEventListener('drop', dragDrop);
        });
    }

    // Initialize the game
    updateTimerDisplay();
    addEventListeners();
    startCountdown();
});
