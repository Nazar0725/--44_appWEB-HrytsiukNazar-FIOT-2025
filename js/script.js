// Загальний скрипт для index.html і rations.html
document.addEventListener('DOMContentLoaded', () => {
  // Елементи
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const adminLinks = document.querySelectorAll('#adminLoginLink'); // може бути на двох сторінках
  const logoutBtns = document.querySelectorAll('#logoutAdminBtn');
  const addBtn = document.getElementById('addRationBtn');

  // Покаж/схов меню (бургер)
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Перевіряємо чи вже в адмін-режимі (sessionStorage)
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  if (isAdmin) enableAdminMode(true);

  // Налагодження посилань "Адміністратор" (може бути більше одного на сторінці)
  adminLinks.forEach(link => {
    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      // Запит логіну
      const login = prompt("Введіть логін:");
      const pass = prompt("Введіть пароль:");
      if (login === "admin" && pass === "1234") {
        sessionStorage.setItem('isAdmin', 'true');
        enableAdminMode(true);
        alert("Вхід виконано успішно!");
      } else {
        alert("Невірний логін або пароль!");
      }
    });
  });

  // Logout кнопки (може бути декілька, залежно від сторінки)
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sessionStorage.removeItem('isAdmin');
      enableAdminMode(false);
      alert('Вихід з режиму адміністратора виконано.');
    });
  });

  // Додавання картки (якщо кнопка є)
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const title = prompt("Назва картки:");
      const desc = prompt("Опис картки:");
      const imgSrc = prompt("URL зображення:");

      if (!title || !desc || !imgSrc) {
        alert('Заповніть усі поля (назва, опис, URL).');
        return;
      }

      const grid = document.querySelector('.rations-grid');
      if (!grid) return;

      const newCard = document.createElement('div');
      newCard.classList.add('ration-card');
      newCard.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(title)}" />
        <h3>${escapeHtml(title)}</h3>
        <h4 class="price">--</h4>
        <p class="desc">${escapeHtml(desc).replace(/\n/g,'<br>')}</p>
        <div class="card-controls">
          <button class="admin-btn edit-btn" style="display:none;">Редагувати</button>
          <button class="admin-btn delete-btn" style="display:none;">Видалити</button>
        </div>
      `;
      grid.appendChild(newCard);
      if (sessionStorage.getItem('isAdmin') === 'true') showAdminControls(true);
    });
  }

  // Делегування кліків: редагування, видалення, розгортання картки
  document.addEventListener('click', (e) => {
    const target = e.target;

    // Видалення
    if (target.classList.contains('delete-btn')) {
      const card = target.closest('.ration-card');
      if (card && confirm('Видалити цю картку?')) card.remove();
      return;
    }

    // Редагування
    if (target.classList.contains('edit-btn')) {
      const card = target.closest('.ration-card');
      if (!card) return;
      const currentTitle = card.querySelector('h3')?.textContent || '';
      const currentDesc = card.querySelector('.desc')?.textContent || '';
      const currentImg = card.querySelector('img')?.src || '';

      const newTitle = prompt('Нова назва картки:', currentTitle);
      const newDesc = prompt('Новий опис картки:', currentDesc);
      const newImg = prompt('Новий URL зображення:', currentImg);

      if (newTitle) card.querySelector('h3').textContent = newTitle;
      if (newDesc) card.querySelector('.desc').innerHTML = escapeHtml(newDesc).replace(/\n/g,'<br>');
      if (newImg) card.querySelector('img').src = newImg;
      return;
    }

    // Розгортання / згортання картки
    const card = target.closest('.ration-card');
    if (!card) return;

    // Якщо клік по адмін-кнопці або всередині control (щоб не переключати)
    if (target.closest('.card-controls') || target.classList.contains('admin-btn')) return;

    // Toggle — закриваємо інші, відкриваємо поточну якщо була закрита
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.ration-card.open').forEach(c => c.classList.remove('open'));
    if (!isOpen) card.classList.add('open');
  });

  // Функція: вмикає/вимикає адмін-режим на поточній сторінці
  function enableAdminMode(enable) {
    // Показати або сховати всі admin-btn
    showAdminControls(enable);

    // Показати logout кнопку(и) якщо є
    document.querySelectorAll('#logoutAdminBtn').forEach(b => {
      b.style.display = enable ? 'inline-block' : 'none';
    });

    // Показати add button якщо є
    const add = document.getElementById('addRationBtn');
    if (add) add.style.display = enable ? 'inline-block' : 'none';
  }

  // Показати / сховати admin кнопки у картках і глобальні admin-btn
  function showAdminControls(show) {
    document.querySelectorAll('.admin-btn').forEach(btn => {
      // Якщо це глобальна кнопка додавання або виходу — їхнє оформлення контролюється окремо
      if (btn.id === 'addRationBtn' || btn.id === 'logoutAdminBtn') {
        btn.style.display = show ? 'inline-block' : 'none';
        return;
      }
      // Кнопки всередині карток
      if (btn.closest('.card-controls')) {
        btn.style.display = show ? 'inline-block' : 'none';
      } else {
        // інші admin-btn (наприклад, глобальні кнопки в header)
        if (btn.classList.contains('logout-btn')) {
          btn.style.display = show ? 'inline-block' : 'none';
        } else {
          // інші глобальні admin btn
          btn.style.display = show ? 'inline-block' : 'none';
        }
      }
    });
  }

  // Простий escape для вставки тексту в innerHTML без XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
