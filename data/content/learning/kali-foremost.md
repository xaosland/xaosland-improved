---
id: kali-foremost
category: Обучение
title: Foremost — Криминалистическая программа для восстановления потерянных файлов
excerpt: Foremost — это судебно-медицинская программа для восстановления утерянных файлов на основе их заголовков, нижних колонтитулов и внутренних структур данных.
date: 2026-09-17
readTime: 2
tags: [kali, форензика]
featured: false
popular: false
image: ""
metaTitle: Foremost — Криминалистическая программа для восстановления п
metaDescription: Foremost — это судебно-медицинская программа для восстановления утерянных файлов на основе их заголовков, нижних колонтитулов и внутренних структур да
source: kali.org
sourceUrl: https://www.kali.org/tools/foremost/
---

<h2>Что это</h2>
<p>Foremost — это судебно-медицинская программа для восстановления утерянных файлов на основе их заголовков, нижних колонтитулов и внутренних структур данных.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Foremost is a forensic program to recover lost files based on their headers, footers, and internal data structures.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# foremost -h
foremost version 1.5.7 by Jesse Kornblum, Kris Kendall, and Nick Mikus.
$ foremost [-v|-V|-h|-T|-Q|-q|-a|-w-d] [-t &lt;type>] [-s &lt;blocks>] [-k &lt;size>] 
	[-b &lt;size>] [-c &lt;file>] [-o &lt;dir>] [-i &lt;file] 

-V  - display copyright information and exit
-t  - specify file type.  (-t jpeg,pdf ...) 
-d  - turn on indirect block detection (for UNIX file-systems) 
-i  - specify input file (default is stdin) 
-a  - Write all headers, perform no error detection (corrupted files) 
-w  - Only write the audit file, do not write any detected files to the disk 
-o  - set output directory (defaults to output)
-c  - set configuration file to use (defaults to foremost.conf)
-q  - enables quick mode. Search are performed on 512 byte boundaries.
-Q  - enables quiet mode. Suppress output messages. 
-v  - verbose mode. Logs all messages to screen</code></pre>
<h2>Пакеты и установка</h2>
<h3>foremost</h3>
<p><strong>Криминалистическая программа для восстановления потерянных файлов</strong><br>Установка: <code>sudo apt install foremost</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/foremost/" target="_blank" rel="noopener">https://www.kali.org/tools/foremost/</a></p>
