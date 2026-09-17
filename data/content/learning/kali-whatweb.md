---
id: kali-whatweb
category: Обучение
title: Whatweb — Веб-сканер нового поколения
excerpt: WhatWeb идентифицирует веб-сайты. Он распознает веб-технологии, включая системы управления контентом (CMS), платформы для блогов, пакеты статистики/аналитики, библиотеки JavaScript, веб-серверы и встроенные устройства.
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Whatweb — Веб-сканер нового поколения
metaDescription: WhatWeb идентифицирует веб-сайты. Он распознает веб-технологии, включая системы управления контентом (CMS), платформы для блогов, пакеты статистики/ан
source: kali.org
sourceUrl: https://www.kali.org/tools/whatweb/
---

<h2>Что это</h2>
<p>WhatWeb идентифицирует веб-сайты. Он распознает веб-технологии, включая системы управления контентом (CMS), платформы для блогов, пакеты статистики/аналитики, библиотеки JavaScript, веб-серверы и встроенные устройства.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>WhatWeb identifies websites. It recognises web technologies including content management systems (CMS), blogging platforms, statistic/analytics packages, JavaScript libraries, web servers, and embedded devices.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# whatweb -h

.$$$     $.                                   .$$$     $.
$$$$     $$. .$$$  $$$ .$$$$$$.  .$$$$$$$$$$. $$$$     $$. .$$$$$$$. .$$$$$$.
$ $$     $$$ $ $$  $$$ $ $$$$$$. $$$$$ $$$$$$ $ $$     $$$ $ $$   $$ $ $$$$$$.
$ `$     $$$ $ `$  $$$ $ `$  $$$ $$' $ `$ `$$ $ `$     $$$ $ `$      $ `$  $$$'
$. $     $$$ $. $$$$$$ $. $$$$$$ `$  $. $  :' $. $     $$$ $. $$$$   $. $$$$$.
$::$  .  $$$ $::$  $$$ $::$  $$$     $::$     $::$  .  $$$ $::$      $::$  $$$$
$;;$ $$$ $$$ $;;$  $$$ $;;$  $$$     $;;$     $;;$ $$$ $$$ $;;$      $;;$  $$$$
$$$$$$ $$$$$ $$$$  $$$ $$$$  $$$     $$$$     $$$$$$ $$$$$ $$$$$$$$$ $$$$$$$$$'


WhatWeb - Next generation web scanner version 0.6.4.
Developed by Andrew Horton (urbanadventurer) and Brendan Coles (bcoles).
Homepage: https://morningstarsecurity.com/research/whatweb

Usage: whatweb [options] &lt;URLs>

TARGET SELECTION:
  &lt;TARGETs>			Enter URLs, hostnames, IP addresses, filenames or
  				IP ranges in CIDR, x.x.x-x, or x.x.x.x-x.x.x.x
  				format.
  --input-file=FILE, -i		Read targets from a file. You can pipe
				hostnames or URLs directly with -i /dev/stdin.

TARGET MODIFICATION:
  --url-prefix			Add a prefix to target URLs.
  --url-suffix			Add a suffix to target URLs.
  --url-pattern			Insert the targets into a URL.
				e.g. example.com/%insert%/robots.txt

AGGRESSION:
The aggression level controls the trade-off between speed/stealth and
reliability.
  --aggression, -a=LEVEL	Set the aggression level. Default: 1.
  1. Stealthy			Makes one HTTP request per target and also
  				follows redirects.
  3. Aggressive			If a level 1 plugin is matched, additional
  				requests will be made.
  4. Heavy			Makes a lot of HTTP requests per target. URLs
  				from all plugins are attempted.

HTTP OPTIONS:
  --user-agent, -U=AGENT	Id</code></pre>
<h2>Пакеты и установка</h2>
<h3>whatweb</h3>
<p><strong>Веб-сканер нового поколения</strong><br>Установка: <code>sudo apt install whatweb</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/whatweb/" target="_blank" rel="noopener">https://www.kali.org/tools/whatweb/</a></p>
