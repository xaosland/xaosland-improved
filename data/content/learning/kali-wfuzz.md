---
id: kali-wfuzz
category: Обучение
title: Wfuzz — Брутфорсер веб-приложений
excerpt: Wfuzz — это инструмент, предназначенный для перебора веб-приложений. Его можно использовать для поиска ресурсов, не связанных с каталогами, сервлетами, скриптами и т. д., параметров GET и POST для перебора различных типов инъекций (SQL, XSS
date: 2026-09-17
readTime: 2
tags: [kali, веб-уязвимости]
featured: false
popular: false
image: ""
metaTitle: Wfuzz — Брутфорсер веб-приложений
metaDescription: Wfuzz — это инструмент, предназначенный для перебора веб-приложений. Его можно использовать для поиска ресурсов, не связанных с каталогами, сервлетами
source: kali.org
sourceUrl: https://www.kali.org/tools/wfuzz/
---

<h2>Что это</h2>
<p>Wfuzz — это инструмент, предназначенный для перебора веб-приложений. Его можно использовать для поиска ресурсов, не связанных с каталогами, сервлетами, скриптами и т. д., параметров GET и POST для перебора различных типов инъекций (SQL, XSS, LDAP и т. д.), перебора параметров форм (пользователь/пароль), фаззинга и т. д.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Wfuzz is a tool designed for bruteforcing Web Applications, it can be used for finding resources not linked directories, servlets, scripts, etc, bruteforce GET and POST parameters for checking different kind of injections (SQL, XSS, LDAP,etc), bruteforce Forms parameters (User/Password), Fuzzing, etc.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# wfuzz --help
default
default
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
*                                                      *
* Version up to 1.4c coded by:                         *
* Christian Martorella ([email&#160;protected]) *
* Carlos del ojo ([email&#160;protected])                   *
*                                                      *
* Version 1.4d to 3.1.0 coded by:                      *
* Xavier Mendez ([email&#160;protected])            *
********************************************************

Usage:	wfuzz [options] -z payload,params &lt;url>

	FUZZ, ..., FUZnZ  wherever you put these keywords wfuzz will replace them with the values of the specified payload.
	FUZZ{baseline_value} FUZZ will be replaced by baseline_value. It will be the first request performed and could be used as a base for filtering.


Options:
	-h/--help                 : This help
	--help                    : Advanced help
	--filter-help             : Filter language specification
	--version                 : Wfuzz version details
	-e &lt;type>                 : List of available encoders/payloads/iterators/printers/scripts
	
	--recipe &lt;filename>       : Reads options from a recipe. Repeat for various recipes.
	--dump-recipe &lt;filename>  : Prints current options as a recipe
	--oF &lt;filename>           : Saves fuzz results to a file. These can be consumed later using the wfuzz payload.
	
	-c                        : Output with colors
	-v                        : Verbose information.
	-f filename,printer       : Store results in the output file using the specified printer (raw printer if omitted).
	-o printer                : Show results using the specified printer.
	--interact                : (beta) </code></pre>
<h2>Пакеты и установка</h2>
<h3>wfuzz</h3>
<p><strong>Брутфорсер веб-приложений</strong><br>Установка: <code>sudo apt install wfuzz</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/wfuzz/" target="_blank" rel="noopener">https://www.kali.org/tools/wfuzz/</a></p>
