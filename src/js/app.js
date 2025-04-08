import { ajax } from 'rxjs/ajax';
import { timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:3000/messages/unread';

// Функция для сокращения текста
const truncateText = (text, maxLength = 15) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Форматирование даты
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  return `${hours}:${minutes} ${day}.${month}.${date.getFullYear()}`;
};

// присваивание класса сообщению
function applyClass() {
  const container = document.querySelector('.msgs-container');
  return container.children.length === 0 ? 'msg, first-msg' : 'msg';
}

// Создание элемента сообщения
const createMessageElement = (msg) => {
  const msgElement = document.createElement('div');
  msgElement.className = applyClass();
  
  msgElement.innerHTML = `
    <div class="email">${msg.from}</div>
    <div class="message-body">${truncateText(msg.subject)}</div>
    <div class="received">${formatDate(msg.received)}</div>
  `;
  
  return msgElement;
};

// Поток запросов
const messageStream$ = timer(0, 3000).pipe(
  switchMap(() => 
    ajax.getJSON(API_URL).pipe(
      catchError(error => {
        console.error('Error:', error);
        return [];
      })
    )
  )
);

// Подписка на поток
messageStream$.subscribe({
  next: (response) => {
    const container = document.querySelector('.msgs-container');
    
    response.messages.forEach(msg => {
      container.insertBefore(createMessageElement(msg), container.firstChild);
    });
    
  },
  error: (err) => console.error('Error:', err)
});