---
id: burp-dvwa-web-lab
category: Обучение
title: Burp Suite + DVWA: лаборатория веб‑запросов на локальном стенде
excerpt: Поднимаем DVWA в Docker, подключаем браузер к Burp Suite и учимся читать, повторять и документировать HTTP‑запросы без выхода в интернет.
date: 2026-09-17
readTime: 15
featured: false
popular: false
tags: [burp suite, dvwa, веб-безопасность, лаборатория]
lab: true
labTools: [Burp Suite, DVWA, Docker]
labLevel: Начальный
image: ""
metaTitle: Burp Suite + DVWA: лаборатория веб‑запросов на локальном стенде
metaDescription: Поднимаем DVWA в Docker, подключаем браузер к Burp Suite и учимся читать, повторять и документировать HTTP‑запросы без выхода в интернет.
source: xaosland
sourceUrl: https://xaosland.ru/learning/burp-dvwa-web-lab/
---

<div class="lab-notice"><strong>⚖️ Безопасность и законность.</strong> Выполняйте лабораторию только на своих устройствах, в изолированной виртуальной сети или при наличии письменного разрешения владельца. Не сканируйте, не перехватывайте и не атакуйте чужие системы, Wi‑Fi и домены. Примеры ниже намеренно используют localhost, тестовые стенды, собственные файлы и RFC 5737/документационные домены.</div>

<h2>Что изучаем</h2><p>DVWA — намеренно уязвимое приложение для локального обучения. Burp будет прокси между браузером и контейнером; запросы не должны покидать ваш компьютер.</p><h2>1. Запустить стенд</h2><pre><code class="language-bash">docker run --rm --name dvwa-lab -p 127.0.0.1:8080:80 ghcr.io/digininja/dvwa:latest
# открыть в браузере http://127.0.0.1:8080</code></pre><p>Оставляйте привязку к 127.0.0.1. После занятия остановите контейнер: <code>docker stop dvwa-lab</code>.</p><h2>2. Настроить Burp</h2><p>Установите <a href="https://portswigger.net/burp/communitydownload">Burp Suite Community</a>, включите Proxy → Intercept и настройте браузер на HTTP‑прокси <code>127.0.0.1:8080</code> (если DVWA использует этот порт, выберите для Burp, например, 8081 и запускайте контейнер на 8080). Для HTTPS в реальной тестовой среде сертификат Burp устанавливается только в отдельный профиль.</p><h2>3. Наблюдать и повторять запрос</h2><ol><li>Войдите в DVWA с тестовыми учётными данными стенда.</li><li>В Proxy → HTTP history найдите запрос к локальному приложению.</li><li>Отправьте копию в Repeater, измените только один параметр и сравните статус, длину ответа и заголовки.</li><li>Сохраните скриншот без паролей и составьте таблицу «запрос → наблюдение → риск → исправление».</li></ol><pre><code class="language-bash">curl -i http://127.0.0.1:8080/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/</code></pre><h2>4. Закрыть лабораторию</h2><p>Выключите Intercept, удалите контейнер и очистите историю прокси. Не переносите DVWA на публичный IP: его уязвимости предназначены только для изолированного обучения.</p><p><a href="https://portswigger.net/web-security">Web Security Academy</a> · <a href="https://github.com/digininja/DVWA">DVWA на GitHub</a></p>
