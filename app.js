// 1. БАЗА ДАННЫХ
const PLAN = {
  1: { theme: "Фонетика: звуки /iː/ и /ɪ/ (sheep vs ship).",
       tasks: ["15 мин произношение", "10 слов в Anki", "Составить 5 предложений"],
       words: [["family","семья"],["mother","мама"],["father","папа"],["sister","сестра"],["brother","брат"]] },
  2: { theme: "Present Simple: утверждения.",
       tasks: ["10 мин грамматика", "10 слов", "5 предложений о привычках"],
       words: [["bread","хлеб"],["milk","молоко"],["meat","мясо"],["fish","рыба"],["apple","яблоко"]] }
};

// 2. ФУНКЦИЯ ОЗВУЧКИ
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

// 3. НАВИГАЦИЯ (Переключение экранов)
function goToScreen(screenId) {
  // Скрываем все экраны
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Показываем нужный
  document.getElementById(screenId).classList.add('active');
}

// 4. ЛОГИКА ДНЯ И ЗАПОЛНЕНИЕ ДАННЫХ
const startDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : new Date();
if (!localStorage.getItem('startDate')) localStorage.setItem('startDate', startDate.toISOString());
const dayNum = Math.min(Math.floor((new Date() - startDate) / 86400000) + 1, 365);

// Обновляем все цифры дней на экранах
document.getElementById('day-num').textContent = dayNum;
document.getElementById('day-num-2').textContent = dayNum;
document.getElementById('day-num-3').textContent = dayNum;

const today = PLAN[dayNum] || { theme: "Повторение", tasks: ["Повторить слова", "Аудирование"], words: [] };
document.getElementById('day-theme').textContent = today.theme;

// Заполняем задачи
const tasksEl = document.getElementById('tasks');
today.tasks.forEach(task => {
  const li = document.createElement('li');
  li.innerHTML = `• ${task}`;
  tasksEl.appendChild(li);
});

// Заполняем слова дня (с кнопками)
const wordsEl = document.getElementById('words');
today.words.forEach(([en, ru]) => {
  const li = document.createElement('li');
  li.innerHTML = `
    <button class="speak-btn" onclick="speak('${en}')">🔊</button>
    <span>${en}</span> — <span style="font-weight:400">${ru}</span>
  `;
  wordsEl.appendChild(li);
});

// Заполняем экран повторения (все слова из плана)
const allWordsEl = document.getElementById('all-words');
Object.values(PLAN).forEach(day => {
  day.words.forEach(([en, ru]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="speak-btn" onclick="speak('${en}')">🔊</button>
      <span>${en}</span> — <span style="font-weight:400">${ru}</span>
    `;
    allWordsEl.appendChild(li);
  });
});
