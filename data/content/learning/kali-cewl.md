---
id: kali-cewl
category: Обучение
title: Cewl — Генератор собственного списка слов
excerpt: CeWL (Custom Word List generator) is a ruby app which spiders a given URL, up to a specified depth, and returns a list of words which can then be used for password crackers such as John the Ripper. При желании CeWL может переходить по внешн
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: Cewl — Генератор собственного списка слов
metaDescription: CeWL (Custom Word List generator) is a ruby app which spiders a given URL, up to a specified depth, and returns a list of words which can then be used
source: kali.org
sourceUrl: https://www.kali.org/tools/cewl/
---

<h2>Что это</h2>
<p>CeWL (Custom Word List generator) is a ruby app which spiders a given URL, up to a specified depth, and returns a list of words which can then be used for password crackers such as John the Ripper. При желании CeWL может переходить по внешним ссылкам.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>CeWL (Custom Word List generator) is a ruby app which spiders a given URL, up to a specified depth, and returns a list of words which can then be used for password crackers such as John the Ripper. Optionally, CeWL can follow external links.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# cewl -h
CeWL 6.2.1 (More Fixes) Robin Wood ([email&#160;protected]) (https://digi.ninja/)
Usage: cewl [OPTIONS] ... &lt;url>

    OPTIONS:
	-h, --help: Show help.
	-k, --keep: Keep the downloaded file.
	-d &lt;x>,--depth &lt;x>: Depth to spider to, default 2.
	-m, --min_word_length: Minimum word length, default 3.
	-x, --max_word_length: Maximum word length, default unset.
	-o, --offsite: Let the spider visit other sites.
	--exclude: A file containing a list of paths to exclude
	--allowed: A regex pattern that path must match to be followed
	-w, --write: Write the output to the file.
	-u, --ua &lt;agent>: User agent to send.
	-n, --no-words: Don't output the wordlist.
	-g &lt;x>, --groups &lt;x>: Return groups of words as well
	--lowercase: Lowercase all parsed words
	--with-numbers: Accept words with numbers in as well as just letters
	--convert-umlauts: Convert common ISO-8859-1 (Latin-1) umlauts (ä-ae, ö-oe, ü-ue, ß-ss)
	-a, --meta: include meta data.
	--meta_file file: Output file for meta data.
	-e, --email: Include email addresses.
	--email_file &lt;file>: Output file for email addresses.
	--meta-temp-dir &lt;dir>: The temporary directory used by exiftool when parsing files, default /tmp.
	-c, --count: Show the count for each word found.
	-v, --verbose: Verbose.
	--debug: Extra debug information.

	Authentication
	--auth_type: Digest or basic.
	--auth_user: Authentication username.
	--auth_pass: Authentication password.

	Proxy Support
	--proxy_host: Proxy host.
	--proxy_port: Proxy port, default 8080.
	--proxy_username: Username for proxy, if required.
	--proxy_password: Password for proxy, if required.

	Headers
	--header, -H: In format name:value - can pass multiple.

    &lt;url>: The site to spider.</code></pre>
<h2>Пакеты и установка</h2>
<h3>cewl</h3>
<p><strong>Генератор собственного списка слов</strong><br>Установка: <code>sudo apt install cewl</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/cewl/" target="_blank" rel="noopener">https://www.kali.org/tools/cewl/</a></p>
