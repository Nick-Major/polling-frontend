import { ajax } from 'rxjs/ajax';
import { timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:3000/messages/unread';

// Функция для форматирования timestamp
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;
};

// Создаем поток сообщений
const messageStream$ = timer(0, 3000).pipe(
  switchMap(() => 
    ajax.getJSON(API_URL).pipe(
      catchError(error => {
        console.error('Ошибка:', error);
        return [];
      })
    )
  ),
  map(response => response.messages),
  map(messages => messages.map(msg => ({
    email: msg.from,
    subject: msg.subject,
    received: formatDate(msg.received)
  })))
);

// Функция для создания HTML-элемента сообщения
const createMessageElement = (msg) => {
  const msgElement = document.createElement('div');
  msgElement.className = 'msg';
  
  msgElement.innerHTML = `
    <div class="email">${msg.email}</div>
    <div class="message-body">${msg.subject}</div>
    <div class="received">${msg.received}</div>
  `;
  
  return msgElement;
};

// Подписка на поток и обновление DOM
messageStream$.subscribe(messages => {
  const container = document.querySelector('.msgs-container');
  
  // Очищаем контейнер перед добавлением новых сообщений
  container.innerHTML = '';
  
  // Добавляем каждое сообщение в DOM
  messages.forEach(msg => {
    container.appendChild(createMessageElement(msg));
  });
});