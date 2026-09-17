---
id: kali-bettercap
category: Обучение
title: Bettercap — Полная, модульная, портативная и легко расширяемая платформа MITM.
excerpt: Швейцарский армейский нож для разведки сетей 802.11, BLE, IPv4 и IPv6 и атак MITM.
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Bettercap — Полная, модульная, портативная и легко расширяем
metaDescription: Швейцарский армейский нож для разведки сетей 802.11, BLE, IPv4 и IPv6 и атак MITM.
source: kali.org
sourceUrl: https://www.kali.org/tools/bettercap/
---

<h2>Что это</h2>
<p>Швейцарский армейский нож для разведки сетей 802.11, BLE, IPv4 и IPv6 и атак MITM.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>The Swiss Army knife for 802.11, BLE, IPv4 and IPv6 networks reconnaissance and MITM attacks.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# bettercap -h
Usage of bettercap:
  -autostart string
    	Comma separated list of modules to auto start. (default "events.stream")
  -caplet string
    	Read commands from this file and execute them in the interactive session.
  -caplets-path string
    	Specify an alternative base path for caplets.
  -cpu-profile file
    	Write cpu profile file.
  -debug
    	Print debug messages.
  -env-file string
    	Load environment variables from this file if found, set to empty to disable environment persistence.
  -eval string
    	Run one or more commands separated by ; in the interactive session, used to set variables via command line.
  -gateway-override string
    	Use the provided IP address instead of the default gateway. If not specified or invalid, the default gateway will be used.
  -iface string
    	Network interface to bind to, if empty the default interface will be auto selected.
  -mem-profile file
    	Write memory profile to file.
  -no-colors
    	Disable output color effects.
  -no-history
    	Disable interactive session history file.
  -pcap-buf-size int
    	PCAP buffer size, leave to 0 for the default value. (default -1)
  -script string
    	Load a session script.
  -silent
    	Suppress all logs which are not errors.
  -version
    	Print the version and exit.</code></pre>
<h2>Пакеты и установка</h2>
<h3>bettercap</h3>
<p><strong>Полная, модульная, портативная и легко расширяемая платформа MITM.</strong><br>Установка: <code>sudo apt install bettercap</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/bettercap/" target="_blank" rel="noopener">https://www.kali.org/tools/bettercap/</a></p>
