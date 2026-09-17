---
id: kali-phishery
category: Обучение
title: Phishery — Базовый сборщик учетных данных для аутентификации с инжектором шаблонов документов Word
excerpt: Этот пакет содержит HTTP-сервер с поддержкой простого SSL, основной целью которого является передача фишинговых учетных данных через базовую аутентификацию. Силу фишинга лучше всего можно продемонстрировать, установив в шаблоне документа Wo
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: Phishery — Базовый сборщик учетных данных для аутентификации
metaDescription: Этот пакет содержит HTTP-сервер с поддержкой простого SSL, основной целью которого является передача фишинговых учетных данных через базовую аутентифи
source: kali.org
sourceUrl: https://www.kali.org/tools/phishery/
---

<h2>Что это</h2>
<p>Этот пакет содержит HTTP-сервер с поддержкой простого SSL, основной целью которого является передача фишинговых учетных данных через базовую аутентификацию. Силу фишинга лучше всего можно продемонстрировать, установив в шаблоне документа Word фишинговый URL-адрес. Это заставляет Microsoft Word делать запрос к URL-адресу, в результате чего конечному пользователю отображается диалоговое окно аутентификации. Возможность внедрить URL-адрес в любой файл .docx возможна с помощью фишерских опций -i [in docx], -o [out docx] и -u [url].</p>
<details><summary>Оригинал описания (EN)</summary>
<p>This package contains a Simple SSL Enabled HTTP server with the primary purpose of phishing credentials via Basic Authentication. The power of phishery is best demonstrated by setting a Word document&rsquo;s template to a phishery URL. This causes Microsoft Word to make a request to the URL, resulting in an Authentication Dialog being shown to the end-user. The ability to inject any .docx file with a URL is possible using phishery&rsquo;s -i [in docx], -o [out docx], and -u [url] options.</p>
</details>
<h2>Пакеты и установка</h2>
<h3>phishery</h3>
<p><strong>Базовый сборщик учетных данных для аутентификации с инжектором шаблонов документов Word</strong><br>Установка: <code>sudo apt install phishery</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/phishery/" target="_blank" rel="noopener">https://www.kali.org/tools/phishery/</a></p>
