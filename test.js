let currentTest;
let currentQuestionIndex = 0;
let userAnswers = []; // Массив для хранения ответов пользователя

async function loadTest() {
    // Получаем текущий тест из localStorage
    const storedTest = localStorage.getItem('currentTest');
    if (storedTest) {
        currentTest = JSON.parse(storedTest);
    } else {
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
    const navigation = document.getElementById("navigation");
    navigation.style.display = "block"; // Показываем контейнер с кнопками

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

    // Инициализация модального окна
    initModal();
}

function initModal() {
    const finishButton = document.getElementById("finish-button");
    const modal = document.getElementById("modal");
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");

    finishButton.onclick = () => {
        modal.style.display = "flex"; // Показываем модальное окно
    };

    noButton.onclick = () => {
        modal.style.display = "none"; // Скрываем модальное окно
    };

    yesButton.onclick = () => {
        showResults(); // Вызов функции showResults
        modal.style.display = "none"; // Скрываем модальное окно
    };
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

    // Скрываем варианты ответов и навигационные кнопки
    document.getElementById("options-container").innerHTML = ""; // Убираем варианты ответов
    document.getElementById("prev-button").style.display = "none"; // Скрываем кнопку "Назад"
    document.getElementById("next-button").style.display = "none"; // Скрываем кнопку "Вперед"

    // Создаем кнопку для повторного прохождения теста
    const restartButton = document.createElement("button");
    restartButton.textContent = "Пройти тест заново";
    restartButton.onclick = restartTest; // Привязываем функцию к кнопке

    // Очищаем навигацию и добавляем кнопку для повторного прохождения теста
    document.getElementById("navigation").innerHTML = ""; // Очищаем навигацию
    document.getElementById("navigation").appendChild(restartButton); // Добавляем кнопку в навигацию
}


function restartTest() {
    const confirmModal = document.getElementById("confirm-modal");
    confirmModal.style.display = "flex"; // Показываем модальное окно подтверждения
}

function confirmRestart() {
    // Сбрасываем состояние теста
    currentQuestionIndex = 0;
    userAnswers = []; // Очищаем массив ответов
    document.getElementById("options-container").innerHTML = ""; // Убираем варианты ответов
    document.getElementById("navigation").innerHTML = ""; // Очищаем навигацию

    // Создаем кнопки навигации
    const prevButton = document.createElement("button");
    prevButton.id = "prev-button";
    prevButton.innerHTML = "&#9664;"; // Стрелка влево
    prevButton.onclick = () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadTest();
        }
    };
    prevButton.classList.add("nav-button"); // Добавляем класс для стилизации

    const finishButton = document.createElement("button");
    finishButton.id = "finish-button";
    finishButton.textContent = "Завершить тест";
    finishButton.onclick = () => {
        // Логика завершения теста
        alert("Тест завершен!");
    };

    const nextButton = document.createElement("button");
    nextButton.id = "next-button";
    nextButton.innerHTML = "&#9654;"; // Стрелка вправо
    nextButton.onclick = () => {
        if (currentQuestionIndex < currentTest.questions.length - 1) {
            currentQuestionIndex++;
            loadTest();
        }
    };
    nextButton.classList.add("nav-button"); // Добавляем класс для стилизации

    // Добавляем кнопки в навигацию
    const navigationContainer = document.getElementById("navigation");
    navigationContainer.appendChild(prevButton);
    navigationContainer.appendChild(finishButton);
    navigationContainer.appendChild(nextButton);
    navigationContainer.style.display = "flex"; // Показываем кнопки навигации
    navigationContainer.style.justifyContent = "space-between"; // Выравнивание кнопок

    loadTest(); // Загружаем тест заново
    document.getElementById("confirm-modal").style.display = "none"; // Скрываем модальное окно подтверждения
}

function closeConfirmModal() {
    document.getElementById("confirm-modal").style.display = "none"; // Скрываем модальное окно подтверждения
}

// Инициализация модального окна подтверждения
function initConfirmModal() {
    const confirmModal = document.getElementById("confirm-modal");
    const yesButton = document.getElementById("confirm-yes-button");
    const noButton = document.getElementById("confirm-no-button");

    yesButton.onclick = confirmRestart; // Подтверждение перезапуска теста
    noButton.onclick = closeConfirmModal; // Закрытие модального окна
}
document.getElementById("toggle-sidebar").onclick = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden"); // Переключаем класс, чтобы показать/скрыть сайдбар
};
// Загружаем тест при загрузке страницы
window.onload = () => { 
    loadTest();
    initConfirmModal(); // Инициализируем модальное окно подтверждения
};
