---
id: kali-recon-ng
category: Обучение
title: Recon-ng — Фреймворк веб-разведки, написанный на Python
excerpt: Recon-ng — это полнофункциональная платформа веб-разведки, написанная на Python. Благодаря независимым модулям, взаимодействию с базой данных, встроенным удобным функциям, интерактивной справке и дополнению команд, Recon-ng обеспечивает мощ
date: 2026-09-17
readTime: 2
tags: [kali, сканирование и разведка]
featured: false
popular: false
image: ""
metaTitle: Recon-ng — Фреймворк веб-разведки, написанный на Python
metaDescription: Recon-ng — это полнофункциональная платформа веб-разведки, написанная на Python. Благодаря независимым модулям, взаимодействию с базой данных, встроен
source: kali.org
sourceUrl: https://www.kali.org/tools/recon-ng/
---

<h2>Что это</h2>
<p>Recon-ng — это полнофункциональная платформа веб-разведки, написанная на Python. Благодаря независимым модулям, взаимодействию с базой данных, встроенным удобным функциям, интерактивной справке и дополнению команд, Recon-ng обеспечивает мощную среду, в которой веб-разведка с открытым исходным кодом может проводиться быстро и тщательно.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Recon-ng is a full-featured Web Reconnaissance framework written in Python. Complete with independent modules, database interaction, built in convenience functions, interactive help, and command completion, Recon-ng provides a powerful environment in which open source web-based reconnaissance can be conducted quickly and thoroughly.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# recon-cli -h
usage: recon-cli [-h] [-w workspace] [-C command] [-c command] [-G]
                 [-g name=value] [-M] [-m module] [-O] [-o name=value] [-x]
                 [--no-version] [--no-analytics] [--no-marketplace]
                 [--stealth] [--version] [--analytics]

recon-cli - Tim Tomes (@lanmaster53)

options:
  -h, --help        show this help message and exit
  -w workspace      load/create a workspace
  -C command        runs a command at the global context
  -c command        runs a command at the module context (pre-run)
  -G                show available global options
  -g name=value     set a global option (can be used more than once)
  -M                show modules
  -m module         specify the module
  -O                show available module options
  -o name=value     set a module option (can be used more than once)
  -x                run the module
  --no-version      disable version check. Already disabled by default in
                    Debian
  --no-analytics    disable analytics reporting. Already disabled by default
                    in Debian
  --no-marketplace  disable remote module management
  --stealth         disable all passive requests (--no-*)
  --version         displays the current version
  --analytics       enable analytics reporting. Send analytics to google</code></pre>
<h2>Пакеты и установка</h2>
<h3>recon-ng</h3>
<p><strong>Фреймворк веб-разведки, написанный на Python</strong><br>Установка: <code>sudo apt install recon-ng</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/recon-ng/" target="_blank" rel="noopener">https://www.kali.org/tools/recon-ng/</a></p>
