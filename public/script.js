let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let username = "";
let questions = [];
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

const nameEntry = document.getElementById('name-entry');
const startQuizButton = document.getElementById('start-quiz');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');
const resultContainer = document.getElementById('result-container');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard-list');
const playAgainButton = document.getElementById('play-again');

startQuizButton.addEventListener('click', () => {
    username = document.getElementById('username').value;
    if (username.trim() !== "") {
        nameEntry.style.display = 'none';
        quizContainer.style.display = 'block';
        fetchQuestions().then(data => {
            questions = data;
            displayQuestion(questions[currentQuestionIndex]);
        });
    } else {
        alert("Please enter your name.");
    }
});

async function fetchQuestions() {
    const response = await fetch('/questions');
    const questions = await response.json();
    return questions;
}

function displayQuestion(question) {
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(option, question.answer, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selected, correctAnswer, button) {
    if (selected === correctAnswer) {
        score++;
        scoreElement.textContent = Score: ${score};
        button.classList.add("correct");
    } else {
        button.classList.add("incorrect");
    }
    nextButton.disabled = false;
    selectedOption = selected;
    optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
        nextButton.disabled = true;
        selectedOption = null;
        optionsContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove("correct", "incorrect");
        });
    } else {
        showResult();
    }
});

function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    finalScoreElement.textContent = Your final score is ${score} out of ${questions.length};
    nextButton.style.display = "none";
    

    leaderboard.push({ name: username, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    displayLeaderboard();
}

function displayLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = ${entry.name}: ${entry.score};
        leaderboardList.appendChild(li);
    });

    resultContainer.style.display = 'none';
    leaderboardContainer.style.display = 'block';
}

playAgainButton.addEventListener('click', () => {
    leaderboardContainer.style.display = 'none';
    nameEntry.style.display = 'block';
    document.getElementById('username').value = "";
    
    
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = Score: ${score};
    nextButton.style.display = "block";
    fetchQuestions().then(data => {
        questions = data;
        displayQuestion(questions[currentQuestionIndex]);
        nextButton.disabled = true;
    });
});

restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = Score: ${score};
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    nextButton.style.display = "block";
    fetchQuestions().then(data => {
        questions = data;
        displayQuestion(questions[currentQuestionIndex]);
        nextButton.disabled = true;
    });
});

fetchQuestions().then(data => {
    questions = data;
    displayQuestion(questions[currentQuestionIndex]);
});
