// 1. Сначала объявляем базу данных с планом
const PLAN = {
  1: { theme: "Фонетика: звуки /iː/ и /ɪ/ (sheep vs ship). 10 слов: семья.",
       tasks: ["15 мин произношение", "10 слов в Anki", "Составить 5 предложений о себе", "5 мин аудирования"],
       words: [["family","семья"],["mother","мама"],["father","папа"],["sister","сестра"],["brother","брат"],["son","сын"],["daughter","дочь"],["parents","родители"],["child","ребёнок"],["grandmother","бабушка"]] },
  2: { theme: "Present Simple: утверждения. 10 слов: еда.",
       tasks: ["10 мин грамматика", "10 слов", "5 предложений о привычках", "10 мин аудирования"],
       words: [["bread","хлеб"],["milk","молоко"],["meat","мясо"],["fish","рыба"],["apple","яблоко"],["water","вода"],["tea","чай"],["coffee","кофе"],["sugar","сахар"],["salt","соль"]] }
};

// 2. Функция для озвучки
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Ваш браузер не поддерживает озвучку.");
  }
}

// 3. Высчитываем, какой сегодня день
const startDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : new Date();
if (!localStorage.getItem('startDate')) {
  localStorage.setItem('startDate', startDate.toISOString());
}
const dayNum = Math.min(Math.floor((new Date() - startDate) / 86400000) + 1, 365);

// 4. Показываем номер дня и тему
document.getElementById('day-num').textContent = dayNum;
const today = PLAN[dayNum] || { 
  theme: "Повторение пройденного + свободная практика", 
  tasks: ["Повторить слова", "15 мин аудирования", "10 мин говорения"], 
  words: [] 
};
document.getElementById('day-theme').textContent = today.theme;

// 5. Показываем задачи с чекбоксами
const tasksEl = document.getElementById('tasks');
const doneKey = `done-${dayNum}`;
const done = JSON.parse(localStorage.getItem(doneKey) || '[]');

today.tasks.forEach((task, i) => {
  const li = document.createElement('li');
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = done.includes(i);
  cb.onchange = () => {
    let arr = JSON.parse(localStorage.getItem(doneKey) || '[]');
    if (cb.checked) arr.push(i); else arr = arr.filter(x => x !== i);
    localStorage.setItem(doneKey, JSON.stringify(arr));
  };
  li.appendChild(cb);
  li.appendChild(document.createTextNode(task));
  tasksEl.appendChild(li);
});

// 6. Показываем слова с кнопкой озвучки
const wordsEl = document.getElementById('words');
today.words.forEach(([en, ru]) => {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.textContent = '🔊';
  btn.className = 'speak-btn';
  btn.onclick = () => speak(en);
  
  const span = document.createElement('span');
  span.innerHTML = `<span class="word-en">${en}</span> — <span class="word-ru">${ru}</span>`;
  
  li.appendChild(btn);
  li.appendChild(span);
  wordsEl.appendChild(li);
});

// 7. Стрик (дни подряд)
const lastVisit = localStorage.getItem('lastVisit');
const streak = parseInt(localStorage.getItem('streak') || '0');
const todayStr = new Date().toDateString();
let newStreak = streak;
if (lastVisit !== todayStr) {
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  newStreak = lastVisit === yesterday ? streak + 1 : 1;
  localStorage.setItem('streak', newStreak);
  localStorage.setItem('lastVisit', todayStr);
}
document.getElementById('streak').textContent = `🔥 ${newStreak} дней подряд`;

// 8. Таймер
let timeLeft = 30 * 60;
let timerId = null;
const timerEl = document.getElementById('timer');
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
timerEl.textContent = fmt(timeLeft);

document.getElementById('start-timer').onclick = () => {
  if (timerId) return;
  timerId = setInterval(() => {
    if (timeLeft <= 0) { clearInterval(timerId); timerId = null; alert('Время вышло! Молодец.'); return; }
    timeLeft--;
    timerEl.textContent = fmt(timeLeft);
  }, 1000);
}

document.getElementById('reset-timer').onclick = () => {
  clearInterval(timerId); timerId = null; timeLeft = 30 * 60; timerEl.textContent = fmt(timeLeft);
};;
