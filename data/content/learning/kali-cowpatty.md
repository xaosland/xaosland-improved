---
id: kali-cowpatty
category: Обучение
title: Cowpatty — Атака по словарю WPA методом перебора
excerpt: Если вы проверяете сети WPA-PSK или WPA2-PSK, вы можете использовать этот инструмент для выявления слабых парольных фраз, которые использовались для создания PMK. Предоставьте файл захвата libpcap, который включает четырехстороннее рукопожа
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: Cowpatty — Атака по словарю WPA методом перебора
metaDescription: Если вы проверяете сети WPA-PSK или WPA2-PSK, вы можете использовать этот инструмент для выявления слабых парольных фраз, которые использовались для с
source: kali.org
sourceUrl: https://www.kali.org/tools/cowpatty/
---

<h2>Что это</h2>
<p>Если вы проверяете сети WPA-PSK или WPA2-PSK, вы можете использовать этот инструмент для выявления слабых парольных фраз, которые использовались для создания PMK. Предоставьте файл захвата libpcap, который включает четырехстороннее рукопожатие, файл словаря паролей для подбора и SSID для сети.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>If you are auditing WPA-PSK or WPA2-PSK networks, you can use this tool to identify weak passphrases that were used to generate the PMK. Supply a libpcap capture file that includes the 4-way handshake, a dictionary file of passphrases to guess with, and the SSID for the network.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# cowpatty -h
cowpatty 4.8 - WPA-PSK dictionary attack. &lt;[email&#160;protected]>

Usage: cowpatty [options]

	-f 	Dictionary file
	-d 	Hash file (genpmk)
	-r 	Packet capture file
	-s 	Network SSID (enclose in quotes if SSID includes spaces)
	-c 	Check for valid 4-way frames, does not crack
	-h 	Print this help information and exit
	-v 	Print verbose information (more -v for more verbosity)
	-V 	Print program version and exit</code></pre>
<h2>Пакеты и установка</h2>
<h3>cowpatty</h3>
<p><strong>Атака по словарю WPA методом перебора</strong><br>Установка: <code>sudo apt install cowpatty</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/cowpatty/" target="_blank" rel="noopener">https://www.kali.org/tools/cowpatty/</a></p>
