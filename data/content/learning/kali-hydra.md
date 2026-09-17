---
id: kali-hydra
category: Обучение
title: Hydra — Очень быстрый взломщик входа в сеть
excerpt: Hydra — это параллельный взломщик входов в систему, который поддерживает множество протоколов для атак. Он очень быстрый и гибкий, а новые модули легко добавлять.
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: Hydra — Очень быстрый взломщик входа в сеть
metaDescription: Hydra — это параллельный взломщик входов в систему, который поддерживает множество протоколов для атак. Он очень быстрый и гибкий, а новые модули легк
source: kali.org
sourceUrl: https://www.kali.org/tools/hydra/
---

<h2>Что это</h2>
<p>Hydra — это параллельный взломщик входов в систему, который поддерживает множество протоколов для атак. Он очень быстрый и гибкий, а новые модули легко добавлять.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# dpl4hydra -h
dpl4hydra v0.9.9 (c) 2012 by Roland Kessler (@rokessler)

Syntax: dpl4hydra [help] | [refresh] | [BRAND] | [all]

This script depends on a local (d)efault (p)assword (l)ist called
/root/.dpl4hydra/dpl4hydra_full.csv. If it is not available, regenerate it with
'dpl4hydra refresh'. Source of the default password list is
http://open-sez.me

Options:
  help        Help: Show this message
  refresh     Refresh list: Download the full (d)efault (p)assword (l)ist
              and generate a new local /root/.dpl4hydra/dpl4hydra_full.csv file. Takes time!
  BRAND       Generates a (d)efault (p)assword (l)ist from the local file
              /root/.dpl4hydra/dpl4hydra_full.csv, limiting the output to BRAND systems, using
              the format username:password (as required by THC hydra).
              The output file is called dpl4hydra_BRAND.lst.
  all         Dump list of all systems credentials into dpl4hydra_all.lst.

Example:
# dpl4hydra linksys
File dpl4hydra_linksys.lst was created with 20 entries.
# hydra -C ./dpl4hydra_linksys.lst -t 1 192.168.1.1 http-get /index.asp</code></pre>
<h2>Пакеты и установка</h2>
<h3>hydra</h3>
<p><strong>Очень быстрый взломщик входа в сеть</strong><br>Установка: <code>sudo apt install hydra</code></p>
<h3>hydra-gtk</h3>
<p><strong>Очень быстрый взломщик входа в сеть — графический интерфейс на базе GTK+</strong><br>Установка: <code>sudo apt install hydra-gtk</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/hydra/" target="_blank" rel="noopener">https://www.kali.org/tools/hydra/</a></p>
