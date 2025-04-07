import { ajax } from 'rxjs/ajax';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Создаем поток, который будет делать запрос каждые 3 секунды
const messages$ = timer(0, 3000).pipe(
    switchMap(() => ajax.getJSON('http://localhost:3000/messages/unread'))
);

// Подписываемся на поток
messages$.subscribe({
    next: (messages) => console.log('Новые сообщения:', messages),
    error: (err) => console.error('Ошибка:', err)
});