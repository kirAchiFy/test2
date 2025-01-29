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

            // Заголовок теста
            const testTitle = document.createElement('h3');
            testTitle.textContent = test.title;
            testTitle.classList.add('test-item');
            testTitle.onclick = () => {
                localStorage.setItem('currentTest', JSON.stringify(test)); // Сохраняем текущий тест в localStorage
                window.location.href = 'test.html'; // Переход на страницу теста
            };

            // Кнопка удаления
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️'; // Иконка мусорного ведра
            deleteButton.classList.add('delete-button');
            deleteButton.disabled = index < tests.length; // Делаем кнопку неактивной для первых трех тестов
            deleteButton.onclick = () => {
                deleteTest(test.id); // Функция для удаления теста
            };

            testItem.appendChild(testTitle); // Добавляем заголовок к div для теста
            testItem.appendChild(deleteButton); // Добавляем кнопку удаления к div для теста
            testList.appendChild(testItem); // Добавляем div в контейнер с тестами
        });
    } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
    }
}

// Функция для удаления теста
function deleteTest(testId) {
    const updatedTests = JSON.parse(localStorage.getItem('tests')) || [];
    const newTests = updatedTests.filter(test => test.id !== testId); // Фильтрация тестов

    localStorage.setItem('tests', JSON.stringify(newTests)); // Сохраняем обновленный массив в localStorage
    loadTests(); // Обновляем отображение тестов
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
window.onclick = function (event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        closeModal();
    }
};

// Функция для добавления вопроса
function addQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');

    // Создаем новый вопрос
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');

    // Генерируем HTML для нового вопроса
    newQuestion.innerHTML = `
        <h3>Вопрос ${questionsContainer.children.length + 1}</h3>
        <input type="text" placeholder="Введите текст вопроса" />
        <div class="answer-options">
            ${generateAnswerOptions(questionsContainer.children.length + 1)}
        </div>
    `;

    // Добавляем новый вопрос в контейнер
    questionsContainer.appendChild(newQuestion);
    updateRemoveButtonState(); // Обновляем состояние кнопки удаления
}

// Функция для удаления вопроса
function removeQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');
    if (questionsContainer.children.length > 1) {
        questionsContainer.removeChild(questionsContainer.lastChild); // Удаляем последний вопрос
    }
    updateRemoveButtonState(); // Обновляем состояние кнопки удаления
}

// Функция для обновления состояния кнопки удаления
function updateRemoveButtonState() {
    const questionsContainer = document.getElementById('questionsContainer');
    const removeButton = document.getElementById('removeQuestionButton');
    removeButton.disabled = questionsContainer.children.length <= 1; // Деактивируем кнопку, если один или меньше вопросов
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
                id: `id${index + 1}`,
                text: optionText
            };
        });
        const correctOptionId = options.length > 0 ? options[0].id : null;

        questions.push({
            id: `id${questions.length + 1}`,
            question: questionText,
            correct: correctOptionId,
            options: options
        });
    }

    const test = {
        id: `id${Date.now()}`,
        title: testTitle,
        questions: questions
    };

    // Сохраняем тест в Local Storage
    const savedTests = JSON.parse(localStorage.getItem('tests')) || [];
    savedTests.push(test);
    localStorage.setItem('tests', JSON.stringify(savedTests));

    loadTests(); // Обновляем список тестов на главном экране
    closeModal(); // Закрываем модальное окно после сохранения
}

// Обработчик события для кнопки "Сохранить тест"
document.getElementById('saveTestButton').onclick = saveTest;

// Обработчик для выбора отображения правильных ответов
function initModalChoices() {
    const choiceModal = document.getElementById("choice-modal");
    const yesButton = document.getElementById("yes-answer-button");
    const noButton = document.getElementById("no-answer-button");

    choiceModal.style.display = "flex";

    yesButton.onclick = () => {
        localStorage.setItem('showCorrectAnswers', 'true');
        window.location.href = 'test.html'; // Переход на страницу теста
    };

    noButton.onclick = () => {
        localStorage.setItem('showCorrectAnswers', 'false');
        window.location.href = 'test.html'; // Переход на страницу теста
    };
}

// Функция для переключения состояния сайдбара
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');

    // Проверяем текущее состояние сайдбара по его свойству display
    const isVisible = sidebar.style.display === 'block';

    if (isVisible) {
        // Если сайдбар виден, скрываем его
        sidebar.style.display = 'none';
    } else {
        // Если сайдбар скрыт, показываем его
        sidebar.style.display = 'block';

        // Вычисляем положение кнопки
        const buttonRect = toggleButton.getBoundingClientRect();

        // Устанавливаем положение сайдбара
        const sidebarOffset = -35; // Настройка смещения влево
        sidebar.style.left = (buttonRect.left - sidebar.offsetWidth - sidebarOffset) + "px"; // Сдвигаем сайдбар влево
        sidebar.style.top = (buttonRect.bottom + 10) + "px"; // Сдвигаем сайдбар ниже кнопки
    }
}

// Привязываем событие click к кнопке гамбургера
document.getElementById('toggle-sidebar').onclick = toggleSidebar;
// Вызов функции loadTests при загрузке страницы
window.onload = function () {
    loadTests();
    updateRemoveButtonState(); // Поддержка начального состояния для кнопки удаления
};
