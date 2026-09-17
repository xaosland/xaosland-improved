---
id: kali-binwalk
category: Обучение
title: Binwalk — Библиотека инструментов для анализа двоичных объектов и исполняемого кода.
excerpt: Binwalk — это инструмент для поиска в заданном двоичном изображении встроенных файлов и исполняемого кода. В частности, он предназначен для идентификации файлов и кода, встроенного в образы прошивки. Binwalk использует библиотеку libmagic, 
date: 2026-09-17
readTime: 2
tags: [kali, форензика]
featured: false
popular: false
image: ""
metaTitle: Binwalk — Библиотека инструментов для анализа двоичных объек
metaDescription: Binwalk — это инструмент для поиска в заданном двоичном изображении встроенных файлов и исполняемого кода. В частности, он предназначен для идентифика
source: kali.org
sourceUrl: https://www.kali.org/tools/binwalk/
---

<h2>Что это</h2>
<p>Binwalk — это инструмент для поиска в заданном двоичном изображении встроенных файлов и исполняемого кода. В частности, он предназначен для идентификации файлов и кода, встроенного в образы прошивки. Binwalk использует библиотеку libmagic, поэтому она совместима с магическими сигнатурами, созданными для файловой утилиты Unix.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>Binwalk is a tool for searching a given binary image for embedded files and executable code. Specifically, it is designed for identifying files and code embedded inside of firmware images. Binwalk uses the libmagic library, so it is compatible with magic signatures created for the Unix file utility.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# binwalk -h

Binwalk v2.4.3
Original author: Craig Heffner, ReFirmLabs
https://github.com/OSPG/binwalk

Usage: binwalk [OPTIONS] [FILE1] [FILE2] [FILE3] ...

Disassembly Scan Options:
    -Y, --disasm                 Identify the CPU architecture of a file using the capstone disassembler
    -T, --minsn=&lt;int>            Minimum number of consecutive instructions to be considered valid (default: 500)
    -k, --continue               Don't stop at the first match

Signature Scan Options:
    -B, --signature              Scan target file(s) for common file signatures
    -R, --raw=&lt;str>              Scan target file(s) for the specified sequence of bytes
    -A, --opcodes                Scan target file(s) for common executable opcode signatures
    -m, --magic=&lt;file>           Specify a custom magic file to use
    -b, --dumb                   Disable smart signature keywords
    -I, --invalid                Show results marked as invalid
    -x, --exclude=&lt;str>          Exclude results that match &lt;str>
    -y, --include=&lt;str>          Only show results that match &lt;str>

Extraction Options:
    -e, --extract                Automatically extract known file types
    -D, --dd=&lt;type[:ext[:cmd]]>  Extract &lt;type> signatures (regular expression), give the files an extension of &lt;ext>, and execute &lt;cmd>
    -M, --matryoshka             Recursively scan extracted files
    -d, --depth=&lt;int>            Limit matryoshka recursion depth (default: 8 levels deep)
    -C, --directory=&lt;str>        Extract files/folders to a custom directory (default: current working directory)
    -j, --size=&lt;int>             Limit the size of each extracted file
    -n, --count=&lt;int>            Limit the number of extracted files
    -0, --run-as=&lt;str>           Execute external extraction u</code></pre>
<h2>Пакеты и установка</h2>
<h3>binwalk</h3>
<p><strong>Библиотека инструментов для анализа двоичных объектов и исполняемого кода.</strong><br>Установка: <code>sudo apt install binwalk</code></p>
<h3>python3-binwalk</h3>
<p><strong>Библиотека Python3 для анализа двоичных объектов и исполняемого кода.</strong><br>Установка: <code>sudo apt install python3-binwalk</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/binwalk/" target="_blank" rel="noopener">https://www.kali.org/tools/binwalk/</a></p>
