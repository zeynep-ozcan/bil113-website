let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedOption = null;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error('Sorular yüklenirken hata oluştu:', error);
        document.getElementById('questionContainer').innerHTML = 
            '<p style="color: red;">Sorular yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>';
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    selectedOption = null;

    document.getElementById('questionNumber').textContent = 
        `Soru ${currentQuestionIndex + 1} / ${questions.length}`;
    document.getElementById('questionText').textContent = question.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-option';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => selectOption(index, button);
        optionsContainer.appendChild(button);
    });

    if (userAnswers[currentQuestionIndex] !== undefined) {
        const prevAnswer = userAnswers[currentQuestionIndex];
        const buttons = optionsContainer.querySelectorAll('.btn-option');
        if (buttons[prevAnswer]) {
            buttons[prevAnswer].classList.add('selected');
            selectedOption = prevAnswer;
        }
    }

    updateButtons();
}

function updateButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const finishButton = document.getElementById('finishButton');

    if (currentQuestionIndex === 0) {
        prevButton.disabled = true;
        prevButton.style.opacity = '0.5';
        prevButton.style.cursor = 'not-allowed';
    } else {
        prevButton.disabled = false;
        prevButton.style.opacity = '1';
        prevButton.style.cursor = 'pointer';
    }

    const hasAnswer = selectedOption !== null || userAnswers[currentQuestionIndex] !== undefined;

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.classList.add('hidden');
        finishButton.classList.remove('hidden');
        finishButton.disabled = !hasAnswer;
        if (hasAnswer) {
            finishButton.style.opacity = '1';
            finishButton.style.cursor = 'pointer';
        } else {
            finishButton.style.opacity = '0.5';
            finishButton.style.cursor = 'not-allowed';
        }
    } else {
        nextButton.classList.remove('hidden');
        finishButton.classList.add('hidden');
        nextButton.disabled = !hasAnswer;
        if (hasAnswer) {
            nextButton.style.opacity = '1';
            nextButton.style.cursor = 'pointer';
        } else {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
        }
    }
}

function selectOption(index, buttonElement) {
    const buttons = document.querySelectorAll('.btn-option');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
    });

    buttonElement.classList.add('selected');
    selectedOption = index;
    userAnswers[currentQuestionIndex] = index;
    
    updateButtons();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        if (selectedOption !== null) {
            userAnswers[currentQuestionIndex] = selectedOption;
        }
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (selectedOption === null && userAnswers[currentQuestionIndex] === undefined) {
        return;
    }

    if (selectedOption !== null) {
        userAnswers[currentQuestionIndex] = selectedOption;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function finishQuiz() {
    if (selectedOption === null && userAnswers[currentQuestionIndex] === undefined) {
        return;
    }

    if (selectedOption !== null) {
        userAnswers[currentQuestionIndex] = selectedOption;
    }

    let score = 0;
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            score++;
        }
    });

    const results = {
        score: score,
        total: questions.length,
        answers: userAnswers,
        questions: questions
    };

    localStorage.setItem('quizResults', JSON.stringify(results));
    window.location.href = 'results.html';
}

window.addEventListener('DOMContentLoaded', loadQuestions);

