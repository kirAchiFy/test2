let currentTest;
let currentQuestionIndex = 0;
let userAnswers = []; // Массив для хранения ответов пользователя

async function loadTest() {
    // Загрузка данных из data.json
    const response = await fetch("data.json");
    const tests = await response.json();

    // Предполагаем, что вы хотите использовать первый тест из массива
    currentTest = tests[0];
    if (!currentTest) {
        alert("Тест не найден!");
        return;
    }

    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");
    const questionList = document.getElementById("question-list");

    questionContainer.innerHTML = "";
    optionsContainer.innerHTML = "";
    questionList.innerHTML = "";

    // Отображаем вопрос
    const question = currentTest.questions[currentQuestionIndex];
    questionContainer.textContent = question.question;

    // Отображаем варианты ответов
    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("option-button");
        button.dataset.id = option.id; // Устанавливаем атрибут id для ответа
        button.dataset.correct = option.id === question.correct; // Устанавливаем атрибут для проверки правильности
        button.onclick = () => handleAnswer(button, question.correct);

        // Если пользователь уже ответил на этот вопрос, показываем его ответ
        if (userAnswers[currentQuestionIndex] === option.id) {
            button.classList.add("selected"); // Подсвечиваем выбранный ответ
        }

        optionsContainer.appendChild(button);
    });

    // Отображаем список вопросов
    currentTest.questions.forEach((_, index) => {
        const questionLink = document.createElement("button");
        questionLink.textContent = `Вопрос ${index + 1}`; // Изменено на "Вопрос X"
        questionLink.onclick = () => {
            currentQuestionIndex = index;
            loadTest();
        };
        questionList.appendChild(questionLink);
    });

    // Обновляем навигацию
    document.getElementById("prev-button").onclick = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadTest();
        }
    };

    document.getElementById("next-button").onclick = () => {
        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            loadTest();
        }
    };

    // Кнопка завершения теста
    const finishButton = document.getElementById("finish-button");
    finishButton.onclick = showResults;

    // Обновляем цвета вопросов в списке
    updateQuestionList();
}

function handleAnswer(selectedButton, correctAnswerId) {
    const buttons = document.querySelectorAll(".option-button");
    
    // Отключаем все кнопки после выбора
    buttons.forEach((button) => {
        button.disabled = true; 
        button.classList.add("faded"); // Применяем эффект поблекания ко всем кнопкам
    });

    // Подсвечиваем выбранный ответ
    if (selectedButton.dataset.correct === "true") {
        selectedButton.classList.add("correct"); // Подсвечиваем правильный ответ
    } else {
        selectedButton.classList.add("incorrect"); // Подсвечиваем неправильный ответ
    }

    // Запоминаем ответ пользователя (сохраняем идентификатор ответа)
    userAnswers[currentQuestionIndex] = selectedButton.dataset.id; // Сохраняем идентификатор выбранного ответа

    // Обновляем цвета вопросов в списке
    updateQuestionList();
}


function showResults() {
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unansweredQuestions = 0;

    currentTest.questions.forEach((question, index) => {
        if (userAnswers[index] !== undefined) {
            if (userAnswers[index] === question.correct) {
                correctAnswers++;
            } else {
                incorrectAnswers++;
            }
        } else {
            unansweredQuestions++;
        }
    });

    // Отображаем результаты
    alert(
        `Результаты теста:\nПравильные ответы: ${correctAnswers}\nНеправильные ответы: ${incorrectAnswers}\nНеотвеченные вопросы: ${unansweredQuestions}`
    );
}

// Загружаем тест при загрузке страницы
window.onload = loadTest;

