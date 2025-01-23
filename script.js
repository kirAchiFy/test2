// Функция для загрузки данных из data.json
async function loadTests() {
    try {
        const response = await fetch('data.json'); // Загружаем файл data.json
        const tests = await response.json(); // Преобразуем ответ в JSON

        const testList = document.getElementById('test-list'); // Получаем контейнер для тестов
        testList.innerHTML = ''; // Очищаем контейнер

        // Проходим по каждому тесту и добавляем его в контейнер
        tests.forEach(test => {
            const testItem = document.createElement('h3'); // Создаем новый элемент h3
            testItem.textContent = test.title; // Устанавливаем текст элемента
            testItem.classList.add('test-item'); // Добавляем класс для стилизации (при необходимости)
            testList.appendChild(testItem); // Добавляем элемент в контейнер
        });
    } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
    }
}

// Загружаем тесты при загрузке страницы
async function loadTests() {
    try {
        const response = await fetch('data.json');
        const tests = await response.json();

        const testList = document.getElementById('test-list');
        testList.innerHTML = '';

        tests.forEach((test) => {
            const testItem = document.createElement('h3');
            testItem.textContent = test.title;
            testItem.classList.add('test-item');
            testItem.onclick = () => {
                // Переход на страницу теста
                localStorage.setItem('currentTest', JSON.stringify(test));
                window.location.href = 'test.html';
            };
            testList.appendChild(testItem);
        });
    } catch (error) {
        console.error('Ошибка при загрузке тестов:', error);
    }
}

window.onload = loadTests;
