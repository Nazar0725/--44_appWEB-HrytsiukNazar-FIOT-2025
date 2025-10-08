// Знаходимо елементи у документі
const burger = document.querySelector('.burger'); // кнопка бургер-меню
const navLinks = document.querySelector('.nav-links'); // блок із навігаційними посиланнями

// Додаємо подію "клік" на бургер
burger.addEventListener('click', () => {
  // При кліку перемикаємо клас "active" — він показує або ховає меню
  navLinks.classList.toggle('active');
});
