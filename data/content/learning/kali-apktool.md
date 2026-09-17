---
id: kali-apktool
category: Обучение
title: Apktool — Инструмент для реверс-инжиниринга APK-файлов Android
excerpt: Инструмент для реверс-инжиниринга сторонних закрытых двоичных приложений Android. Он может декодировать ресурсы практически до исходной формы и восстанавливать их после внесения некоторых изменений; это позволяет шаг за шагом отлаживать код
date: 2026-09-17
readTime: 2
tags: [kali, реверс и анализ]
featured: false
popular: false
image: ""
metaTitle: Apktool — Инструмент для реверс-инжиниринга APK-файлов Andro
metaDescription: Инструмент для реверс-инжиниринга сторонних закрытых двоичных приложений Android. Он может декодировать ресурсы практически до исходной формы и восста
source: kali.org
sourceUrl: https://www.kali.org/tools/apktool/
---

<h2>Что это</h2>
<p>Инструмент для реверс-инжиниринга сторонних закрытых двоичных приложений Android. Он может декодировать ресурсы практически до исходной формы и восстанавливать их после внесения некоторых изменений; это позволяет шаг за шагом отлаживать код smali. Кроме того, это упрощает работу с приложением благодаря файловой структуре, напоминающей проект, и автоматизации некоторых повторяющихся задач, таких как создание apk.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>A tool for reverse engineering 3rd party, closed, binary Android apps. It can decode resources to nearly original form and rebuild them after making some modifications; it makes possible to debug smali code step by step. Also it makes working with an app easier because of project-like file structure and automation of some repetitive tasks like building apk.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# apktool -h
Apktool v2.7.0-dirty - a tool for reengineering Android apk files
with smali v2.5.2.git2771eae-debian and baksmali v2.5.2.git2771eae-debian
Copyright 2010 Ryszard Wi?niewski &lt;[email&#160;protected]>
Copyright 2010 Connor Tumbleson &lt;[email&#160;protected]>

usage: apktool
 -advance,--advanced   prints advance information.
 -version,--version    prints the version then exits
usage: apktool if|install-framework [options] &lt;framework.apk>
 -p,--frame-path &lt;dir>   Stores framework files into &lt;dir>.
 -t,--tag &lt;tag>          Tag frameworks using &lt;tag>.
usage: apktool d[ecode] [options] &lt;file_apk>
 -f,--force              Force delete destination directory.
 -o,--output &lt;dir>       The name of folder that gets written. Default is apk.out
 -p,--frame-path &lt;dir>   Uses framework files located in &lt;dir>.
 -r,--no-res             Do not decode resources.
 -s,--no-src             Do not decode sources.
 -t,--frame-tag &lt;tag>    Uses framework files tagged by &lt;tag>.
usage: apktool b[uild] [options] &lt;app_path>
 -f,--force-all          Skip changes detection and build all files.
 -o,--output &lt;dir>       The name of apk that gets written. Default is dist/name.apk
 -p,--frame-path &lt;dir>   Uses framework files located in &lt;dir>.

For additional info, see: https://ibotpeaches.github.io/Apktool/ 
For smali/baksmali info, see: https://github.com/JesusFreke/smali</code></pre>
<h2>Пакеты и установка</h2>
<h3>apktool</h3>
<p><strong>Инструмент для реверс-инжиниринга APK-файлов Android</strong><br>Установка: <code>sudo apt install apktool</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/apktool/" target="_blank" rel="noopener">https://www.kali.org/tools/apktool/</a></p>
