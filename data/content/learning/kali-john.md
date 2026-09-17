---
id: kali-john
category: Обучение
title: John — Инструмент для активного взлома паролей
excerpt: John the Ripper — это инструмент, предназначенный для того, чтобы помочь системным администраторам находить слабые (легко угадать или взломать с помощью грубой силы) пароли и даже автоматически предупреждать пользователей об этом по электро
date: 2026-09-17
readTime: 2
tags: [kali, подбор паролей]
featured: false
popular: false
image: ""
metaTitle: John — Инструмент для активного взлома паролей
metaDescription: John the Ripper — это инструмент, предназначенный для того, чтобы помочь системным администраторам находить слабые (легко угадать или взломать с помощ
source: kali.org
sourceUrl: https://www.kali.org/tools/john/
---

<h2>Что это</h2>
<p>John the Ripper — это инструмент, предназначенный для того, чтобы помочь системным администраторам находить слабые (легко угадать или взломать с помощью грубой силы) пароли и даже автоматически предупреждать пользователей об этом по электронной почте, если это необходимо.</p>
<details><summary>Оригинал описания (EN)</summary>
<p>John the Ripper is a tool designed to help systems administrators to find weak (easy to guess or crack through brute force) passwords, and even automatically mail users warning them about it, if it is desired.</p>
</details>
<h2>Пример использования</h2>
<pre><code class="language-bash">root@kali:~# man SIPdump
SIPDUMP(1)                  General Commands Manual                  SIPDUMP(1)

NAME
     sipdump - Part of SIPcrack, A suite of tools to sniff and crack the digest
     authentications within the SIP protocol.

SYNOPSIS
     sipdump [options] &lt;dump_file>

DESCRIPTION
     This manual page documents briefly the sipdump tool

     Session Initiation Protocol (SIP) is a protocol developed by the IETF MMU-
     SIC  Working  Group  and is a proposed standard for initiating, modifying,
     and terminating an interactive user session that involves multimedia  ele-
     ments  such  as video, voice, instant messaging, online games, and virtual
     reality.

     In November 2000, SIP was accepted as a 3GPP signaling protocol and perma-
     nent element of the IMS architecture.  It is one of the leading signalling
     protocols for Voice over IP, along with H.323. In most VOIP solutions  SIP
     is  used to authenticate the SIPclient.  The protocol is documented inside
     the RFC at www.ietf.org/rfc/rfc3261.txt

     SIPcrack is a SIP login sniffer/cracker that contains 2 programs:  sipdump
     to  capture  the digest authentication and sipcrack to bruteforce the hash
     using a wordlist or standard input.
     sipdump dumps SIP digest authentications. If a login is found, the sniffed
     login is written to the dump file.  See 'sipdump -h' for options.
     sipcrack bruteforces the user's password with the dump file  generated  by
     sipdump. If a password is found, the sniffed and cracked login will be up-
     dated in the dump file.
     See 'sipcrack -h' for options.

OPTIONS
     A summary of options is included below.

     -i interface,
            interface to listen on

     -p pcap_file,
            use pcap data file

     -m,</code></pre>
<h2>Пакеты и установка</h2>
<h3>john</h3>
<p><strong>Инструмент для активного взлома паролей</strong><br>Установка: <code>sudo apt install john</code></p>
<h3>john-data</h3>
<p><strong>Инструмент для активного взлома паролей — наборы символов</strong><br>Установка: <code>sudo apt install john-data</code></p>
<h2>Официальная документация</h2>
<p><a href="https://www.kali.org/tools/john/" target="_blank" rel="noopener">https://www.kali.org/tools/john/</a></p>
