document.addEventListener('DOMContentLoaded', (event) => {
    const draggableListItems = document.querySelectorAll('.draggable-list li');
    const endMessage = document.getElementById('endMessage');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const timer = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score-value');
    const rightList = document.querySelector('.draggable-list:last-child');
    let selectedId;
    let dropTargetId;
    let matchingCounter = 0;
    let timeLeft = 60;
    let countdown;
    let score = 0;

    // Shuffle the list items
    for (let i = rightList.children.length; i >= 0; i--) {
        rightList.appendChild(rightList.children[Math.random() * i | 0]);
    }

    addEventListeners();
    startCountdown();

    function startCountdown() {
        clearInterval(countdown);
        countdown = setInterval(() => {
            timeLeft--;
            timer.innerText = `Time left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                gameOver();
            }
        }, 1000);
    }

    function gameOver() {
        document.querySelector('.body').style.display = 'none';
        gameOverMessage.style.display = 'block';
    }

    window.playAgain = function() {
        matchingCounter = 0;
        score = 0;
        timeLeft = 60;
        timer.innerText = `Time left: ${timeLeft}s`;
        scoreDisplay.innerText = `0`;
        gameOverMessage.style.display = 'none';
        endMessage.style.display = 'none';
        document.querySelector('.body').style.display = 'flex';
        draggableListItems.forEach(item => {
            document.getElementById(item.id).style.display = 'block';
        });
        startCountdown();
        addEventListeners();
        
        // Shuffle the list items again
        for (let i = rightList.children.length; i >= 0; i--) {
            rightList.appendChild(rightList.children[Math.random() * i | 0]);
        }

        document.querySelector('.leftSide').style.display = 'block';
        document.querySelector('.rightSide').style.display = 'block';
        document.querySelector('.body').style.display = 'flex';
    }

    function dragStart() {
        selectedId = this.id;
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

        if (checkForMatch(selectedId, dropTargetId)) {
            document.getElementById(selectedId).style.display = 'none';
            document.getElementById(dropTargetId).style.display = 'none';
            matchingCounter++;
            updateScore(10);
        } else if (checkForMatch2(selectedId, dropTargetId)) {
            document.getElementById(selectedId).style.display = 'none';
            document.getElementById(dropTargetId).style.display = 'none';
            matchingCounter++;
            updateScore(10);
        } else {
            updateScore(-5);
        }

        if (matchingCounter === 9) {
            clearInterval(countdown);
            gameCompleted();
        }

        this.classList.remove('over');
    }

    function gameCompleted() {
        endMessage.style.display = 'block';
        const completedVideo = document.getElementById('completedVideo');
        completedVideo.play();
        
        document.querySelector('.leftSide').style.display = 'none';
        document.querySelector('.rightSide').style.display = 'none';
        document.querySelector('.body').style.display = 'none';
    }

    function checkForMatch(selected, dropTarget) {
        switch (selected) {
            case 'e1':
                return dropTarget === 's1' ? true : false;
            case 'e2':
                return dropTarget === 's2' ? true : false;
            case 'e3':
                return dropTarget === 's3' ? true : false;
            case 'e4':
                return dropTarget === 's4' ? true : false;
            case 'e5':
                return dropTarget === 's5' ? true : false;
            case 'e6':
                return dropTarget === 's6' ? true : false;
            case 'e7':
                return dropTarget === 's7' ? true : false;
            case 'e8':
                return dropTarget === 's8' ? true : false;
            case 'e9':
                return dropTarget === 's9' ? true : false;
            default:
                return false;
        }
    }

    function checkForMatch2(selected, dropTarget) {
        switch (selected) {
            case 's1':
                return dropTarget === 'e1' ? true : false;
            case 's2':
                return dropTarget === 'e2' ? true : false;
            case 's3':
                return dropTarget === 'e3' ? true : false;
            case 's4':
                return dropTarget === 'e4' ? true : false;
            case 's5':
                return dropTarget === 'e5' ? true : false;
            case 's6':
                return dropTarget === 'e6' ? true : false;
            case 's7':
                return dropTarget === 'e7' ? true : false;
            case 's8':
                return dropTarget === 'e8' ? true : false;
            case 's9':
                return dropTarget === 'e9' ? true : false;
            default:
                return false;
        }
    }

    function addEventListeners() {
        draggableListItems.forEach(item => {
            item.addEventListener('dragstart', dragStart);
            item.addEventListener('dragenter', dragEnter);
            item.addEventListener('drop', dragDrop);
            item.addEventListener('dragover', dragOver);
            item.addEventListener('dragleave', dragLeave);
        });
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = `${score}`;

        if (points < 0) {
            scoreDisplay.classList.add('deduct');
            setTimeout(() => {
                scoreDisplay.classList.remove('deduct');
            }, 1000);
        }
    }
});
