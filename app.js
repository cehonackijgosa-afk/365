// Функция для озвучки слов
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Американский английский
    utterance.rate = 0.9;     // Скорость чуть медленнее обычной (для обучения)
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Ваш браузер не поддерживает озвучку.");
  }
}

// ... (здесь ваш массив PLAN, оставляем его без изменений) ...

// ---------- СЛОВА ----------
const wordsEl = document.getElementById('words');
today.words.forEach(([en, ru]) => {
  const li = document.createElement('li');
  
  // Создаем кнопку динамика
  const btn = document.createElement('button');
  btn.textContent = '🔊';
  btn.className = 'speak-btn';
  btn.onclick = () => speak(en); // При клике озвучиваем английское слово
  
  // Создаем текст
  const span = document.createElement('span');
  span.innerHTML = `<span class="word-en">${en}</span> — <span class="word-ru">${ru}</span>`;
  
  // Собираем вместе
  li.appendChild(btn);
  li.appendChild(span);
  wordsEl.appendChild(li);
});
