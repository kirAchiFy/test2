// Функция для загрузки данных из data.json
async function loadTests() {
    try {
        const response = await fetch('data.json'); // Загружаем файл data.json
        const tests = await response.json(); // Преобразуем ответ в JSON

        const savedTests = JSON.parse(localStorage.getItem('tests')) || []; // Загружаем сохраненные тесты
        const allTests = [...tests, ...savedTests]; // Объединяем тесты из data.json и localStorage

        const testList = document.getElementById('test-list'); // Получаем контейнер для тестов
        testList.innerHTML = ''; // Очищаем контейнер

        // Проходим по каждому тесту и добавляем его в контейнер
        allTests.forEach((test, index) => {
            const testItem = document.createElement('div'); // Создаем новый элемент div для теста
            testItem.classList.add('test-item-container'); // Добавляем класс для стилизации контейнера

            const testTitle = document.createElement('h3'); // Создаем новый элемент h3 для заголовка теста
            testTitle.textContent = test.title; // Устанавливаем текст элемента
            testTitle.classList.add('test-item'); // Добавляем класс для стилизации заголовка
            testTitle.onclick = () => {
                // Сохраняем текущий тест в localStorage и открываем модальное окно
                localStorage.setItem('currentTest', JSON.stringify(test));
                document.getElementById('choice-modal').style.display = 'flex'; // Открываем модальное окно выбора
            };

            // Создаем кнопку удаления
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️'; // Иконка мусорного ведра
            deleteButton.classList.add('delete-button'); // Добавляем класс для стилизации кнопки
            deleteButton.disabled = index < 3; // Делаем кнопку неактивной для первых трех тестов
            deleteButton.onclick = () => {
                // Удаляем тест из локального хранилища
                const updatedTests = JSON.parse(localStorage.getItem('tests')) || [];
                updatedTests.splice(index - tests.length, 1); // Удаляем тест из массива
                localStorage.setItem('tests', JSON.stringify(updatedTests)); // Сохраняем обновленный массив в локальное хранилище
                displayTests(); // Обновляем отображение тестов
            };

            // Добавляем заголовок и кнопку удаления в контейнер
            testItem.appendChild(testTitle);
            testItem.appendChild(deleteButton);
            testList.appendChild(testItem); // Добавляем контейнер в список тестов
        });
    } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
    }
}

// Функция для открытия модального окна
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Обработчик события для кнопки "плюс"
document.getElementById('add-test-button').onclick = openModal;

// Обработчик события для закрытия модального окна
document.getElementById('closeModal').onclick = closeModal;

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Функция для добавления вопроса
function addQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');
    const questionCount = questionsContainer.children.length;

    // Создаем новый вопрос
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');

    // Генерируем HTML для нового вопроса
    newQuestion.innerHTML = `
        <h3>Вопрос ${questionCount + 1}</h3>
        <input type="text" placeholder="Введите текст вопроса" />
        <div class="answer-options">
            ${generateAnswerOptions(questionCount + 1)}
        </div>
    `;

    // Добавляем новый вопрос в контейнер
    questionsContainer.appendChild(newQuestion);
    updateRemoveButtonState();
}

// Функция для удаления вопроса
function removeQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');
    if (questionsContainer.children.length > 1) {
        questionsContainer.removeChild(questionsContainer.lastChild);
    }
    updateRemoveButtonState();
}

// Функция для обновления состояния кнопки удаления
function updateRemoveButtonState() {
    const questionsContainer = document.getElementById('questionsContainer');
    const removeButton = document.getElementById('removeQuestionButton');
    removeButton.disabled = questionsContainer.children.length <= 1;
}

// Функция для генерации вариантов ответов
function generateAnswerOptions(questionIndex) {
    let optionsHTML = '';
    for (let i = 1; i <= 4; i++) {
        optionsHTML += `
            <div class="answer-option">
                <input type="radio" name="correctAnswer${questionIndex}" id="answer${questionIndex}_${i}" />
                <input type="text" placeholder="Вариант ${i}" />
            </div>
        `;
    }
    return optionsHTML;
}

// Функция для сохранения теста
function saveTest() {
    const testTitle = document.getElementById('testTitle').value;
    const questionsContainer = document.getElementById('questionsContainer');
    const questions = [];

    for (let question of questionsContainer.children) {
        const questionText = question.querySelector('input[type="text"]').value;
        const options = Array.from(question.querySelectorAll('.answer-option')).map((option, index) => {
            const optionText = option.querySelector('input[type="text"]').value;
            return {
                id: `id${index + 1}`, // Генерация уникального ID для каждого варианта
                text: optionText
            };
        });

        // Предположим, что правильный ответ - это первый вариант (можно изменить логику)
        const correctOptionId = options.length > 0 ? options[0].id : null;

        questions.push({
            id: `id${questions.length + 1}`, // Генерация уникального ID для вопроса
            question: questionText,
            correct: correctOptionId,
            options: options
        });
    }

    const test = {
        id: `id${Date.now()}`, // Генерация уникального ID для теста
        title: testTitle,
        questions: questions
    };

    // Сохраняем тест в Local Storage
    const savedTests = JSON.parse(localStorage.getItem('tests')) || [];
    savedTests.push(test);
    localStorage.setItem('tests', JSON.stringify(savedTests));

    // Обновляем список тестов на главном экране
    displayTests();
    closeModal(); // Закрываем модальное окно после сохранения
}

// Функция для отображения тестов
async function displayTests() {
    const testList = document.getElementById('test-list');
    testList.innerHTML = ''; // Очищаем текущий список тестов

    // Загружаем тесты из data.json и localStorage
    await loadTests();
}


// Обработчик события для кнопки "Сохранить тест"
document.getElementById('saveTestButton').onclick = saveTest;
document.getElementById('closeModal').onclick = closeModal;

// Обработчики для выбора отображения правильных ответов
document.getElementById('yes-answer-button').onclick = () => {
    const currentTest = JSON.parse(localStorage.getItem('currentTest'));
    localStorage.setItem('showCorrectAnswers', 'true');
    // Здесь можно добавить логику для перехода к тесту
    window.location.href = 'test.html'; // Переход на страницу теста
};

document.getElementById('no-answer-button').onclick = () => {
    const currentTest = JSON.parse(localStorage.getItem('currentTest'));
    localStorage.setItem('showCorrectAnswers', 'false');
    // Здесь можно добавить логику для перехода к тесту
    window.location.href = 'test.html'; // Переход на страницу теста
};
function initModalChoices() {
    const choiceModal = document.getElementById("choice-modal");
    const yesButton = document.getElementById("yes-answer-button");
    const noButton = document.getElementById("no-answer-button");

    // Открытие модального окна при загрузке теста
    choiceModal.style.display = "flex";

    yesButton.onclick = () => {
        showCorrectAnswersImmediately = true;
        choiceModal.style.display = "none"; // Закрытие модального окна
        loadTest(); // Загружаем тест после выбора
    };

    noButton.onclick = () => {
        showCorrectAnswersImmediately = false; 
        choiceModal.style.display = "none"; // Закрытие модального окна
        loadTest(); // Загружаем тест после выбора
    };
}

// Вызываем loadTests при загрузке страницы
window.onload = loadTests;
