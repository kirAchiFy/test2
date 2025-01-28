let currentTest;
let currentQuestionIndex = 0;
let userAnswers = [];
let showCorrectAnswersImmediately = false;

async function loadTest() {
    const storedTest = localStorage.getItem('currentTest');
    if (!storedTest) {
        alert("Тест не найден!");
        return;
    }
    currentTest = JSON.parse(storedTest);

    renderQuestion();

    // Инициализация модального окна выбора правильных ответов только при первой загрузке
    if (userAnswers.length === 0) {
        initModalChoices();
    }
}

function renderQuestion() {
    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");
    const questionList = document.getElementById("question-list");

    questionContainer.innerHTML = "";
    optionsContainer.innerHTML = "";
    questionList.innerHTML = "";

    const question = currentTest.questions[currentQuestionIndex];
    questionContainer.textContent = question.question;

    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("option-button");
        button.dataset.id = option.id;
        button.dataset.correct = option.id === question.correct;
        button.onclick = () => handleAnswer(button, question.correct);
        if (userAnswers[currentQuestionIndex] === option.id) {
            button.classList.add("selected");
        }
        optionsContainer.appendChild(button);
    });

    currentTest.questions.forEach((_, index) => {
        const questionLink = document.createElement("button");
        questionLink.textContent = `Вопрос ${index + 1}`;
        questionLink.onclick = () => {
            currentQuestionIndex = index;
            renderQuestion();
        };
        questionList.appendChild(questionLink);
    });

    updateNavigation();
}

function updateNavigation() {
    const navigationContainer = document.getElementById("navigation");
    navigationContainer.innerHTML = ""; // Очистка предыдущих навигационных кнопок

    const prevButton = document.createElement("button");
    prevButton.textContent = "←";
    prevButton.onclick = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    };

    const finishButton = document.createElement("button");
    finishButton.textContent = "Завершить тест";
    finishButton.onclick = () => {
        const modal = document.getElementById("modal");
        modal.style.display = "flex";
    };

    const nextButton = document.createElement("button");
    nextButton.textContent = "→";
    nextButton.onclick = () => {
        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        }
    };

    navigationContainer.appendChild(prevButton);
    navigationContainer.appendChild(finishButton);
    navigationContainer.appendChild(nextButton);
    navigationContainer.style.display = "block"; // showing the navigation
}

function initModalChoices() {
    const choiceModal = document.getElementById("choice-modal");
    const yesButton = document.getElementById("yes-answer-button");
    const noButton = document.getElementById("no-answer-button");

    choiceModal.style.display = "flex";

    yesButton.onclick = () => {
        showCorrectAnswersImmediately = true;
        choiceModal.style.display = "none";
        renderQuestion(); // Рендер вопроса после выбора
    };

    noButton.onclick = () => {
        showCorrectAnswersImmediately = false;
        choiceModal.style.display = "none";
        renderQuestion(); // Рендер вопроса после выбора
    };
}

function handleAnswer(selectedButton, correctAnswerId) {
    const buttons = document.querySelectorAll(".option-button");
    
    buttons.forEach((button) => {
        button.disabled = true;
        button.classList.add("faded");
    });

    selectedButton.classList.add("selected");
    selectedButton.classList.add(selectedButton.dataset.correct === "true" ? "correct" : "incorrect");

    userAnswers[currentQuestionIndex] = selectedButton.dataset.id;

    if (showCorrectAnswersImmediately) {
        buttons.forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            } else {
                button.classList.add("incorrect");
            }
        });
    }
}

function showResults() {
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let unansweredCount = 0;

    currentTest.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct) {
            correctAnswersCount++;
        } else if (userAnswers[index] !== undefined) {
            incorrectAnswersCount++;
        } else {
            unansweredCount++; // Увеличиваем счетчик на неотвеченные вопросы
        }
    });

    alert(`Результаты теста:\nПравильные ответы: ${correctAnswersCount}\nНеправильные ответы: ${incorrectAnswersCount}\nНеотвеченные вопросы: ${unansweredCount}`);
    clearTest();
}

function clearTest() {
    document.getElementById("options-container").innerHTML = "";
    document.getElementById("navigation").innerHTML = "";
    
    const restartButton = document.createElement("button");
    restartButton.textContent = "Пройти тест заново";
    restartButton.onclick = restartTest;

    document.getElementById("navigation").appendChild(restartButton);
}

function restartTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    renderQuestion();
}

function initModal() {
    const modal = document.getElementById("modal");
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");

    yesButton.onclick = () => {
        showResults();
        modal.style.display = "none";
    };

    noButton.onclick = () => {
        modal.style.display = "none";
    };
}

// События на кнопки
document.getElementById("toggle-sidebar").onclick = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden");
};

// Загружаем тест при загрузке страницы
window.onload = () => { 
    loadTest();
    initModal();
    initConfirmModal(); // Включите это, если у вас есть подтверждение для перезапуска теста
};
